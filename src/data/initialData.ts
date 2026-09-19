import {
  UserProfile,
  SkillItem,
  Assignment,
  Announcement,
  PortalSettings,
  AttendanceRecord,
  AssignmentSubmission
} from '../types';

export const DEMO_LEARNERS: UserProfile[] = [];

export const INITIAL_SKILLS: SkillItem[] = [
  { id: 's-sql', name: 'SQL', domain: 'SQL & BigQuery', description: 'Multi-table queries, subqueries, complex aggregations and joins', level: 'Not Started', industryImportance: 'Critical' },
  { id: 's-bigquery', name: 'BigQuery', domain: 'SQL & BigQuery', description: 'Cloud data warehouse queries, partitioning, clustering, cost control', level: 'Not Started', industryImportance: 'Critical' },
  { id: 's-python', name: 'Python', domain: 'Python for Data Analytics', description: 'Data structures, custom functions, automation pipelines, and scripting', level: 'Not Started', industryImportance: 'Critical' },
  { id: 's-pandas', name: 'Pandas', domain: 'Python for Data Analytics', description: 'DataFrames, method chaining, groupbys, and tabular transforms', level: 'Not Started', industryImportance: 'Critical' },
  { id: 's-numpy', name: 'NumPy', domain: 'Python for Data Analytics', description: 'Vectorized math, ndarrays, broadcasting, numerical analysis', level: 'Not Started', industryImportance: 'High' },
  { id: 's-cleaning', name: 'Data Cleaning', domain: 'Data Preparation', description: 'Anomaly detection, missing value strategies, deduplication, regex', level: 'Not Started', industryImportance: 'Critical' },
  { id: 's-eda', name: 'EDA', domain: 'Exploratory Analysis', description: 'Hypothesis generation, distributions, correlations, outliers', level: 'Not Started', industryImportance: 'Critical' },
  { id: 's-excel', name: 'Excel', domain: 'MS Excel for Analytics', description: 'Advanced dynamic arrays, XLOOKUP, conditional formulas', level: 'Not Started', industryImportance: 'Critical' },
  { id: 's-pivots', name: 'Pivot Tables', domain: 'MS Excel for Analytics', description: 'Multi-dimensional slicing, calculated fields, dynamic timelines', level: 'Not Started', industryImportance: 'Critical' },
  { id: 's-powerquery', name: 'Power Query', domain: 'MS Excel & BI', description: 'Automated ETL, unpivoting, folder merging, M language logic', level: 'Not Started', industryImportance: 'High' },
  { id: 's-ppt', name: 'PowerPoint', domain: 'Business Reporting', description: 'Minto Pyramid storytelling, board decks, action titles, C-suite memos', level: 'Not Started', industryImportance: 'High' },
  { id: 's-powerbi', name: 'Power BI', domain: 'Power BI', description: 'End-to-end report modeling, Star Schema, drill-through, bookmarks', level: 'Not Started', industryImportance: 'Critical' },
  { id: 's-dax', name: 'DAX', domain: 'Power BI', description: 'CALCULATE filter context modifications, time intelligence measures', level: 'Not Started', industryImportance: 'Critical' },
  { id: 's-dataviz', name: 'Data Visualization', domain: 'Visualization Best Practices', description: 'Preattentive attributes, Gestalt layout, accessible color palettes', level: 'Not Started', industryImportance: 'High' },
  { id: 's-dashboards', name: 'Dashboard Design', domain: 'Visualization Best Practices', description: 'Executive F-pattern layout, 5-second clarity test, low cognitive load', level: 'Not Started', industryImportance: 'Critical' },
  { id: 's-storytelling', name: 'Business Storytelling', domain: 'Executive Communication', description: 'Translating data into commercial profit/loss and operational decisions', level: 'Not Started', industryImportance: 'Critical' },
  { id: 's-genai', name: 'GenAI', domain: 'GenAI for Analysts', description: 'Prompt patterns, automated analysis generation, LLM data workflows', level: 'Not Started', industryImportance: 'High' },
  { id: 's-prompteng', name: 'Prompt Engineering', domain: 'GenAI for Analysts', description: 'Few-shot prompting, grounded schemas, code debug instructions', level: 'Not Started', industryImportance: 'High' }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-1',
    day: 1,
    title: 'Metric Tree Architecture for Subscription Churn',
    module: 'Data Analytics Fundamentals',
    description: 'Construct a structured Metric Tree breaking down an 18% churn increase into leading and lagging operational factors.',
    instructions: 'Identify at least 4 operational drivers and draft 3 testable business hypotheses in a 1-page memo.',
    deadline: 'Day 1, 11:59 PM',
    maxMarks: 100,
    submissionType: 'text',
    skillsTested: ['Analytical Mindset', 'KPI Architecture', 'Problem Framing']
  },
  {
    id: 'assign-2',
    day: 2,
    title: 'Multi-Table SQL Customer & Order Reconciliation',
    module: 'SQL Fundamentals',
    description: 'Write production SQL queries across Customers, Orders, and Payments tables to detect unlinked transactions and compute regional GMV.',
    instructions: 'Include query text with inline comments. Ensure no Cartesian product duplicates occur in joins.',
    deadline: 'Day 2, 11:59 PM',
    maxMarks: 100,
    submissionType: 'text',
    skillsTested: ['SQL', 'Relational Joins', 'Aggregations']
  },
  {
    id: 'assign-3',
    day: 3,
    title: 'BigQuery Window Functions & Cohort Analysis',
    module: 'Advanced SQL + BigQuery',
    description: 'Query the public e-commerce dataset in BigQuery to calculate running cumulative spend and month-over-month revenue velocity.',
    instructions: 'Use CTEs, ROW_NUMBER(), and LAG(). Provide query execution plan and bytes scanned metric.',
    deadline: 'Day 3, 11:59 PM',
    maxMarks: 100,
    submissionType: 'url',
    skillsTested: ['SQL', 'BigQuery', 'Window Functions']
  },
  {
    id: 'assign-4',
    day: 4,
    title: 'Vectorized Financial KPI Calculator in Python',
    module: 'Python Fundamentals for Analytics',
    description: 'Write a reusable Python module that computes blended CAC, LTV, and payback months from raw transactional JSON dictionaries.',
    instructions: 'Include type hinting, docstrings, and error handling for zero-division or missing customer tenure.',
    deadline: 'Day 4, 11:59 PM',
    maxMarks: 100,
    submissionType: 'github_url',
    skillsTested: ['Python', 'NumPy', 'Financial Modeling']
  },
  {
    id: 'assign-5',
    day: 5,
    title: 'Omnichannel Sales Merging & Aggregation with Pandas',
    module: 'Python for Data Analysis',
    description: 'Ingest online Shopify orders and retail store receipts, normalize product SKU variations, and extract gross margin per sales channel.',
    instructions: 'Deliver a clean Jupyter Notebook featuring chained Pandas methods and markdown explanations.',
    deadline: 'Day 5, 11:59 PM',
    maxMarks: 100,
    submissionType: 'github_url',
    skillsTested: ['Python', 'Pandas', 'Data Wrangling']
  },
  {
    id: 'assign-6',
    day: 6,
    title: 'Dirty Banking Loan Applications Audit & Imputation',
    module: 'Data Cleaning & EDA',
    description: 'Audit 25,000 messy consumer loan applications. Detect and cap IQR outliers, impute missing values, and generate correlation heatmaps.',
    instructions: 'Submit your completed Python notebook and a 1-page Data Quality Audit Log.',
    deadline: 'Day 6, 11:59 PM',
    maxMarks: 100,
    submissionType: 'github_url',
    skillsTested: ['Data Cleaning', 'EDA', 'Statistical Imputation']
  },
  {
    id: 'assign-7',
    day: 7,
    title: 'Dynamic Budget vs. Actual Variance Model in Excel',
    module: 'MS Excel for Analytics',
    description: 'Build an automated monthly variance model comparing departmental budget targets to actual ledger postings.',
    instructions: 'Use XLOOKUP, dynamic arrays (FILTER, SORT), and Pivot Tables with calculated fields.',
    deadline: 'Day 7, 11:59 PM',
    maxMarks: 100,
    submissionType: 'file',
    skillsTested: ['Excel', 'Dynamic Arrays', 'Variance Analysis']
  },
  {
    id: 'assign-8',
    day: 8,
    title: 'Automated Multi-Store ETL in Power Query',
    module: 'Advanced Excel & Business Analysis',
    description: 'Consolidate 12 messy monthly store files into a single unified data model using Power Query unpivoting.',
    instructions: 'Ensure the workbook refreshes automatically when a 13th month file is dropped into the source directory.',
    deadline: 'Day 8, 11:59 PM',
    maxMarks: 100,
    submissionType: 'file',
    skillsTested: ['Power Query', 'Data Modeling', 'Excel']
  },
  {
    id: 'assign-9',
    day: 9,
    title: 'Board-Level Executive Slide Deck on Profit Optimization',
    module: 'PowerPoint for Business Reporting',
    description: 'Synthesize a 40-page technical data report into a high-impact 5-slide C-suite decision brief using the Minto Pyramid framework.',
    instructions: 'Every slide must feature an Action Title and clear optical visual hierarchy with annotations.',
    deadline: 'Day 9, 11:59 PM',
    maxMarks: 100,
    submissionType: 'file',
    skillsTested: ['Business Storytelling', 'PowerPoint', 'Executive Memos']
  },
  {
    id: 'assign-10',
    day: 10,
    title: 'Commercial Star Schema Sales Cockpit in Power BI',
    module: 'Power BI',
    description: 'Build a production Power BI report with a 1-to-many Star Schema and custom DAX measures for YoY growth and margin contribution.',
    instructions: 'Provide the published Power BI web report link or uploaded .pbix file.',
    deadline: 'Day 10, 11:59 PM',
    maxMarks: 100,
    submissionType: 'powerbi_url',
    skillsTested: ['Power BI', 'DAX', 'Star Schema Modeling']
  },
  {
    id: 'assign-11',
    day: 11,
    title: 'Executive Dashboard Redesign & Cognitive Load Overhaul',
    module: 'Best Practices in Data Visualization',
    description: 'Redesign a cluttered 16-chart operational dashboard into an accessible, high-signal command center following Gestalt principles.',
    instructions: 'Submit before/after comparison screenshots along with your design rationale brief.',
    deadline: 'Day 11, 11:59 PM',
    maxMarks: 100,
    submissionType: 'url',
    skillsTested: ['Data Visualization', 'Dashboard Design', 'UX for BI']
  },
  {
    id: 'assign-12',
    day: 12,
    title: 'GenAI Prompt Pipeline & Comprehensive Capstone Finalization',
    module: 'Prompt Engineering / GenAI for Analysts',
    description: 'Develop an automated KPI commentary generator using prompt engineering, and complete your final Capstone submission.',
    instructions: 'Submit your prompt template, sample generated Slack briefs, and capstone repository links.',
    deadline: 'Day 12, 11:59 PM',
    maxMarks: 100,
    submissionType: 'github_url',
    skillsTested: ['GenAI', 'Prompt Engineering', 'Full Stack Analytics']
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Welcome to the 12-Day Job-Oriented Data Analytics Certified Workshop!',
    content: 'Welcome to Cohort 2026. This is a rigorous, 90% hands-on professional learning experience designed to prepare you for enterprise data analyst roles. Review your Day 1 mission on the dashboard.',
    category: 'General',
    authorName: 'Kapil Narula (Lead Instructor)',
    createdAt: '2026-03-10T08:00:00Z',
    pinned: true
  },
  {
    id: 'ann-2',
    title: "Tomorrow's Live Lab: Advanced SQL Window Functions & BigQuery",
    content: 'Please ensure your Google Cloud BigQuery sandbox is initialized before Day 3. We will execute live multi-million row queries analyzing retention cohorts.',
    category: 'Lab',
    authorName: 'Kapil Narula',
    createdAt: '2026-03-12T16:30:00Z',
    pinned: false
  },
  {
    id: 'ann-3',
    title: 'Capstone Submission Portal is Now Open',
    content: 'The "DATA ANALYTICS BUSINESS INTELLIGENCE CAPSTONE" workspace is now accessible in the sidebar. Remember that Capstone completion is required for Certificate of Completion eligibility.',
    category: 'Capstone',
    authorName: 'Kapil Narula',
    createdAt: '2026-03-16T11:00:00Z',
    pinned: true
  }
];

