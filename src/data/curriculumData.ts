import { CurriculumDay } from '../types';

export const CURRICULUM_DAYS: CurriculumDay[] = [
  {
    day: 1,
    title: 'Data Analytics Fundamentals + Analytics Mindset',
    domain: 'Data Analytics Fundamentals',
    learningObjective: 'Understand the end-to-end data analytics lifecycle, business problem framing, metrics definition, and analytical problem-solving mindsets.',
    agenda: [
      'Welcome & Course Roadmap: From Learning to Employability',
      'The Analytics Value Chain: Descriptive, Diagnostic, Predictive, Prescriptive',
      'Translating Business Questions into Data Hypotheses',
      'KPIs, Leading vs. Lagging Indicators, and Metric Trees',
      'Hands-On: Framing a Customer Churn Hypothesis'
    ],
    concepts: [
      {
        heading: 'The Business Analytics Framework',
        description: 'Data analytics is not just writing queries; it is diagnosing business bottlenecks and prescribing commercial decisions.',
        businessNote: 'Fortune 500 organizations evaluate analysts on how clearly they connect numerical insights with P&L impact.'
      },
      {
        heading: 'Metric Architecture: North Star Metrics & MECE Decompositions',
        description: 'Learn how to deconstruct high-level goals (e.g. Net Revenue Retention) into mutually exclusive and collectively exhaustive sub-drivers.',
        codeExample: 'Net Revenue = (Active Users × Avg Order Frequency × Avg Order Value) - Refunds - Acquisition Cost'
      }
    ],
    handsOnLab: {
      title: 'Lab 1: E-Commerce Funnel Diagnostic & Metric Tree Design',
      businessScenario: 'A direct-to-consumer apparel brand noticed an 18% decline in quarterly checkout conversions despite paid ad traffic surging by 40%.',
      datasetDescription: 'Quarterly web traffic logs with sessions, bounce rates, cart-adds, and checkout drops across 12 product categories.',
      task: 'Construct a structured Metric Tree deconstructing the conversion drop and write 3 testable business hypotheses.',
      expectedOutput: 'A structured KPI diagnostic breakdown identifying whether the drop is UX friction, pricing shock, or mismatched ad audience.',
      submissionInstructions: 'Submit a PDF or structured Markdown summary detailing root-cause hypotheses and recommended metrics.',
      evaluationCriteria: 'Logical consistency of metric tree, commercial realism, actionable hypotheses.',
      skillsTested: ['Analytical Mindset', 'KPI Architecture', 'Root Cause Analysis']
    },
    businessCase: {
      title: 'Global Retailer: Diagnosing Omnichannel Inventory Spoilage',
      companyContext: 'Global Retail Corp with 450 regional superstores.',
      problem: 'Fresh produce waste reached $14.2M annually due to delayed supply-demand signal alignment between stores and distribution centers.',
      deliverable: 'Executive summary detailing 3 operational metrics to monitor daily stock-outs vs. overages.'
    },
    practicalChallenge: 'Draft 5 questions you would ask a Chief Marketing Officer before touching their sales database.',
    quiz: {
      id: 'quiz-day-1',
      title: 'Day 1 Checkpoint: Analytics Fundamentals & Business Problem Framing',
      passingScore: 70,
      questions: [
        {
          id: 'q1-1',
          type: 'mcq',
          question: 'Which stage of analytics answers the question: "Why did revenue drop in Q3?"',
          options: ['Descriptive Analytics', 'Diagnostic Analytics', 'Predictive Analytics', 'Prescriptive Analytics'],
          correctAnswer: 'Diagnostic Analytics',
          explanation: 'Diagnostic analytics investigates root causes and relationships behind historical anomalies.'
        },
        {
          id: 'q1-2',
          type: 'mcq',
          question: 'In metric architecture, which is an example of a leading indicator for customer churn?',
          options: ['Monthly Cancellation Count', 'Decrease in Weekly Active Product Logins', 'Total Revenue Lost this Month', 'Exit Survey Ratings'],
          correctAnswer: 'Decrease in Weekly Active Product Logins',
          explanation: 'Leading indicators provide early predictive warning signals before the lagging event (churn) occurs.'
        }
      ]
    },
    resources: [
      { name: 'Analytics Lifecycle Cheatsheet', type: 'Cheatsheet', url: '#' },
      { name: 'Metric Tree Template (Excel)', type: 'Template', url: '#' }
    ],
    expectedOutcomes: [
      'Ability to frame vague business requests into precise data questions',
      'Mastery of North Star metrics vs. Operational KPIs',
      'Readiness to ingest raw transactional tables in Day 2 SQL'
    ],
    skillMapping: ['Data Analytics', 'Business Storytelling', 'KPI Architecture'],
    careerRelevance: {
      tool: 'Analytics Frameworks',
      usedInRoles: ['Business Analyst', 'Associate Data Analyst', 'Product Analyst', 'Strategy Consultant'],
      salaryOutlook: '$70,000 - $95,000 / year'
    }
  },
  {
    day: 2,
    title: 'SQL Fundamentals',
    domain: 'SQL & BigQuery',
    learningObjective: 'Master relational database querying, SELECT syntax, WHERE filtering, aggregated statistics, GROUP BY, and multi-table INNER and OUTER JOINs.',
    agenda: [
      'Relational Database Architecture: Tables, Keys, and Schema Normalization',
      'SELECT, DISTINCT, WHERE, ORDER BY, and LIMIT',
      'Aggregations: COUNT, SUM, AVG, MIN, MAX with GROUP BY & HAVING',
      'Relational Joins: INNER, LEFT, RIGHT, and FULL OUTER JOINs',
      'Hands-On: Multi-Table Customer Order Reconciliation'
    ],
    concepts: [
      {
        heading: 'SQL Query Execution Order',
        description: 'Understanding the database engine execution sequence: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.',
        codeExample: 'SELECT department_id, AVG(salary) AS avg_sal\nFROM employees\nWHERE hire_date >= "2023-01-01"\nGROUP BY department_id\nHAVING AVG(salary) > 75000\nORDER BY avg_sal DESC;'
      },
      {
        heading: 'Mastering Joins Without Cartesian Explosion',
        description: 'Always ensure join keys are primary-foreign pairs or unique across the matching dimension to prevent duplicated rows in aggregations.',
        codeExample: 'SELECT c.customer_name, SUM(o.order_amount) AS total_spend\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.customer_name;'
      }
    ],
    handsOnLab: {
      title: 'Lab 2: Telecom Churn & Revenue Reconciliation in SQL',
      businessScenario: 'Analyze customer subscriptions data and identify the top 5 revenue-driving regions while discovering unmatched unbilled accounts.',
      datasetDescription: 'Customer table (50,000 rows) joined to Subscriptions and Monthly Charges tables.',
      task: 'Write production SQL queries computing regional revenue totals, average monthly ARPU, and unlinked active subscriptions.',
      expectedOutput: 'Clean tabular output with regional aggregates and identifying accounts without subscription links.',
      submissionInstructions: 'Submit raw .sql script file or copy the SQL queries into the submission workspace.',
      evaluationCriteria: 'Accurate JOIN usage, correct filtering logic, optimal execution performance.',
      skillsTested: ['SQL', 'Data Cleaning', 'Data Modeling']
    },
    businessCase: {
      title: 'Fintech: Detecting Ghost Billing Accounts',
      companyContext: 'Rapidly scaling neo-bank with 2.4 million cardholders.',
      problem: 'Finance discovered discrepancies between gateway payment receipts and core database account ledger balances.',
      deliverable: 'A set of SQL queries that execute an automated reconciliation audit.'
    },
    practicalChallenge: 'Write a SQL query that finds all customers who placed an order in 2024 but never placed an order in 2025.',
    quiz: {
      id: 'quiz-day-2',
      title: 'Day 2 Checkpoint: SQL Fundamentals & Relational Joins',
      passingScore: 70,
      questions: [
        {
          id: 'q2-1',
          type: 'sql-query',
          question: 'Which clause in SQL is used to filter aggregated values resulting from a GROUP BY?',
          options: ['WHERE', 'HAVING', 'FILTER', 'QUALIFY'],
          correctAnswer: 'HAVING',
          explanation: 'WHERE filters individual records before aggregation; HAVING filters groups after aggregation.'
        },
        {
          id: 'q2-2',
          type: 'mcq',
          question: 'If Table A has 10 rows and Table B has 5 rows, and no keys match, what does an INNER JOIN return?',
          options: ['0 rows', '5 rows', '10 rows', '50 rows'],
          correctAnswer: '0 rows',
          explanation: 'An INNER JOIN requires rows in both tables to meet the join condition. If none match, zero rows are returned.'
        }
      ]
    },
    resources: [
      { name: 'SQL Query Order Cheatsheet', type: 'Cheatsheet', url: '#' },
      { name: 'Telecom Customers Sample Database (.sql)', type: 'Dataset', url: '#' }
    ],
    expectedOutcomes: [
      'Write fluent multi-table JOIN queries',
      'Filter aggregated metrics with precision using HAVING',
      'Avoid duplicate-row traps in commercial data pipelines'
    ],
    skillMapping: ['SQL', 'Relational Modeling', 'Data Cleaning'],
    careerRelevance: {
      tool: 'SQL (PostgreSQL / MySQL)',
      usedInRoles: ['Data Analyst', 'Business Analyst', 'BI Analyst', 'Reporting Analyst'],
      salaryOutlook: '$75,000 - $105,000 / year'
    }
  },
  {
    day: 3,
    title: 'Advanced SQL + BigQuery',
    domain: 'SQL & BigQuery',
    learningObjective: 'Leverage Common Table Expressions (CTEs), Window Functions (ROW_NUMBER, RANK, LEAD, LAG, DENSE_RANK), and BigQuery enterprise cloud warehouses.',
    agenda: [
      'Common Table Expressions (WITH clauses) for Modular Pipeline Architecture',
      'Window Functions: OVER (PARTITION BY ... ORDER BY ...)',
      'Ranking Functions: ROW_NUMBER(), RANK(), DENSE_RANK()',
      'Offset Functions: LAG(), LEAD() for Period-over-Period Growth Calculations',
      'BigQuery Cloud Architecture: Partitioning, Clustering, and Cost Optimization',
      'Hands-On: Customer Lifetime Cohort Retention in BigQuery'
    ],
    concepts: [
      {
        heading: 'Window Functions vs. GROUP BY',
        description: 'Window functions perform calculations across a set of table rows that are related to the current row, preserving original row granularity.',
        codeExample: 'SELECT customer_id, order_date, order_amount,\n  SUM(order_amount) OVER(PARTITION BY customer_id ORDER BY order_date) AS running_total,\n  LAG(order_amount, 1) OVER(PARTITION BY customer_id ORDER BY order_date) AS previous_order_val\nFROM orders;'
      },
      {
        heading: 'BigQuery Partitioning & Cost Guardrails',
        description: 'In Google BigQuery, querying full tables incurs scan costs. Use DATE(_PARTITIONTIME) or partitioned date fields to minimize bytes billed.',
        businessNote: 'Enterprise cloud budgets penalize full-table scans. BigQuery analysts must know how to estimate query size before running.'
      }
    ],
    handsOnLab: {
      title: 'Lab 3: BigQuery MoM Revenue Growth & Top-3 Products per Category',
      businessScenario: 'The VP of Merchandise needs the top 3 best-selling products in every category by monthly revenue, plus month-over-month % growth rates.',
      datasetDescription: 'BigQuery public e-commerce dataset (thelook_ecommerce) with 1.2M order lines.',
      task: 'Write a query utilizing DENSE_RANK() and LAG() within modular CTEs to generate the category performance matrix.',
      expectedOutput: 'Ranked top-3 products per category with previous month revenue and percentage delta.',
      submissionInstructions: 'Submit the BigQuery SQL script and query execution profile screenshot/stats.',
      evaluationCriteria: 'Proper window function partition logic, CTE modularity, zero nested subquery clutter.',
      skillsTested: ['SQL', 'BigQuery', 'Window Functions']
    },
    businessCase: {
      title: 'SaaS Unicorn: Analyzing Daily User Retention Curves',
      companyContext: 'Enterprise project management SaaS with 600K daily active users.',
      problem: 'Product leadership wants to measure Day 1, Day 7, and Day 30 retention cohorts from user activity telemetry.',
      deliverable: 'BigQuery SQL query producing a clean retention matrix.'
    },
    practicalChallenge: 'Write a window query that calculates the 7-day moving average of daily transactions.',
    quiz: {
      id: 'quiz-day-3',
      title: 'Day 3 Checkpoint: Window Functions & Cloud Data Warehousing',
      passingScore: 70,
      questions: [
        {
          id: 'q3-1',
          type: 'mcq',
          question: 'What is the primary difference between RANK() and DENSE_RANK() when two rows have equal values?',
          options: [
            'RANK() leaves gaps in sequence (e.g. 1, 2, 2, 4); DENSE_RANK() does not (e.g. 1, 2, 2, 3)',
            'DENSE_RANK() only works on numerical columns',
            'RANK() resets at 100',
            'There is no functional difference'
          ],
          correctAnswer: 'RANK() leaves gaps in sequence (e.g. 1, 2, 2, 4); DENSE_RANK() does not (e.g. 1, 2, 2, 3)',
          explanation: 'RANK() skips the subsequent rank numbers corresponding to tied positions, whereas DENSE_RANK() always produces consecutive numbers.'
        }
      ]
    },
    resources: [
      { name: 'Window Functions Master Guide', type: 'Documentation', url: '#' },
      { name: 'BigQuery Practice Sandbox Link', type: 'Documentation', url: '#' }
    ],
    expectedOutcomes: [
      'Write advanced window functions for running totals and rankings',
      'Calculate period-over-period growth with LEAD/LAG',
      'Optimize BigQuery costs using partition and cluster filters'
    ],
    skillMapping: ['SQL', 'BigQuery', 'Data Modeling'],
    careerRelevance: {
      tool: 'BigQuery / Snowflake',
      usedInRoles: ['Senior Data Analyst', 'Analytics Engineer', 'BI Developer'],
      salaryOutlook: '$85,000 - $120,000 / year'
    }
  },
  {
    day: 4,
    title: 'Python Fundamentals for Analytics',
    domain: 'Python for Data Analytics',
    learningObjective: 'Build a rigorous foundation in Python data structures (lists, dictionaries, sets), vectorized operations with NumPy, and analytical functions.',
    agenda: [
      'Python Environment & Modern Tooling (Jupyter, VS Code, Google Colab)',
      'Data Types, Lists, Dicts, Tuples, and List Comprehensions',
      'Defensive Programming: Custom Functions, Exception Handling (try/except)',
      'NumPy Fundamentals: ndarrays, Broadcasting, Vectorized Math',
      'Hands-On: Numerical Simulation of Campaign ROI'
    ],
    concepts: [
      {
        heading: 'Why Python for Analytics?',
        description: 'Python bridges the gap between database extracts and automated predictive algorithms, allowing reproducible workflows that scale.',
        codeExample: 'import numpy as np\n# Vectorized conversion vs slow Python loops\nprices = np.array([19.99, 49.50, 120.00])\ndiscounts = prices * 0.85\nprint(f"Mean discounted price: ${discounts.mean():.2f}")'
      }
    ],
    handsOnLab: {
      title: 'Lab 4: Building a Reusable Financial KPI Calculator',
      businessScenario: 'A subscription fitness company needs a reusable Python module to parse raw customer billing records, compute Customer Acquisition Cost (CAC) and Lifetime Value (LTV).',
      datasetDescription: 'JSON dataset with 5,000 customer acquisition histories and churn dates.',
      task: 'Write a Python function with input type validation and error handling that computes blended LTV:CAC ratios.',
      expectedOutput: 'Function returning clean dictionary of financial health metrics and warning flags for unprofitable cohorts.',
      submissionInstructions: 'Submit Python script (.py or .ipynb) via the submission form.',
      evaluationCriteria: 'Code readability, robust error handling, clean docstrings, algorithmic efficiency.',
      skillsTested: ['Python', 'NumPy', 'Financial Analytics']
    },
    businessCase: {
      title: 'HealthTech: Streamlining Clinical Trial Data Ingestion',
      companyContext: 'Clinical research organization monitoring 10,000 patient vitals.',
      problem: 'Data arrives in malformed nested JSON payloads with intermittent null readings.',
      deliverable: 'Python ingestion parser handling missing records without pipeline termination.'
    },
    practicalChallenge: 'Write a one-line Python list comprehension that filters a list of customer names to only those starting with "A" and converts them to uppercase.',
    quiz: {
      id: 'quiz-day-4',
      title: 'Day 4 Checkpoint: Python Structures & NumPy Arrays',
      passingScore: 70,
      questions: [
        {
          id: 'q4-1',
          type: 'mcq',
          question: 'Why are NumPy arrays significantly faster than standard Python lists for numerical operations?',
          options: [
            'They store homogeneous data in contiguous memory blocks with C-level vectorization',
            'They compress files on disk',
            'They use multi-threading by default for all assignments',
            'They convert all numbers to strings'
          ],
          correctAnswer: 'They store homogeneous data in contiguous memory blocks with C-level vectorization',
          explanation: 'NumPy avoids Python object overhead by storing elements in contiguous memory buffers executed via optimized BLAS/LAPACK routines.'
        }
      ]
    },
    resources: [
      { name: 'Python for Analytics Starter Notebook', type: 'Template', url: '#' },
      { name: 'NumPy Vectorization Cheatsheet', type: 'Cheatsheet', url: '#' }
    ],
    expectedOutcomes: [
      'Confidence in Python dictionaries, lists, and functions',
      'Comfort with NumPy array broadcasting and aggregations',
      'Foundation for Day 5 tabular analysis in Pandas'
    ],
    skillMapping: ['Python', 'NumPy', 'Data Cleaning'],
    careerRelevance: {
      tool: 'Python',
      usedInRoles: ['Data Analyst', 'Junior Data Scientist', 'Automation Analyst'],
      salaryOutlook: '$80,000 - $110,000 / year'
    }
  },
  {
    day: 5,
    title: 'Python for Data Analysis',
    domain: 'Python for Data Analytics',
    learningObjective: 'Master the industry standard Pandas library for reading, filtering, slicing, grouping, transforming, and merging complex datasets.',
    agenda: [
      'Pandas DataFrames and Series: Indexing with .loc and .iloc',
      'Data Ingestion: read_csv, read_parquet, and SQL database connections',
      'Aggregations: groupby(), agg(), pivot_table(), and transform()',
      'Data Merging: merge(), concat(), and handling join cardinalities',
      'Hands-On: Customer Churn Segmentation with Pandas'
    ],
    concepts: [
      {
        heading: 'Fluent Pandas Pipelines',
        description: 'Writing readable, chained Pandas queries using method chaining, lambda functions, and assign.',
        codeExample: 'import pandas as pd\nsummary = (df\n  .query("status == \'Active\' & spend > 1000")\n  .groupby("region")\n  .agg(avg_tenure=("tenure_months", "mean"), total_rev=("spend", "sum"))\n  .sort_values(by="total_rev", ascending=False)\n)'
      }
    ],
    handsOnLab: {
      title: 'Lab 5: Multi-Channel Sales Aggregation in Pandas',
      businessScenario: 'Merge offline brick-and-mortar sales with online Shopify orders, normalize SKU naming discrepancies, and compute margin per channel.',
      datasetDescription: 'Two CSV files: online_orders.csv (120K rows) and retail_pos.csv (85K rows).',
      task: 'Join the datasets on normalized product keys, calculate gross margins, and extract the top underperforming product lines.',
      expectedOutput: 'Aggregated summary table and CSV export summarizing gross profit and volume by sales channel.',
      submissionInstructions: 'Submit your Google Colab or GitHub Jupyter Notebook link.',
      evaluationCriteria: 'Correct join implementation, handling of missing items, concise chained logic.',
      skillsTested: ['Python', 'Pandas', 'Data Cleaning']
    },
    businessCase: {
      title: 'Logistics Provider: Fleet Fuel Efficiency Breakdown',
      companyContext: 'National delivery courier with 12,000 cargo vans.',
      problem: 'Fuel expenditures spiked 23% in Midwest routes despite route mileage remaining flat.',
      deliverable: 'Pandas exploratory analysis identifying specific driver cohorts and vehicle vintages driving fuel loss.'
    },
    practicalChallenge: 'Write a Pandas expression to find the top 5 customers with the highest standard deviation in monthly purchase amounts.',
    quiz: {
      id: 'quiz-day-5',
      title: 'Day 5 Checkpoint: Pandas DataFrames & Manipulations',
      passingScore: 70,
      questions: [
        {
          id: 'q5-1',
          type: 'mcq',
          question: 'In Pandas, which method allows applying multiple distinct aggregations to different columns simultaneously?',
          options: ['.agg() or .aggregate()', '.combine()', '.transform()', '.map()'],
          correctAnswer: '.agg() or .aggregate()',
          explanation: 'The .agg() function accepts a dictionary specifying column names and their corresponding aggregation functions.'
        }
      ]
    },
    resources: [
      { name: 'Pandas Wrangling Cheatsheet', type: 'Cheatsheet', url: '#' },
      { name: 'Retail Orders CSV Dataset', type: 'Dataset', url: '#' }
    ],
    expectedOutcomes: [
      'Manipulate complex tabular datasets with Pandas',
      'Construct pivot tables and multi-level aggregations in code',
      'Merge disparate operational data sources safely'
    ],
    skillMapping: ['Python', 'Pandas', 'EDA'],
    careerRelevance: {
      tool: 'Pandas',
      usedInRoles: ['Data Analyst', 'BI Analyst', 'Analytics Engineer'],
      salaryOutlook: '$80,000 - $115,000 / year'
    }
  },
  {
    day: 6,
    title: 'Data Cleaning + Exploratory Data Analysis',
    domain: 'Python for Data Analytics',
    learningObjective: 'Master systematic data quality auditing, missing value imputation strategies, outlier detection (IQR, Z-Score), and univariate/bivariate EDA.',
    agenda: [
      'The 6 Dimensions of Data Quality: Accuracy, Completeness, Consistency, Timeliness, Validity, Uniqueness',
      'Handling Missing Data: MCAR vs MAR vs MNAR and Imputation Strategies',
      'Outlier Detection Techniques: Tukey IQR Rule, Z-Scores, and Domain Caps',
      'String Standardization, Regex Extraction, and Datetime Parsing',
      'Exploratory Visualizations with Matplotlib and Seaborn',
      'Hands-On: End-to-End Raw Loan Applications Cleanup'
    ],
    concepts: [
      {
        heading: 'Defensive Data Cleaning Principles',
        description: 'Never overwrite raw files. Always maintain an audit trail of modifications and quantify data loss at every cleaning transformation stage.',
        codeExample: '# Identify and cap IQR outliers\nQ1 = df["income"].quantile(0.25)\nQ3 = df["income"].quantile(0.75)\nIQR = Q3 - Q1\nlower_bound = Q1 - 1.5 * IQR\nupper_bound = Q3 + 1.5 * IQR\ndf["income_clean"] = df["income"].clip(lower=lower_bound, upper=upper_bound)'
      }
    ],
    handsOnLab: {
      title: 'Lab 6: Cleaning Dirty Banking Loan Applications',
      businessScenario: 'Clean and explore a dirty loan applicant dataset containing duplicate records, invalid zip codes, distorted negative incomes, and non-standard loan terms.',
      datasetDescription: 'Dirty CSV containing 25,000 loan applications with 14 data quality anomalies.',
      task: 'Standardize columns, impute realistic employment lengths, cap extreme loan balances, and produce correlation heatmaps.',
      expectedOutput: 'Cleaned production-ready DataFrame, a Data Quality Audit Report, and a Seaborn correlation chart.',
      submissionInstructions: 'Upload Jupyter Notebook with Markdown documentation for each cleaning decision.',
      evaluationCriteria: 'Thoroughness of anomaly detection, sound justification for imputation methods, pristine data types.',
      skillsTested: ['Data Cleaning', 'EDA', 'Python', 'Pandas']
    },
    businessCase: {
      title: 'Fintech Credit Risk: Eliminating Biased Training Distortions',
      companyContext: 'Digital lender evaluating consumer micro-loans.',
      problem: 'Underwriting models were rejecting prime borrowers due to mismatched date formatting and whitespace in employment status fields.',
      deliverable: 'Automated data validation pipeline with automated alert thresholds.'
    },
    practicalChallenge: 'Write a regex pattern to extract the 3-digit CVV and 4-digit expiration year from a messy transaction memo string.',
    quiz: {
      id: 'quiz-day-6',
      title: 'Day 6 Checkpoint: Data Quality & EDA',
      passingScore: 70,
      questions: [
        {
          id: 'q6-1',
          type: 'mcq',
          question: 'If a metric is heavily skewed (e.g. Household Net Worth), which measure of central tendency is most robust for imputation?',
          options: ['Median', 'Mean', 'Standard Deviation', 'Maximum'],
          correctAnswer: 'Median',
          explanation: 'The median is resistant to extreme outliers, whereas the arithmetic mean is pulled towards the long tail.'
        }
      ]
    },
    resources: [
      { name: 'Data Cleaning Checklist', type: 'Documentation', url: '#' },
      { name: 'Loan Applications Dirty Dataset', type: 'Dataset', url: '#' }
    ],
    expectedOutcomes: [
      'Ability to audit and clean messy real-world corporate records',
      'Proficiency with IQR outlier handling and regex data normalization',
      'Produce exploratory correlation heatmaps and boxplots'
    ],
    skillMapping: ['Data Cleaning', 'EDA', 'Pandas'],
    careerRelevance: {
      tool: 'Data Quality Frameworks',
      usedInRoles: ['Data Analyst', 'Data Steward', 'Quality Assurance Analyst'],
      salaryOutlook: '$75,000 - $105,000 / year'
    }
  },
  {
    day: 7,
    title: 'MS Excel for Analytics',
    domain: 'MS Excel for Analytics',
    learningObjective: 'Master enterprise Excel productivity: modern dynamic arrays (XLOOKUP, FILTER, UNIQUE, SORT), Pivot Tables, and scenario analysis.',
    agenda: [
      'The Modern Excel Engine: Dynamic Array Formulas & Spilling',
      'Advanced Lookup: XLOOKUP vs INDEX/MATCH vs VLOOKUP',
      'Logical & Conditional Functions: SUMIFS, COUNTIFS, IFS, LAMBDA',
      'Enterprise Pivot Tables, Slicers, Timelines, and Calculated Fields',
      'Hands-On: Regional Sales Performance & Margin Dashboard'
    ],
    concepts: [
      {
        heading: 'Why Excel Remains King in Fortune 500 Boardrooms',
        description: 'Executive leadership, CFOs, and operations teams consume business models in Excel. Analysts who build error-free, audited workbooks stand out.',
        codeExample: '=XLOOKUP(A2, Customers!A:A, Customers!F:F, "Not Found", 0, 1)\n=FILTER(SalesData, (Region="West") * (Revenue > 50000))'
      }
    ],
    handsOnLab: {
      title: 'Lab 7: Dynamic Budget vs. Actual Variance Model',
      businessScenario: 'Build an automated monthly financial variance model for regional directors, comparing budgeted operating expenses to actual ledger bookings.',
      datasetDescription: 'Two Excel tabs: Budget_Targets (1,200 lines) and Actual_Bookings (48,000 lines).',
      task: 'Use modern formulas (XLOOKUP, SUMIFS) and dynamic array filters to display monthly over/under variances with conditional formatting heatmaps.',
      expectedOutput: 'Interactive Excel workbook with dynamic dropdowns, KPI cards, and Pivot Table variance breakdown.',
      submissionInstructions: 'Upload the completed .xlsx workbook.',
      evaluationCriteria: 'Zero hardcoded calculations, dynamic formula robustness, visual layout quality.',
      skillsTested: ['Excel', 'Pivot Tables', 'Financial Modeling']
    },
    businessCase: {
      title: 'Manufacturing Co: Raw Material Cost Inflation Tracking',
      companyContext: 'Automotive components manufacturer supplying 4 global assembly plants.',
      problem: 'Steel and aluminum price fluctuations were eroding gross margins by 4.2% without real-time tracking.',
      deliverable: 'Dynamic pricing sensitivity workbook that recalculates unit margin upon entering spot commodity prices.'
    },
    practicalChallenge: 'Create an Excel formula that returns the unique list of customers sorted alphabetically who purchased more than $10,000 in Q1.',
    quiz: {
      id: 'quiz-day-7',
      title: 'Day 7 Checkpoint: Advanced Formulas & Dynamic Arrays',
      passingScore: 70,
      questions: [
        {
          id: 'q7-1',
          type: 'mcq',
          question: 'What advantage does XLOOKUP have over traditional VLOOKUP?',
          options: [
            'It can look to the left, defaults to exact match, and does not break when columns are inserted',
            'It only works with numbers',
            'It requires sorting the lookup column in ascending order',
            'It creates a macro automatically'
          ],
          correctAnswer: 'It can look to the left, defaults to exact match, and does not break when columns are inserted',
          explanation: 'XLOOKUP separates lookup and return arrays, searches in any direction, and handles missing values natively.'
        }
      ]
    },
    resources: [
      { name: 'Modern Excel Formulas Guide', type: 'Cheatsheet', url: '#' },
      { name: 'Financial Variance Template', type: 'Template', url: '#' }
    ],
    expectedOutcomes: [
      'Mastery of XLOOKUP and dynamic array formulas (FILTER, UNIQUE)',
      'Construct automated Pivot Table models with calculated fields',
      'Deliver executive-ready financial variance workbooks'
    ],
    skillMapping: ['Excel', 'Pivot Tables', 'Business Analytics'],
    careerRelevance: {
      tool: 'Microsoft Excel',
      usedInRoles: ['Business Analyst', 'MIS Executive', 'Reporting Analyst', 'Operations Analyst'],
      salaryOutlook: '$70,000 - $98,000 / year'
    }
  },
  {
    day: 8,
    title: 'Advanced Excel + Business Analysis',
    domain: 'MS Excel for Analytics',
    learningObjective: 'Master automated data ingestion using Power Query (M Language), Data Models with Power Pivot, and What-If Scenario Analysis.',
    agenda: [
      'Power Query: Unpivoting messy cross-tabs, merging multiple files from a folder',
      'Data Modeling with Power Pivot & Defining Explicit Measures',
      'What-If Analysis: Goal Seek, Data Tables, and Scenario Manager',
      'Auditing Workbooks: Trace Precedents, Error Tracing, and Formula Evaluation',
      'Hands-On: Automated Multi-Branch Reconciliation in Power Query'
    ],
    concepts: [
      {
        heading: 'Power Query: The ETL Engine Inside Excel',
        description: 'Automate repetitive weekly spreadsheet consolidation. Transform, unpivot, and clean 100+ CSV files with zero copy-pasting.',
        businessNote: 'A solid Power Query workflow saves 8-12 hours of manual analyst labor every week.'
      }
    ],
    handsOnLab: {
      title: 'Lab 8: Building an Automated Multi-Store ETL in Power Query',
      businessScenario: 'Consolidate 12 separate monthly branch sales reports with mismatched column headers into a unified Star Schema data model.',
      datasetDescription: 'Folder of 12 monthly store files with unpivoted date columns and header notes.',
      task: 'Use Power Query to clean, unpivot, and merge all reports into a unified data model, then create Power Pivot measures.',
      expectedOutput: 'A 1-click refreshable Excel workbook connected to the data folder.',
      submissionInstructions: 'Upload completed workbook with Power Query transformation steps documented.',
      evaluationCriteria: 'Refreshability, correct unpivoting of date columns, zero hardcoded values.',
      skillsTested: ['Power Query', 'Data Modeling', 'Excel']
    },
    businessCase: {
      title: 'Hospitality Chain: Hotel RevPAR Dynamic Optimization',
      companyContext: 'Boutique hotel chain with 35 properties.',
      problem: 'Weekend occupancy surged while midweek revenues slumped, leading to suboptimal RevPAR (Revenue Per Available Room).',
      deliverable: 'Goal Seek scenario model determining optimal discount thresholds to maximize total room yield.'
    },
    practicalChallenge: 'In Power Query, unpivot 12 monthly columns (Jan through Dec) into two columns: "Month" and "Sales Amount".',
    quiz: {
      id: 'quiz-day-8',
      title: 'Day 8 Checkpoint: Power Query & Enterprise Modeling',
      passingScore: 70,
      questions: [
        {
          id: 'q8-1',
          type: 'mcq',
          question: 'What is the primary benefit of "Unpivot Columns" in Power Query?',
          options: [
            'It converts wide, human-friendly summary spreadsheets into tall, database-normalized tables suitable for BI analysis',
            'It deletes all blank rows automatically',
            'It calculates standard deviation',
            'It converts text to uppercase'
          ],
          correctAnswer: 'It converts wide, human-friendly summary spreadsheets into tall, database-normalized tables suitable for BI analysis',
          explanation: 'BI and database engines require normalized tall records rather than wide matrices spanning across columns.'
        }
      ]
    },
    resources: [
      { name: 'Power Query M Language Reference', type: 'Documentation', url: '#' },
      { name: 'Multi-Store Sales Raw Folder (.zip)', type: 'Dataset', url: '#' }
    ],
    expectedOutcomes: [
      'Automate repetitive data cleaning with Power Query',
      'Unpivot legacy executive spreadsheets into clean relational tables',
      'Execute multi-variable What-If scenario models'
    ],
    skillMapping: ['Power Query', 'Excel', 'Data Modeling'],
    careerRelevance: {
      tool: 'Power Query & Power Pivot',
      usedInRoles: ['Senior Business Analyst', 'Finance Analyst', 'Commercial Manager'],
      salaryOutlook: '$80,000 - $112,000 / year'
    }
  },
  {
    day: 9,
    title: 'PowerPoint for Business Reporting',
    domain: 'PowerPoint for Business Reporting',
    learningObjective: 'Master executive business storytelling, structuring board-level presentations using the Minto Pyramid Principle, and translating complex analytics into decision memos.',
    agenda: [
      'The Minto Pyramid Principle: Lead with the Answer (SCQA Framework)',
      'Executive Slide Architecture: Action Titles vs. Descriptive Headers',
      'Eliminating Cognitive Friction: High-Signal Visual Hierarchy',
      'Callout Callouts & Annotated Chart Storytelling',
      'Hands-On: Crafting a 5-Slide C-Suite Turnaround Brief'
    ],
    concepts: [
      {
        heading: 'Action Titles Drive Executive Decisions',
        description: 'Never title a slide "Q3 Revenue Breakdown". Title it: "Enterprise Deals Grew 34%, Offsetting a 12% Contraction in SMB Churn".',
        businessNote: 'Executives spend an average of 4 seconds scanning slide titles before deciding whether to read further.'
      }
    ],
    handsOnLab: {
      title: 'Lab 9: Executive Board Briefing on Q3 Profit Warning',
      businessScenario: 'Transform a 40-page messy spreadsheet report into a crisp, high-impact 5-slide executive presentation explaining why operating margins contracted.',
      datasetDescription: 'Quarterly financial ledger and customer churn summary.',
      task: 'Design 5 slides: Executive Summary, Root Cause Diagnostic, Regional Deep Dive, Scenario Projections, and Recommended Action Plan.',
      expectedOutput: 'A clean, executive-styled slide deck with clear action titles and annotations.',
      submissionInstructions: 'Upload .pptx or exported PDF slide deck.',
      evaluationCriteria: 'Adherence to Minto Principle, clarity of action titles, zero visual clutter.',
      skillsTested: ['Business Storytelling', 'PowerPoint', 'Executive Communication']
    },
    businessCase: {
      title: 'Health Insurer: Communicating Pharmacy Benefit Spikes to the Board',
      companyContext: 'Regional health insurer covering 850,000 policyholders.',
      problem: 'Specialty drug claims spiked $38M, creating an urgent need to brief the Board of Directors on risk mitigation.',
      deliverable: '3-slide decision memo outlining formulary renegotiation vs. reinsurance options.'
    },
    practicalChallenge: 'Rewrite this slide title to be an Action Title: "Customer Satisfaction Survey Responses 2024".',
    quiz: {
      id: 'quiz-day-9',
      title: 'Day 9 Checkpoint: Business Reporting & Storytelling',
      passingScore: 70,
      questions: [
        {
          id: 'q9-1',
          type: 'mcq',
          question: 'In the SCQA executive storytelling framework, what does the letter "Q" represent?',
          options: ['Question (the central business dilemma)', 'Quantity', 'Quarterly Target', 'Quality Control'],
          correctAnswer: 'Question (the central business dilemma)',
          explanation: 'Situation, Complication, Question, Answer is the standard consulting structure popularized by McKinsey.'
        }
      ]
    },
    resources: [
      { name: 'Executive Presentation Template (.pptx)', type: 'Template', url: '#' },
      { name: 'Minto Pyramid Storytelling Framework', type: 'Documentation', url: '#' }
    ],
    expectedOutcomes: [
      'Structure presentations using the SCQA consulting framework',
      'Write action-oriented slide headers that drive immediate comprehension',
      'Present complex data to non-technical C-suite stakeholders'
    ],
    skillMapping: ['Business Storytelling', 'PowerPoint', 'Communication'],
    careerRelevance: {
      tool: 'PowerPoint & Executive Memos',
      usedInRoles: ['Management Consultant', 'Strategy Analyst', 'Chief of Staff Analyst'],
      salaryOutlook: '$85,000 - $125,000 / year'
    }
  },
  {
    day: 10,
    title: 'Power BI',
    domain: 'Power BI',
    learningObjective: 'Master end-to-end business intelligence: Star Schema data modeling, DAX formulas (CALCULATE, FILTER, ALL, RELATED), and interactive report building.',
    agenda: [
      'Power BI Architecture: Desktop, Service, Gateway, and Mobile',
      'Data Modeling Excellence: Star Schema vs. Snowflake, Fact vs. Dimension Tables',
      'DAX Foundations: Calculated Columns vs. Explicit Measures',
      'Mastering CALCULATE(): Modifying Filter Context',
      'Time Intelligence in DAX: YTD, QTD, SamePeriodLastYear',
      'Hands-On: Enterprise Sales & Margin Cockpit'
    ],
    concepts: [
      {
        heading: 'Filter Context vs. Row Context in DAX',
        description: 'Row context evaluates expressions row-by-row. Filter context determines what subset of data is visible to an aggregation based on slicers and matrix headers.',
        codeExample: 'Total Sales = SUM(FactSales[Revenue])\nSales LY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(DimDate[Date]))\nYoY Growth % = DIVIDE([Total Sales] - [Sales LY], [Sales LY], 0)'
      }
    ],
    handsOnLab: {
      title: 'Lab 10: Building an Executive Commercial Sales Cockpit',
      businessScenario: 'Build an interactive Power BI report for a global electronics distributor to monitor real-time gross margin, customer returns, and sales representative quota attainment.',
      datasetDescription: 'Fact_Sales (250,000 rows), Dim_Product, Dim_Customer, Dim_Territory, Dim_Date.',
      task: 'Construct a pure Star Schema model, write 6 DAX measures including YoY growth, and build an interactive multi-tab report with drill-through.',
      expectedOutput: 'Interactive .pbix file or published web report link.',
      submissionInstructions: 'Submit published Power BI URL or GitHub link to .pbix file.',
      evaluationCriteria: 'Clean Star Schema relationships (1-to-many), explicit DAX measures, intuitive cross-filtering UX.',
      skillsTested: ['Power BI', 'DAX', 'Data Modeling', 'Dashboard Design']
    },
    businessCase: {
      title: 'Pharmaceutical: Territory Rep Performance & Doctor Detailing',
      companyContext: 'Specialty pharma company with 450 field sales representatives.',
      problem: 'Field management lacked visibility into which physician visits resulted in new prescription originations.',
      deliverable: 'Power BI drill-through report enabling regional managers to inspect prescription rates by physician.'
    },
    practicalChallenge: 'Write a DAX measure that calculates the % contribution of a selected product category to overall company sales, regardless of category slicer selections.',
    quiz: {
      id: 'quiz-day-10',
      title: 'Day 10 Checkpoint: Power BI & DAX Essentials',
      passingScore: 70,
      questions: [
        {
          id: 'q10-1',
          type: 'mcq',
          question: 'Why is CALCULATE() considered the most powerful function in DAX?',
          options: [
            'It is the only function that can override, add to, or clear the existing filter context',
            'It calculates multiplication faster than the * operator',
            'It exports tables to Excel directly',
            'It connects to SQL without credentials'
          ],
          correctAnswer: 'It is the only function that can override, add to, or clear the existing filter context',
          explanation: 'CALCULATE evaluates an expression in a modified filter context specified by its arguments.'
        }
      ]
    },
    resources: [
      { name: 'DAX Formulas Master Guide', type: 'Documentation', url: '#' },
      { name: 'Contoso Retail Star Schema Dataset', type: 'Dataset', url: '#' }
    ],
    expectedOutcomes: [
      'Architect robust Star Schema relationships in Power BI',
      'Write production DAX measures with CALCULATE and DIVIDE',
      'Implement interactive cross-filtering and drill-through'
    ],
    skillMapping: ['Power BI', 'DAX', 'Dashboard Design'],
    careerRelevance: {
      tool: 'Microsoft Power BI',
      usedInRoles: ['BI Analyst', 'Power BI Developer', 'MIS Analyst', 'Commercial BI Specialist'],
      salaryOutlook: '$85,000 - $120,000 / year'
    }
  },
  {
    day: 11,
    title: 'Data Visualization + Dashboard Storytelling',
    domain: 'Best Practices in Data Visualization',
    learningObjective: 'Master perceptual psychology, Gestalt principles, accessibility (WCAG color contrast), dashboard layout architecture (F-Pattern), and avoiding misleading visualizations.',
    agenda: [
      'The Science of Visual Perception: Preattentive Attributes (Color, Form, Position)',
      'Gestalt Principles in Dashboard Layout: Proximity, Similarity, Enclosure',
      'Choosing the Right Chart: Beyond Bar and Line (Scatter, Bullet, Treemap, Waterfall)',
      'The Anti-Slop Visual Rules: Banning 3D Charts, Dual-Axis Traps, and Color Vomit',
      'Hands-On: Redesigning an Overcrowded Operational Dashboard'
    ],
    concepts: [
      {
        heading: 'Cognitive Load and the 5-Second Test',
        description: 'A well-designed enterprise dashboard communicates its primary status within 5 seconds. If users must decipher what an axis means, the layout has failed.',
        businessNote: 'High-performing executives do not want decoration; they want visual signal, benchmark context, and clear actionable deltas.'
      }
    ],
    handsOnLab: {
      title: 'Lab 11: Enterprise Dashboard Makeover & UX Overhaul',
      businessScenario: 'Take a cluttered, multi-colored legacy executive dashboard with 16 disparate charts and redesign it into a clean, hierarchical command center.',
      datasetDescription: 'SaaS operational metrics: MRR, Churn, CAC, LTV, Active Sessions, Ticket Backlog.',
      task: 'Apply the F-pattern visual layout, monochromatic corporate palettes with intentional accent alerts, and bullet charts for targets.',
      expectedOutput: 'Clean, professional Power BI or web dashboard redesign.',
      submissionInstructions: 'Upload before-and-after screenshots with a 1-page design rationale memo.',
      evaluationCriteria: 'Reduction of cognitive load, contrast accessibility, proper chart selection.',
      skillsTested: ['Data Visualization', 'Dashboard Design', 'Business Storytelling']
    },
    businessCase: {
      title: 'Fintech Fraud Operations: Real-Time Threat Command Center',
      companyContext: 'Payment processor handling 40M daily authorizations.',
      problem: 'Fraud analysts were missing suspicious cluster spikes because current dashboards used 8 competing bright colors.',
      deliverable: 'High-contrast, dark-mode monitoring interface emphasizing outlier anomalies.'
    },
    practicalChallenge: 'List 3 reasons why a Bullet Graph is superior to a Gauge ("Speedometer") chart for enterprise target monitoring.',
    quiz: {
      id: 'quiz-day-11',
      title: 'Day 11 Checkpoint: Visual Perception & Design Principles',
      passingScore: 70,
      questions: [
        {
          id: 'q11-1',
          type: 'mcq',
          question: 'According to human perception research, which visual attribute is processed most accurately for quantitative comparisons?',
          options: ['Position along a common scale', 'Area of a circle', 'Color saturation', 'Angle or slope'],
          correctAnswer: 'Position along a common scale',
          explanation: 'Cleveland & McGill perception studies demonstrate that humans judge position along a common scale with the highest optical precision.'
        }
      ]
    },
    resources: [
      { name: 'Chart Chooser Guide & Decision Matrix', type: 'Cheatsheet', url: '#' },
      { name: 'Accessible Color Palette Generator', type: 'Documentation', url: '#' }
    ],
    expectedOutcomes: [
      'Design accessible, high-signal enterprise dashboards',
      'Select the exact visualization suited for each analytical relationship',
      'Eliminate visual clutter and cognitive friction'
    ],
    skillMapping: ['Data Visualization', 'Dashboard Design', 'Business Storytelling'],
    careerRelevance: {
      tool: 'Tableau / Power BI / D3',
      usedInRoles: ['Lead BI Architect', 'Information Designer', 'Senior Data Analyst'],
      salaryOutlook: '$90,000 - $130,000 / year'
    }
  },
  {
    day: 12,
    title: 'Prompt Engineering / GenAI for Analysts + Capstone & Readiness',
    domain: 'Prompt Engineering / GenAI for Analysts',
    learningObjective: 'Harness LLMs (Gemini) to accelerate SQL generation, Python automation, synthetic data creation, complete the Final Capstone, and take the Job Readiness Assessment.',
    agenda: [
      'GenAI for Analytics: Code Generation, Query Optimization, and Regex Drafting',
      'Prompt Patterns for Analysts: Few-Shot Prompting, Persona Stacking, Chain-of-Thought',
      'Automating Data Summaries and Executive Briefs with Gemini',
      'Final Capstone Project Integration: Problem -> SQL -> Python -> BI -> Presentation',
      'Comprehensive Job Readiness Assessment & Certification Eligibility Audit'
    ],
    concepts: [
      {
        heading: 'The Augmented Analyst Mindset',
        description: 'AI will not replace analysts, but analysts who leverage GenAI to write boilerplate SQL, debug complex regex, and draft initial memos work 4x faster.',
        codeExample: 'Prompt Pattern:\n"Act as a Principal Data Architect. Given this Postgres schema [schema], write an optimized query using CTEs that finds the 90th percentile checkout latency per region. Include comments explaining index choices."'
      }
    ],
    handsOnLab: {
      title: 'Lab 12: Building a GenAI-Powered Automated KPI Explainer',
      businessScenario: 'Build an automated pipeline that takes daily variance anomalies from a SQL query and uses Gemini to generate a 3-bullet executive Slack brief.',
      datasetDescription: 'Daily sales anomalies JSON feed.',
      task: 'Write a Python script leveraging Gemini API with structured output prompting to produce an executive diagnostic summary.',
      expectedOutput: 'Script outputting formatted Markdown executive summaries for anomaly spikes.',
      submissionInstructions: 'Submit Python code and prompt engineering documentation.',
      evaluationCriteria: 'Prompt clarity, handling edge cases, formatting consistency.',
      skillsTested: ['GenAI', 'Prompt Engineering', 'Python', 'SQL']
    },
    businessCase: {
      title: 'Global Retail Conglomerate: Accelerating Ad-Hoc Ticket Triage',
      companyContext: 'Retailer with 200 business analysts receiving 4,000 monthly ad-hoc query requests.',
      problem: 'Analysts spent 45% of their working hours rewriting basic SQL aggregations for non-technical category managers.',
      deliverable: 'Internal GenAI assistant converting natural language questions into verified read-only SQL queries.'
    },
    practicalChallenge: 'Write a prompt that instructs an LLM to take an unformatted SQL query and return: 1) Formatted query, 2) Estimated complexity, 3) Suggestions for missing indexes.',
    quiz: {
      id: 'quiz-day-12',
      title: 'Day 12 Checkpoint: GenAI & Final Comprehensive Workshop Review',
      passingScore: 75,
      questions: [
        {
          id: 'q12-1',
          type: 'mcq',
          question: 'What is the most effective prompt engineering technique to prevent an LLM from hallucinating column names when generating SQL?',
          options: [
            'Provide the exact DDL table schema and state explicitly: "Use only the column names defined in the schema above"',
            'Ask the model to be very confident',
            'Type the prompt in ALL CAPS',
            'Include 50 different unrelated questions'
          ],
          correctAnswer: 'Provide the exact DDL table schema and state explicitly: "Use only the column names defined in the schema above"',
          explanation: 'Grounding the LLM with the exact database schema and negative constraints prevents the model from assuming imaginary column names.'
        },
        {
          id: 'q12-2',
          type: 'mcq',
          question: 'In the end-to-end Data Analytics lifecycle, what is the ultimate measure of success for a project?',
          options: [
            'It changes a business decision, improves an operational metric, or saves commercial capital',
            'The dashboard has more than 20 charts',
            'The Python code uses the most complex algorithm available',
            'The SQL query is over 500 lines long'
          ],
          correctAnswer: 'It changes a business decision, improves an operational metric, or saves commercial capital',
          explanation: 'Analytics delivers value strictly through business impact and enhanced decision quality.'
        }
      ]
    },
    resources: [
      { name: 'GenAI Prompt Guide for Analysts', type: 'Cheatsheet', url: '#' },
      { name: 'Capstone Project Guidelines Document', type: 'Documentation', url: '#' }
    ],
    expectedOutcomes: [
      'Supercharge daily workflows using GenAI prompt engineering',
      'Submit the comprehensive 8-stage Capstone Project',
      'Complete the Job Readiness Assessment and qualify for Certification'
    ],
    skillMapping: ['GenAI', 'Prompt Engineering', 'Python', 'SQL', 'Capstone'],
    careerRelevance: {
      tool: 'Gemini / Claude / OpenAI API',
      usedInRoles: ['AI-Augmented Data Analyst', 'Analytics Lead', 'Business Intelligence Consultant'],
      salaryOutlook: '$95,000 - $140,000 / year'
    }
  }
];
