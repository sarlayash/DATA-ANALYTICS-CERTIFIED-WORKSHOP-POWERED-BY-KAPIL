import { DayInterviewGuide } from '../types';

export const INTERVIEW_TIPS_DATA: DayInterviewGuide[] = [
  {
    day: 1,
    domain: 'Data Analytics Fundamentals',
    coreMindset: 'Interviewers look for commercial acumen. Can you think like a business owner who uses data to make profitable decisions, rather than a passive code writer?',
    generalTips: [
      'Always start by clarifying the objective: "Before diving into numbers, what is our primary metric for success?"',
      'Use the MECE principle (Mutually Exclusive, Collectively Exhaustive) to break down vague case prompts.',
      'Tie every insight back to revenue, cost, or customer experience.'
    ],
    keyQuestions: [
      {
        id: 'iq-1-1',
        question: 'Our active users increased by 15% this month, but total revenue decreased by 5%. How would you investigate this paradox?',
        category: 'Business Scenario',
        difficulty: 'Mid-Level',
        interviewerMindset: 'Testing if you understand metric breakdown and avoid jumping to premature single-cause conclusions.',
        answeringFramework: 'Clarify -> Deconstruct Formula -> Hypothesize Segments -> Recommend Action Plan',
        modelAnswer: 'I would start from the revenue equation: Revenue = Active Users × Transactions per User × Average Order Value (AOV). Since Active Users grew by 15% but Revenue dropped by 5%, either purchase frequency dropped, AOV dropped, or our customer mix shifted heavily towards a lower-monetizing tier. I would segment the data by: 1) Geography (e.g. surge in free or discounted emerging market users), 2) Device type (e.g. mobile app bug causing cart drop-offs), and 3) Product category (e.g. heavy discount promotions on cheap items lowering basket size). Finally, I would isolate cannibalization vs. genuine acquisition.',
        trapsToAvoid: [
          'Saying "the data must be corrupted or logging incorrectly" as your first instinct.',
          'Focusing on only one possibility without structured decomposition.'
        ]
      },
      {
        id: 'iq-1-2',
        question: 'What is the difference between a Leading Indicator and a Lagging Indicator? Give an enterprise example.',
        category: 'Technical',
        difficulty: 'Junior',
        interviewerMindset: 'Testing conceptual fluency in KPI architecture and operational analytics.',
        answeringFramework: 'Define -> Contrast -> Enterprise Case Example',
        modelAnswer: 'A lagging indicator measures an outcome that has already occurred; it provides definitive historical confirmation but cannot be altered in real-time. A leading indicator measures intermediate behaviors or inputs that predict that future outcome, giving teams an opportunity to intervene proactively. For example, in SaaS customer retention, Quarterly Churn Rate is a lagging indicator. In contrast, Product Feature Adoption Rate and Weekly Active Logins in the first 30 days are leading indicators. If 30-day logins drop by 25%, we can predict churn months before contracts renew.',
        trapsToAvoid: [
          'Giving vague non-business examples like "weather" or "speedometers".',
          'Failing to connect how leading indicators enable proactive interventions.'
        ]
      }
    ]
  },
  {
    day: 2,
    domain: 'SQL Fundamentals',
    coreMindset: 'In SQL interviews, accuracy, understanding query execution sequence, and defensive handling of NULLs and duplicates are non-negotiable.',
    generalTips: [
      'State your assumptions out loud: "I assume order_id is the primary key and customer_id can contain NULLs for guest checkouts."',
      'Always clarify: Can a customer have multiple orders on the same day? Are there duplicate records?',
      'Format your query cleanly with explicit alias names (e.g., `o.order_id`, not just `order_id`).'
    ],
    keyQuestions: [
      {
        id: 'iq-2-1',
        question: 'What is the difference between WHERE and HAVING? Can a query use both?',
        category: 'Technical',
        difficulty: 'Junior',
        interviewerMindset: 'Testing whether you understand database query execution pipelines (WHERE executes before aggregation; HAVING executes after).',
        answeringFramework: 'Query Execution Sequence -> Direct Comparison -> Concrete Code Example',
        modelAnswer: 'Yes, a query can and frequently does use both. The key difference lies in the query execution lifecycle. The WHERE clause filters individual raw rows BEFORE any aggregation takes place; it cannot reference aggregate functions like SUM() or COUNT(). In contrast, the HAVING clause filters aggregated groups AFTER the GROUP BY step has collapsed records. For example, if we want to find customers who spent over $1,000 in 2023, we use WHERE order_date >= "2023-01-01" to filter raw transactions, GROUP BY customer_id, and then use HAVING SUM(amount) > 1000 to filter the aggregated results.',
        codeSnippet: 'SELECT customer_id, SUM(amount) AS total_spend\nFROM orders\nWHERE order_date >= \'2023-01-01\' -- Raw row filter\nGROUP BY customer_id\nHAVING SUM(amount) > 1000;        -- Group filter',
        trapsToAvoid: [
          'Putting `SUM(amount) > 1000` in the WHERE clause.',
          'Forgetting that non-aggregated columns in the SELECT clause must be in the GROUP BY clause.'
        ]
      },
      {
        id: 'iq-2-2',
        question: 'What happens when you perform a LEFT JOIN and there are duplicate keys in the right table?',
        category: 'System & Logic',
        difficulty: 'Mid-Level',
        interviewerMindset: 'Testing if you understand relational cardinality and Cartesian multiplication risk.',
        answeringFramework: 'Direct Consequence -> Cardinality Breakdown -> Prevention Strategy',
        modelAnswer: 'If the right table contains duplicate matching keys, the LEFT JOIN will duplicate the rows from the left table for every matching row found on the right. This causes a Cartesian explosion, inflating row counts and corrupting aggregate metrics like SUM() or COUNT(). To prevent this in production pipelines, we should either deduplicate the right table first using a CTE with ROW_NUMBER() or DISTINCT, or pre-aggregate the right table at the join key grain before joining.',
        trapsToAvoid: [
          'Assuming a LEFT JOIN always preserves the exact row count of the left table.'
        ]
      }
    ]
  },
  {
    day: 3,
    domain: 'Advanced SQL & Data Transformations',
    coreMindset: 'Senior analytics interviews hinge on Window Functions. Expect interviewers to test ROW_NUMBER vs. DENSE_RANK, cumulative sums, and period-over-period lags.',
    generalTips: [
      'Always remember: Window functions NEVER reduce the row count; they evaluate calculations across partitions while retaining row detail.',
      'You cannot filter window functions directly in the WHERE clause of the same query block; always wrap in a CTE (`WITH ... AS ()`).',
      'Be precise with ORDER BY inside the OVER() clause.'
    ],
    keyQuestions: [
      {
        id: 'iq-3-1',
        question: 'Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() with an example where two salaries tie.',
        category: 'Technical',
        difficulty: 'Mid-Level',
        interviewerMindset: 'Testing precision in ranking logic and familiarity with tie-breaking behaviors.',
        answeringFramework: 'Define Each -> Walkthrough Numbers on a Tie Example -> Use Cases',
        modelAnswer: 'Suppose we have 4 employees with salaries: Alice ($100k), Bob ($90k), Charlie ($90k), and David ($80k).\n1. ROW_NUMBER(): Assigns unique sequential integers with arbitrary tie-breaking: Alice=1, Bob=2, Charlie=3, David=4.\n2. RANK(): Assigns identical ranks on ties, but skips subsequent rank numbers: Alice=1, Bob=2, Charlie=2, David=4 (rank 3 is skipped).\n3. DENSE_RANK(): Assigns identical ranks on ties, but does NOT skip subsequent numbers: Alice=1, Bob=2, Charlie=2, David=3.\nWe use DENSE_RANK when we need the "Nth distinct highest" value (e.g. the 2nd highest salary).',
        codeSnippet: 'SELECT name, salary,\n  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,\n  RANK()       OVER (ORDER BY salary DESC) AS rnk,\n  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk\nFROM employees;',
        trapsToAvoid: [
          'Confusing RANK() and DENSE_RANK() regarding whether they leave gaps after ties.'
        ]
      },
      {
        id: 'iq-3-2',
        question: 'How do you calculate Month-over-Month (MoM) revenue growth without writing an expensive self-join?',
        category: 'Technical',
        difficulty: 'Mid-Level',
        interviewerMindset: 'Testing your ability to write performant analytical queries using the LAG() function.',
        answeringFramework: 'Identify Function -> Write CTE -> Calculate Percentage Delta',
        modelAnswer: 'We use the LAG() analytical window function. In a Common Table Expression, we aggregate monthly revenue and use LAG(monthly_revenue, 1) OVER (ORDER BY month) to fetch the preceding month\'s revenue into the same record. Then in the outer query, we calculate ((current - prior) / prior) * 100.',
        codeSnippet: 'WITH MonthlySummary AS (\n  SELECT DATE_TRUNC(\'month\', order_date) AS order_month,\n         SUM(amount) AS revenue\n  FROM orders\n  GROUP BY 1\n)\nSELECT order_month, revenue,\n  LAG(revenue, 1) OVER (ORDER BY order_month) AS prior_month_rev,\n  ROUND((revenue - LAG(revenue, 1) OVER (ORDER BY order_month)) / \n        NULLIF(LAG(revenue, 1) OVER (ORDER BY order_month), 0) * 100, 2) AS mom_growth_pct\nFROM MonthlySummary;',
        trapsToAvoid: [
          'Dividing by zero without using NULLIF() on the prior month value.',
          'Missing the ORDER BY clause in the OVER() specification.'
        ]
      }
    ]
  },
  {
    day: 4,
    domain: 'Data Cleaning & Preprocessing',
    coreMindset: 'Interviewers want to see that you do not blindly drop or impute data without understanding the business mechanism behind the missingness or anomaly.',
    generalTips: [
      'Classify missingness before proposing fixes: Is it Missing Completely at Random (MCAR) or Missing Not at Random (MNAR)?',
      'Explain trade-offs: "Dropping rows preserves distribution purity but loses sample size and can introduce survivorship bias."',
      'Always advocate for automated validation constraints in the ingestion layer.'
    ],
    keyQuestions: [
      {
        id: 'iq-4-1',
        question: 'When is it appropriate to impute missing values with the median versus the mean? When should you never impute?',
        category: 'Technical',
        difficulty: 'Junior',
        interviewerMindset: 'Testing fundamental understanding of statistical distributions and data integrity risks.',
        answeringFramework: 'Mean vs. Median -> Skewness Impact -> When NEVER to Impute',
        modelAnswer: 'Mean imputation is only appropriate for roughly symmetric, normally distributed continuous data with no extreme outliers. When data is skewed (like income, transaction amounts, or platform latency), the mean is heavily distorted by extreme values; the median is much more robust because it reflects the 50th percentile without outlier influence. We should NEVER impute when: 1) The missingness is MNAR (Missing Not at Random), such as customers refusing to disclose debt, 2) The target variable we are trying to predict is missing, or 3) Missingness represents an actual operational state (e.g., cancellation_date is NULL because the customer is still active).',
        trapsToAvoid: [
          'Saying "mean is always standard practice in data analytics".'
        ]
      }
    ]
  },
  {
    day: 5,
    domain: 'Python for Data Analytics: Foundations',
    coreMindset: 'Demonstrate clean, readable, Pythonic code. Focus on vectorized NumPy thinking rather than slow nested loops.',
    generalTips: [
      'Emphasize why vectorization matters: NumPy runs compiled C loops underneath, achieving 50x-100x speedups.',
      'Show familiarity with core Python data structures: lists, dicts, sets, and tuples.',
      'Mention edge case handling (empty lists, type mismatches, None values).'
    ],
    keyQuestions: [
      {
        id: 'iq-5-1',
        question: 'Why are NumPy arrays faster than standard Python lists for numerical computations?',
        category: 'Technical',
        difficulty: 'Junior',
        interviewerMindset: 'Testing your understanding of memory management, data types, and vectorized execution.',
        answeringFramework: 'Memory Contiguity -> Homogeneous Types -> SIMD/C-Level Execution',
        modelAnswer: 'NumPy arrays are substantially faster for three core architectural reasons: 1) Memory Contiguity: NumPy arrays are stored as contiguous memory blocks in RAM, maximizing CPU cache line efficiency, whereas Python lists store pointers to scattered objects. 2) Homogeneous Data Types: NumPy arrays enforce uniform C data types, eliminating Python\'s per-element dynamic type checking and object boxing overhead. 3) Vectorization & SIMD: NumPy executes calculations in compiled C/Fortran routines that utilize CPU vector registers (SIMD) to process multiple numerical values in a single clock cycle.',
        trapsToAvoid: [
          'Giving a shallow answer like "because NumPy is optimized" without mentioning memory or dynamic typing.'
        ]
      }
    ]
  },
  {
    day: 6,
    domain: 'Data Wrangling with Pandas',
    coreMindset: 'Interviewers look for idiomatic Pandas: avoiding `.iterrows()`, preventing SettingWithCopy warnings, and clean GroupBy aggregations.',
    generalTips: [
      'Avoid `.iterrows()` or manual for-loops over DataFrames; highlight vectorized operations or `.apply()` as a last resort.',
      'Explain how you handle large datasets: chunking, specifying dtypes upon read, or downcasting integer/category columns.',
      'Always reset indices after aggregations for clean tabular outputs.'
    ],
    keyQuestions: [
      {
        id: 'iq-6-1',
        question: 'What causes the SettingWithCopyWarning in Pandas and how do you resolve it?',
        category: 'Technical',
        difficulty: 'Mid-Level',
        interviewerMindset: 'Testing your practical debugging skills and understanding of views vs. copies in memory.',
        answeringFramework: 'Root Cause -> Chained Indexing Explanation -> Solution via .loc or .copy()',
        modelAnswer: 'The SettingWithCopyWarning occurs when Pandas detects "chained indexing"—assigning a value via two consecutive indexing operations, like `df[df[\'status\'] == \'active\'][\'discount\'] = 0.1`. Pandas cannot guarantee whether the first slice returned a view of the original memory or a separate copy. If it returned a copy, your assignment modifies a temporary object and is lost. To resolve it, always use explicit label-based indexing with `.loc`: `df.loc[df[\'status\'] == \'active\', \'discount\'] = 0.1`, or explicitly create an independent dataframe using `.copy()`.',
        codeSnippet: '# INCORRECT (Chained Indexing)\ndf[df[\'revenue\'] > 1000][\'tier\'] = \'VIP\'\n\n# CORRECT (.loc)\ndf.loc[df[\'revenue\'] > 1000, \'tier\'] = \'VIP\'',
        trapsToAvoid: [
          'Saying "you should just silence warnings using warnings.filterwarnings()".'
        ]
      }
    ]
  },
  {
    day: 7,
    domain: 'EDA & Statistical Thinking',
    coreMindset: 'Statistical rigor separates junior dashboard builders from trusted business advisors. Show that you respect sample sizes, variance, and experimental design.',
    generalTips: [
      'Never cite an average without investigating the distribution shape, standard deviation, and median.',
      'Explain the Central Limit Theorem simply: "Even if individual data points are skewed, the distribution of sample means approaches a normal curve as sample size increases."',
      'Frame A/B testing in terms of minimum detectable effect, statistical power, and commercial risk.'
    ],
    keyQuestions: [
      {
        id: 'iq-7-1',
        question: 'Our product manager says: "We ran an A/B test for 3 days, and variant B has a 12% higher conversion rate with p < 0.01. Can we launch immediately?" How do you respond?',
        category: 'Business Scenario',
        difficulty: 'Mid-Level',
        interviewerMindset: 'Testing whether you understand day-of-week seasonality, peeking problem, sample size requirements, and novelty effects.',
        answeringFramework: 'Assess Risks -> Check Seasonality & Power -> Formulate Recommendation',
        modelAnswer: 'I would advise against launching immediately. While the p-value is below 0.01, a 3-day test has three major statistical and commercial vulnerabilities: 1) Day-of-week seasonality: User behavior on weekends differs significantly from weekdays; an A/B test should run for at least 1-2 full business cycles (typically 7-14 full days). 2) Novelty effect: Existing users might click the new button simply because it looks different, which wears off over time. 3) Peeking bias: Stopping a test early as soon as significance is reached artificially inflates false positive (Type I) error rates. I would check if we reached our predetermined sample size and keep the test running through a full 7-day cycle.',
        trapsToAvoid: [
          'Saying "Yes, p < 0.01 means it is statistically guaranteed to succeed."'
        ]
      }
    ]
  },
  {
    day: 8,
    domain: 'Data Visualization & Storytelling',
    coreMindset: 'Visualizations should communicate a single, unmistakable takeaway in under 5 seconds. Clarity trumps flashy aesthetics.',
    generalTips: [
      'Speak about the Data-Ink Ratio (Edward Tufte principle): Remove non-essential borders, 3D effects, and redundant legends.',
      'Mention accessibility: Colorblind-friendly palettes, high contrast ratios, and clear direct data labels.',
      'Always structure executive slides as: Headline Finding -> Supporting Visual -> Recommended Decision.'
    ],
    keyQuestions: [
      {
        id: 'iq-8-1',
        question: 'When should you avoid using a pie chart in an executive business report?',
        category: 'Design & Visual',
        difficulty: 'Junior',
        interviewerMindset: 'Testing your understanding of human visual cognition and chart effectiveness.',
        answeringFramework: 'Human Perception Limitations -> Quantitative Flaws -> Preferred Alternatives',
        modelAnswer: 'Pie charts should generally be avoided in executive reports whenever: 1) There are more than 3 categories, because human brains are poor at accurately judging 2D angles and slice areas compared to 1D linear lengths. 2) Slice values are close in size (e.g. 24% vs. 26%), making them visually indistinguishable without reading small numbers. 3) Comparing trends across multiple time periods. A horizontal bar chart or 100% stacked bar chart is vastly superior because it allows instant, precise comparison along a common baseline.',
        trapsToAvoid: [
          'Defending 3D pie charts.'
        ]
      }
    ]
  },
  {
    day: 9,
    domain: 'Enterprise BI & Dashboards',
    coreMindset: 'Enterprise BI is about scalable data modeling and high-performance DAX measures, not just drag-and-drop visuals.',
    generalTips: [
      'Highlight the Star Schema: Fact table at the center with 1-to-many relationships to Dimension tables.',
      'Emphasize why DAX Measures are superior to Calculated Columns: Measures evaluate dynamically on filter context and do not consume stored memory.',
      'Know the importance of a dedicated, continuous Calendar Dimension.'
    ],
    keyQuestions: [
      {
        id: 'iq-9-1',
        question: 'In Power BI / DAX, what is the difference between Filter Context and Row Context?',
        category: 'Technical',
        difficulty: 'Senior/Lead',
        interviewerMindset: 'Testing the deepest core concept of DAX calculation engines.',
        answeringFramework: 'Define Row Context -> Define Filter Context -> Explain Context Transition via CALCULATE()',
        modelAnswer: 'Row Context exists when an expression evaluates row-by-row on a table, such as inside a Calculated Column or iterating functions like SUMX(). It knows the values of the current row, but has no innate awareness of filters on other tables. Filter Context is the set of active filters applied to the data model at query time, coming from slicers, page filters, matrix row/column headers, and DAX CALCULATE statements. Crucially, CALCULATE() transforms a current Row Context into an equivalent Filter Context, known as Context Transition, enabling measures to work across relational tables.',
        trapsToAvoid: [
          'Saying that calculated columns use filter context.'
        ]
      }
    ]
  },
  {
    day: 10,
    domain: 'Business Analytics & Product Metrics',
    coreMindset: 'Top analysts think in unit economics: LTV, CAC, Payback Period, Net Revenue Retention, and Cohort Churn.',
    generalTips: [
      'Differentiate between Logo Churn (percentage of customers lost) and Net Revenue Churn (dollar impact after expansion).',
      'Explain how RFM segmentation helps growth teams prioritize retention over blanket discounting.',
      'Always discuss CAC payback in months of gross margin.'
    ],
    keyQuestions: [
      {
        id: 'iq-10-1',
        question: 'Our company has 95% Logo Retention but 115% Net Revenue Retention (NRR). How is this possible and what does it indicate about the business?',
        category: 'Business Scenario',
        difficulty: 'Senior/Lead',
        interviewerMindset: 'Testing executive-level unit economics and SaaS financial acumen.',
        answeringFramework: 'Define Metrics -> Explain Math -> Business Health Assessment',
        modelAnswer: 'This is not only possible, it represents a hallmark of high-performing enterprise businesses. 95% Logo Retention means we lost 5% of our customer count over the year (churn). However, Net Revenue Retention of 115% measures the dollar revenue generated by that exact cohort over time: (Beginning ARR + Expansion ARR - Contraction - Churn) / Beginning ARR. An NRR of 115% means that expansion revenue (upsells, cross-sells, higher usage tiers) from retained customers significantly outweighed the revenue lost from the 5% churned accounts. The cohort expanded by 15% in net revenue, proving strong product-market fit and pricing power.',
        trapsToAvoid: [
          'Saying NRR cannot exceed 100% if customers churned.'
        ]
      }
    ]
  },
  {
    day: 11,
    domain: 'Analytics Portfolio & GitHub Engineering',
    coreMindset: 'Hiring managers review portfolios to answer one question: "Can I trust this candidate to work in our production codebase on Day 1?"',
    generalTips: [
      'Include a 60-second video or visual GIF demo in your GitHub README; many managers review portfolios on mobile devices.',
      'Always include business impact metrics: "$2.4M inventory risk mitigated", "14 hours manual reporting automated weekly".',
      'Demonstrate reproducible environments: `requirements.txt`, environment variables documentation, and clean modular code.'
    ],
    keyQuestions: [
      {
        id: 'iq-11-1',
        question: 'Walk me through a project in your portfolio where your initial analytical hypothesis turned out to be completely wrong. What did you do?',
        category: 'Behavioral',
        difficulty: 'Mid-Level',
        interviewerMindset: 'Testing intellectual honesty, resilience, and whether you tortuously force data to fit your bias or follow empirical evidence.',
        answeringFramework: 'STAR Framework: Situation -> Initial Hypothesis -> Empirical Data Contradiction -> Pivot & Final Business Outcome',
        modelAnswer: 'In my customer churn portfolio project, our team hypothesized that customers were cancelling subscriptions due to pricing dissatisfaction following a 10% price bump. However, when I joined transaction logs with product feature telemetry and customer support ticket sentiment, the data contradicted our theory: customers who experienced the price increase but used our reporting export tool had a 96% retention rate. The true driver of churn was a mobile app sync latency issue that triggered high support ticket volume. By pivoting our focus from pricing discounts to fixing the sync latency, we reduced ticket volume by 42% and saved the team from a costly, unnecessary price rollback.',
        trapsToAvoid: [
          'Claiming your hypotheses are always right on the first try.',
          'Blaming teammates or dirty data for the mistaken assumption.'
        ]
      }
    ]
  },
  {
    day: 12,
    domain: 'Capstone Project & Executive Defense',
    coreMindset: 'In capstone and executive defense interviews, your composure under scrutiny and ability to translate technical findings into boardroom ROI matter most.',
    generalTips: [
      'Follow the Minto Pyramid Principle: State the bottom-line recommendation in the first 30 seconds.',
      'Anticipate pushback on data quality: "We validated this against 180,000 reconciled transactions, filtering out returns with a 30-day settlement window."',
      'Never argue with the interviewer; frame objections as collaborative inquiry: "That is an excellent point regarding seasonal margin compression..."'
    ],
    keyQuestions: [
      {
        id: 'iq-12-1',
        question: 'If our CFO says: "Your proposed recommendation requires $200k in engineering resources and we cannot afford that this quarter", how do you respond?',
        category: 'Business Scenario',
        difficulty: 'Senior/Lead',
        interviewerMindset: 'Testing executive prioritization, ROI defense, and phased implementation flexibility.',
        answeringFramework: 'Acknowledge Budget Constraint -> Present Phased Pilot -> Demonstrate Payback Timeline',
        modelAnswer: 'I would acknowledge the CFO\'s capital discipline and present a phased pilot approach. Rather than deploying the full $200k enterprise pipeline upfront, we can pilot the solution for our highest-margin customer segment using existing infrastructure at an estimated cost of $25,000. Based on our cohort model, capturing just 15% of the projected churn reduction in that pilot segment yields $90,000 in retained ARR within 90 days—a 3.6x return that self-funds the broader rollout. This de-risks the capital investment while generating measurable near-term cash flow.',
        trapsToAvoid: [
          'Saying "Well, the CFO just doesn\'t understand the value of data."',
          'Giving up on the project entirely without offering a scaled-down pilot option.'
        ]
      }
    ]
  }
];
