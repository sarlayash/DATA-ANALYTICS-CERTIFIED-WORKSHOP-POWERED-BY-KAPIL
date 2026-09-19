import express from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Bootstrap Admin credentials as per specification
// Admin username: kapiladmin, Admin password: admin123
// Handled securely on the server without client bundle leakage
const ADMIN_USER = process.env.ADMIN_USERNAME || 'kapiladmin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

const activeAdminTokens = new Set<string>();

// Admin Login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = 'admin_auth_' + crypto.randomBytes(32).toString('hex');
    activeAdminTokens.add(token);
    return res.json({
      success: true,
      role: 'admin',
      token,
      user: {
        uid: 'admin_kapil_master',
        username: 'kapiladmin',
        name: 'Kapil Narula',
        role: 'admin',
        email: 'kapiladmin@dataanalytics-workshop.internal',
        title: 'Lead Instructor & Platform Administrator'
      }
    });
  }

  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// Admin Verify endpoint
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (token && activeAdminTokens.has(token)) {
    return res.json({ valid: true, role: 'admin' });
  }
  return res.status(401).json({ valid: false, error: 'Unauthorized' });
});

// Gemini AI Learning Assistant
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

app.post('/api/ai/assistant', async (req, res) => {
  const { prompt, topic, context } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const promptLower = prompt.toLowerCase();
  // Check if learner is asking AI to solve an active quiz question
  const isAssessmentCheat =
    (promptLower.includes('quiz answer') || promptLower.includes('give me the answer to question')) &&
    !promptLower.includes('explain') &&
    !promptLower.includes('hint');

  if (isAssessmentCheat) {
    return res.json({
      reply: "As your AI Learning Coach, I can help you understand the concepts, logic, and syntax behind any problem, but I cannot provide direct answers to graded assessments. Would you like a guided hint or a breakdown of the core concept instead?"
    });
  }

  const systemInstruction = `You are the AI Learning Assistant for the "12-Day Job-Oriented Data Analytics Certified Workshop Powered by Kapil".
You help learners master SQL, BigQuery, Python (Pandas, NumPy), Excel (Formulas, Pivot Tables, Power Query), PowerPoint for Business Reporting, Power BI, DAX, Data Visualization, and GenAI for Analysts.

Guiding Principles:
1. Explain technical concepts simply with real-world business context (Fortune-500 analytics cases: retail, fintech, e-commerce, SaaS).
2. Provide concise code examples, formulas, and troubleshooting steps.
3. Keep responses structured: Short summary, Concept Explanation, Concrete Example/Syntax, and Industry Tip.
4. Support learning actively. Never do graded assignments or exam questions on behalf of learners.`;

  try {
    const ai = getAi();
    if (!ai) {
      // High-quality pedagogical fallback when API key is not yet set
      return res.json({
        reply: `### Conceptual Guidance (${topic || 'Data Analytics'})\n\n**Key Insight:**\nIn enterprise analytics, clarity and reproducibility are paramount. When working with **${topic || 'this technique'}**, always structure your process:\n\n1. **Data Shape & Types**: Verify column formats and handle null values first.\n2. **Transformation Logic**: Formulate the calculation step-by-step (e.g., aggregations with GROUP BY or groupby()).\n3. **Business Validation**: Ensure the metrics align with business intuition (e.g. margin % between 0-100%).\n\n*Pro Tip*: For your query "${prompt.slice(0, 60)}...", focus on isolating each stage of the analysis.`
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${systemInstruction}\n\nContext: ${context || 'Day-to-day analytics workshop'}\nSubject: ${topic || 'General Analytics'}\nLearner Question: ${prompt}`
    });

    return res.json({ reply: response.text || 'No response generated.' });
  } catch (error: any) {
    console.error('AI assistant error:', error);
    return res.status(500).json({ error: error.message || 'AI generation failed' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Data Analytics Workshop Enterprise Portal', timestamp: new Date().toISOString() });
});

// Vite middleware & Static file serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