export const INITIAL_SETTINGS: PortalSettings = {
  programName: '12-Day Job-Oriented Data Analytics Certified Workshop Powered by Kapil',
  instructorName: 'Kapil Narula',
  organizationName: 'Independent Analytics Workforce Platform',
  leaderboardEnabled: true,
  minAttendanceForCert: 80,
  weights: {
    dailyLearning: 20,
    assignments: 20,
    assessments: 20,
    handsOnLabs: 15,
    capstone: 15,
    attendance: 10
  }
};

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [];

export const INTERVIEW_QUESTIONS = {
  sql: [
    {
      q: 'What is the functional difference between WHERE and HAVING?',
      a: 'WHERE filters rows before group aggregation occurs. HAVING filters aggregated groupings after the GROUP BY is computed. Non-aggregated column conditions should always reside in WHERE to minimize dataset size before grouping.'
    },
    {
      q: 'Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK().',
      a: 'ROW_NUMBER() assigns a unique sequential integer regardless of ties. RANK() assigns the same rank to identical values, skipping subsequent numbers (e.g. 1, 2, 2, 4). DENSE_RANK() assigns the same rank to ties without skipping numbers (e.g. 1, 2, 2, 3).'
    },
    {
      q: 'How do you optimize a slow query scanning 2 Terabytes in BigQuery?',
      a: '1) Filter on partitioned date columns to limit bytes read. 2) Specify explicit columns in SELECT instead of SELECT *. 3) Use cluster keys on high-cardinality filter columns. 4) Avoid joins on floating point numbers or unindexed string concatenations.'
    }
  ],
  python: [
    {
      q: 'When would you use .loc vs .iloc in Pandas?',
      a: '.loc is label-based indexing (referencing column names and row index labels). .iloc is strictly integer position-based (from 0 to length-1). Mixing them causes unexpected KeyError or IndexError exceptions.'
    },
    {
      q: 'How do you identify and handle multicollinearity in numerical datasets?',
      a: 'Compute a correlation matrix with Seaborn heatmap and calculate the Variance Inflation Factor (VIF) for each independent feature. If VIF exceeds 5 to 10, remove or combine the collinear columns via feature engineering or PCA.'
    }
  ],
  excel: [
    {
      q: 'Why is XLOOKUP superior to VLOOKUP for enterprise modeling?',
      a: 'XLOOKUP defaults to exact match (no false TRUE defaults), searches from right-to-left as easily as left-to-right, does not break when columns are inserted into the source sheet, and supports native return arrays without INDEX/MATCH overhead.'
    },
    {
      q: 'What is Power Query and how does it prevent spreadsheet corruption?',
      a: 'Power Query is an ETL engine that extracts data from external sources and records deterministic transformation steps (M language). It never alters the original raw source files, preventing accidental data loss or manual copy-paste errors.'
    }
  ],
  powerbi: [
    {
      q: 'Explain the difference between Row Context and Filter Context in DAX.',
      a: 'Row Context occurs when an expression iterates row-by-row (such as in a calculated column or iterator like SUMX). Filter Context is the total set of filters applied by report slicers, matrix row headers, and page filters that restrict what data is visible to an aggregation.'
    },
    {
      q: 'Why is a Star Schema strongly preferred over a Snowflake Schema in Power BI?',
      a: 'Star Schemas minimize relationship chains between dimension tables and fact tables. This reduces the number of table traversals in the VertiPaq engine, resulting in faster query performance, simpler DAX calculations, and lower memory footprint.'
    }
  ],
  behavioral: [
    {
      q: 'Tell me about a time your data analysis contradicted the intuition of a senior executive (STAR method).',
      a: 'Situation: A product VP was convinced a checkout redesign increased conversions. Task: Deliver the quarterly performance readout. Action: Conducted a segmented cohort test isolating returning vs. new visitors, revealing conversion gains were driven purely by a simultaneous 20% promotional coupon while organic checkout drop-off actually rose 8%. Result: VP paused the permanent rollout and refined the mobile cart UX, saving $250K in customer attrition.'
    }
  ],
  businessCase: [
    {
      q: 'A retail client reports revenue grew by 15% but operating profit fell by 10%. How do you diagnose this?',
      a: 'Decompose Operating Profit = Revenue - COGS - OpEx. 1) Analyze Gross Margin % across product lines: did high-margin products decline while low-margin loss-leaders drove the 15% revenue lift? 2) Check discount and return rates. 3) Inspect fulfillment and shipping inflation. 4) Audit Customer Acquisition Cost (CAC) spending on marketing ad channels.'
    }
  ]
};
