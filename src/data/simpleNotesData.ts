import { DaySimpleNotes } from '../types';

export const SIMPLE_NOTES_DATA: DaySimpleNotes[] = [
  {
    day: 1,
    domain: 'Data Analytics Fundamentals',
    summary: 'The foundation of enterprise analytics is translating ambiguous business problems into structured, verifiable hypotheses and metric trees.',
    cheatSheet: [
      {
        category: 'Analytics Value Chain',
        items: [
          'Descriptive: What happened? (e.g. Sales dropped 12% in Q3)',
          'Diagnostic: Why did it happen? (e.g. Supply chain delay caused stockouts)',
          'Predictive: What is likely to happen? (e.g. Forecast 8% churn next quarter)',
          'Prescriptive: What action should we take? (e.g. Trigger $10 retention voucher)'
        ]
      },
      {
        category: 'Metric Architecture Rules',
        items: [
          'Leading Indicators: Measurable input signals before the outcome (e.g. Daily active logins, feature adoption rate)',
          'Lagging Indicators: Output results recorded after the fact (e.g. Churn rate, quarterly net revenue)',
          'North Star Metric: Single metric that best captures the core value delivered to customers',
          'MECE Principle: Mutually Exclusive, Collectively Exhaustive problem decomposition'
        ]
      }
    ],
    keyFormulasAndSyntax: [
      {
        name: 'Revenue Metric Tree',
        syntax: 'Net Revenue = (Active Users × Avg Order Frequency × Avg Order Value) - Refunds - CAC',
        usage: 'Pinpoint which specific driver is dragging down top-line financial performance.'
      },
      {
        name: 'Conversion Rate',
        syntax: 'CVR = (Successful Completions / Total Top-of-Funnel Visitors) × 100',
        usage: 'Measure stage-by-stage leakage across registration, onboarding, or checkout funnels.'
      },
      {
        name: 'Customer Lifetime Value (LTV)',
        syntax: 'LTV = (Average Order Value × Purchase Frequency) / Churn Rate',
        usage: 'Determine allowable Customer Acquisition Cost (CAC) thresholds (Ideal LTV:CAC is 3:1).'
      }
    ],
    commonMistakes: [
      'Jumping straight into SQL queries or Python before writing down clear hypotheses.',
      'Treating correlation as causation without controlling for confounding variables.',
      'Reporting vanity metrics (e.g., total registered users) instead of operational metrics (active transacting users).'
    ],
    proTips: [
      'Always ask the stakeholder: "What specific decision will you make differently based on this number?"',
      'Benchmark metrics against industry peers and historical baseline periods rather than viewing in isolation.'
    ]
  },
  {
    day: 2,
    domain: 'SQL Fundamentals',
    summary: 'Master relational querying with SELECT, WHERE filtering, aggregated statistics, GROUP BY, and multi-table INNER and OUTER JOINs.',
    cheatSheet: [
      {
        category: 'Query Execution Sequence (Logical Order)',
        items: [
          '1. FROM & JOIN (locate tables and join datasets)',
          '2. WHERE (filter raw row-level records)',
          '3. GROUP BY (aggregate rows into distinct buckets)',
          '4. HAVING (filter aggregated buckets)',
          '5. SELECT (project specific columns & expressions)',
          '6. DISTINCT (eliminate duplicate output rows)',
          '7. ORDER BY (sort output ascending or descending)',
          '8. LIMIT / OFFSET (slice result subset)'
        ]
      },
      {
        category: 'JOIN Types at a Glance',
        items: [
          'INNER JOIN: Only rows where join keys match in BOTH tables',
          'LEFT JOIN: All rows from left table, plus matching rows from right (NULL if no match)',
          'RIGHT JOIN: All rows from right table, plus matching from left',
          'FULL OUTER JOIN: All rows from both tables, filling missing fields with NULL'
        ]
      }
    ],
    keyFormulasAndSyntax: [
      {
        name: 'Aggregated Grouping with Filter',
        syntax: 'SELECT category, COUNT(order_id) AS total_orders, SUM(amount) AS total_sales\nFROM orders\nWHERE status = \'COMPLETED\'\nGROUP BY category\nHAVING SUM(amount) > 10000\nORDER BY total_sales DESC;',
        usage: 'Filter raw transactions, bucket by product category, filter high-value buckets, and sort.'
      },
      {
        name: 'Safe NULL Handling with COALESCE',
        syntax: 'SELECT customer_id, COALESCE(phone_number, \'NOT PROVIDED\') AS contact\nFROM customers;',
        usage: 'Replace null values with fallback strings to prevent null pointer bugs.'
      }
    ],
    commonMistakes: [
      'Using WHERE instead of HAVING to filter on aggregated values like SUM() or COUNT().',
      'Selecting non-aggregated columns without including them in the GROUP BY clause.',
      'Assuming COUNT(column) behaves like COUNT(*) — COUNT(col) ignores NULL values!'
    ],
    proTips: [
      'Always inspect the cardinality of join keys to prevent accidental Cartesian explosion (row duplication).',
      'Format SQL with UPPERCASE keywords and indented clauses for readability in enterprise pull requests.'
    ]
  },
  {
    day: 3,
    domain: 'Advanced SQL & Data Transformations',
    summary: 'Master analytical Window Functions (ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG), Common Table Expressions (CTEs), and Subqueries.',
    cheatSheet: [
      {
        category: 'Window Functions vs. GROUP BY',
        items: [
          'GROUP BY collapses rows into a single aggregated record per bucket.',
          'WINDOW FUNCTIONS compute calculations across row partitions WITHOUT collapsing rows.',
          'Syntax: FUNCTION() OVER (PARTITION BY col1 ORDER BY col2 ROWS BETWEEN ...)'
        ]
      },
      {
        category: 'Ranking Functions Differences',
        items: [
          'ROW_NUMBER(): Always assigns sequential integers (1, 2, 3, 4) even on ties.',
          'RANK(): Leaves gaps after ties (e.g. 1, 2, 2, 4).',
          'DENSE_RANK(): Never leaves gaps after ties (e.g. 1, 2, 2, 3).'
        ]
      }
    ],
    keyFormulasAndSyntax: [
      {
        name: 'Top-N per Category Pattern',
        syntax: 'WITH RankedOrders AS (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY order_amount DESC) as rn\n  FROM orders\n)\nSELECT * FROM RankedOrders WHERE rn <= 3;',
        usage: 'Retrieve top 3 highest spending transactions per category.'
      },
      {
        name: 'Month-over-Month Growth with LAG',
        syntax: 'SELECT month, revenue,\n  LAG(revenue, 1) OVER (ORDER BY month) AS prev_month_rev,\n  ROUND((revenue - LAG(revenue, 1) OVER (ORDER BY month)) / LAG(revenue, 1) OVER (ORDER BY month) * 100, 2) AS mom_growth_pct\nFROM monthly_sales;',
        usage: 'Calculate period-over-period delta without self-joining.'
      }
    ],
    commonMistakes: [
      'Trying to filter window function results in the WHERE clause of the same query block (must wrap in a CTE or subquery).',
      'Forgetting ORDER BY inside the OVER() clause for ranking or cumulative sum operations.'
    ],
    proTips: [
      'Use Common Table Expressions (WITH clause) instead of deeply nested subqueries for maintainability.',
      'Use ROWS BETWEEN 6 PRECEDING AND CURRENT ROW to calculate rolling 7-day moving averages.'
    ]
  },
  {
    day: 4,
    domain: 'Data Cleaning & Preprocessing',
    summary: 'Systematically cleanse dirty real-world datasets: missing values, schema casting, duplicate deduplication, string parsing, and regex extraction.',
    cheatSheet: [
      {
        category: 'Missing Data Strategies',
        items: [
          'MCAR (Missing Completely at Random): Drop rows or impute median/mean.',
          'MAR (Missing at Random): Impute using conditional group values (e.g. median salary by job title).',
          'MNAR (Missing Not at Random): Missingness has meaning (e.g. non-respondents); flag as separate category.'
        ]
      },
      {
        category: 'Outlier Detection Methods',
        items: [
          'IQR Rule: Values outside [Q1 - 1.5×IQR, Q3 + 1.5×IQR]',
          'Z-Score: Values with absolute z-score > 3 (assuming normal distribution)',
          'Domain Thresholds: Hard limits based on business physical reality (e.g. age < 0 or > 120)'
        ]
      }
    ],
    keyFormulasAndSyntax: [
      {
        name: 'Interquartile Range (IQR)',
        syntax: 'IQR = Q3 - Q1; Lower_Bound = Q1 - 1.5 * IQR; Upper_Bound = Q3 + 1.5 * IQR',
        usage: 'Detect extreme outliers robust against non-normal or skewed data.'
      },
      {
        name: 'Standardizing Dates in SQL',
        syntax: 'SELECT CAST(order_date AS DATE) AS cleaned_date,\n       DATE_TRUNC(\'month\', CAST(order_date AS DATE)) AS month_bucket\nFROM raw_events;',
        usage: 'Ensure uniform timestamps across multi-region transaction streams.'
      }
    ],
    commonMistakes: [
      'Blindly dropping all rows with any NULL value, introducing severe survivorship bias.',
      'Imputing the mean on heavily skewed distributions (use the median instead).'
    ],
    proTips: [
      'Always profile data distributions with summary statistics (min, max, null count, unique count) before cleaning.',
      'Keep raw source data immutable; write transformations into clean target tables with pipeline lineage.'
    ]
  },
  {
    day: 5,
    domain: 'Python for Data Analytics: Foundations',
    summary: 'Core Python data structures, vector math with NumPy, list comprehensions, lambda functions, and clean data processing idioms.',
    cheatSheet: [
      {
        category: 'Python Collections Hierarchy',
        items: [
          'List: Ordered, mutable, allows duplicates [1, 2, 2, 3]',
          'Tuple: Ordered, immutable (x, y coordinates)',
          'Dict: Key-value hash map, O(1) lookups {"user_id": 101, "tier": "gold"}',
          'Set: Unordered, unique elements only {1, 2, 3}'
        ]
      },
      {
        category: 'NumPy Vectorization',
        items: [
          'Vectorized operations execute in compiled C, 50x-100x faster than pure Python loops.',
          'Avoid `for` loops across arrays; write `arr * 1.1` instead.'
        ]
      }
    ],
    keyFormulasAndSyntax: [
      {
        name: 'List Comprehension with Conditional',
        syntax: 'high_value_orders = [ord["id"] for ord in orders if ord["amount"] >= 500]',
        usage: 'Concise, idiomatic extraction and filtering in Python.'
      },
      {
        name: 'NumPy Array Broadcasting & Filtering',
        syntax: 'import numpy as np\nprices = np.array([12.5, 45.0, 99.9, 150.0])\ndiscounted = prices[prices > 40.0] * 0.9',
        usage: 'Perform high-speed vectorized boolean indexing and element-wise math.'
      }
    ],
    commonMistakes: [
      'Iterating through lists with index-based loops (`for i in range(len(lst)):`) instead of `for item in lst:`.',
      'Modifying a collection while iterating over it, causing skipped elements.'
    ],
    proTips: [
      'Leverage Python built-ins like `zip()`, `enumerate()`, and `collections.Counter` to write clean, Pythonic code.',
      'Write docstrings and type hints (`def calculate_churn(users: int, churned: int) -> float:`) for enterprise teams.'
    ]
  },
  {
    day: 6,
    domain: 'Data Wrangling with Pandas',
    summary: 'Master DataFrame slicing, boolean masks, groupBy aggregations, merging/joining, pivot tables, and datetime manipulation.',
    cheatSheet: [
      {
        category: 'loc vs. iloc',
        items: [
          'df.loc[row_labels, col_labels]: Label-based selection (inclusive of bounds)',
          'df.iloc[row_positions, col_positions]: Zero-based integer index selection (exclusive of end bound)'
        ]
      },
      {
        category: 'Merge / Join Patterns',
        items: [
          'pd.merge(df1, df2, on="customer_id", how="inner"): SQL-like join',
          'pd.concat([df1, df2], axis=0): Stack tables vertically (union)',
          'df.groupby("category").agg({"sales": "sum", "units": "mean"}): Multi-metric aggregation'
        ]
      }
    ],
    keyFormulasAndSyntax: [
      {
        name: 'Pandas Multi-Aggregation GroupBy',
        syntax: 'summary = df.groupby(\'region\').agg(\n    total_revenue=(\'revenue\', \'sum\'),\n    avg_basket=(\'revenue\', \'mean\'),\n    customer_count=(\'customer_id\', \'nunique\')\n).reset_index()',
        usage: 'Calculate enterprise rollup summaries across multiple metrics cleanly.'
      },
      {
        name: 'Datetime Feature Engineering',
        syntax: 'df[\'order_date\'] = pd.to_datetime(df[\'order_date\'])\ndf[\'year_month\'] = df[\'order_date\'].dt.to_period(\'M\')\ndf[\'day_of_week\'] = df[\'order_date\'].dt.day_name()',
        usage: 'Extract temporal components for time-series trend analysis.'
      }
    ],
    commonMistakes: [
      'Chained indexing `df[col][idx] = val` triggering `SettingWithCopyWarning` (always use `df.loc[idx, col] = val`).',
      'Forgetting to reset the index after a groupby operation, creating awkward MultiIndex columns.'
    ],
    proTips: [
      'Use method chaining with `.pipe()`, `.assign()`, and `.query()` to build elegant, readable data pipelines.',
      'Check memory usage with `df.info(memory_usage=\'deep\')` and downcast int64 to int32/category for huge tables.'
    ]
  },
  {
    day: 7,
    domain: 'EDA & Statistical Thinking',
    summary: 'Descriptive statistics, distribution shapes, skewness, correlation matrices, Central Limit Theorem, and statistical hypothesis testing.',
    cheatSheet: [
      {
        category: 'Measures of Central Tendency',
        items: [
          'Mean: Sensitive to extreme outliers (best for symmetric normal data)',
          'Median: Robust against extreme values (ideal for income, housing prices, order values)',
          'Mode: Most frequent categorical value'
        ]
      },
      {
        category: 'Statistical Significance & P-Values',
        items: [
          'Null Hypothesis (H0): No real effect or difference (change is random noise)',
          'Alternative Hypothesis (H1): Meaningful effect exists',
          'P-Value < 0.05: Reject the null hypothesis with 95% statistical confidence'
        ]
      }
    ],
    keyFormulasAndSyntax: [
      {
        name: 'Pearson Correlation Coefficient (r)',
        syntax: 'r = Σ((x - x̄)(y - ȳ)) / [sqrt(Σ(x - x̄)²) * sqrt(Σ(y - ȳ)²)]',
        usage: 'Measures linear relationship between continuous variables from -1.0 to +1.0.'
      },
      {
        name: 'Standard Normal Z-Score',
        syntax: 'z = (X - μ) / σ',
        usage: 'Normalize diverse metric scales to compare deviations from the population mean.'
      }
    ],
    commonMistakes: [
      'Claiming correlation proves causality without randomized A/B experimentation or causal inference controls.',
      'Misinterpreting a p-value as the probability that the hypothesis is true (p-value is P(Data | H0 is true)).'
    ],
    proTips: [
      'Always plot the data (Anscombe\'s Quartet proves identical summary stats can describe wildly different shapes).',
      'Compute both statistical significance (p-value) AND practical significance (effect size & dollar ROI).'
    ]
  },
  {
    day: 8,
    domain: 'Data Visualization & Storytelling',
    summary: 'Visual perception, pre-attentive attributes, chart selection rules, color psychology, and crafting executive-ready dashboards.',
    cheatSheet: [
      {
        category: 'Chart Selection Matrix',
        items: [
          'Comparison over Time: Line chart (continuous) or Bar chart (discrete buckets)',
          'Composition / Part-to-Whole: 100% Stacked Bar chart or Treemap (avoid complex Pie charts with >3 slices)',
          'Relationship / Correlation: Scatter plot or Heatmap',
          'Distribution: Histogram or Box plot'
        ]
      },
      {
        category: 'Visual Hierarchy & Cognitive Load',
        items: [
          'Maximize the Data-Ink Ratio: Strip out 3D effects, heavy gridlines, and redundant borders.',
          'Pre-attentive Attributes: Use color intentionally as an accent to highlight the key insight, not as decoration.'
        ]
      }
    ],
    keyFormulasAndSyntax: [
      {
        name: 'Seaborn Clean Theming & Formatting',
        syntax: 'import matplotlib.pyplot as plt\nimport seaborn as sns\nsns.set_theme(style="whitegrid")\nfig, ax = plt.subplots(figsize=(10, 5))\nsns.barplot(data=df, x=\'quarter\', y=\'revenue\', color=\'#4338ca\', ax=ax)\nax.set_title(\'QoQ Revenue Expansion ($M)\', fontsize=14, weight=\'bold\')',
        usage: 'Generate publication-quality charts for executive slide decks.'
      }
    ],
    commonMistakes: [
      'Using truncated Y-axes on bar charts (bar charts MUST start at 0 to avoid misleading visual distortion).',
      'Using rainbow color palettes with 10+ colors that overwhelm human working memory.'
    ],
    proTips: [
      'Write action-oriented chart titles (e.g., "Enterprise Segment Drove 64% of Q3 Revenue Expansion" instead of "Revenue by Segment").',
      'Place direct data labels on key data points instead of forcing users to cross-reference a distant legend.'
    ]
  },
  {
    day: 9,
    domain: 'Enterprise BI & Dashboards',
    summary: 'Dimensional modeling, Star Schema, Fact vs. Dimension tables, DAX measures, Time Intelligence, and Power BI report architecture.',
    cheatSheet: [
      {
        category: 'Data Modeling Fundamentals',
        items: [
          'Fact Table: Numerical measurements, metrics, keys (e.g. FactSales with OrderID, DateKey, Revenue, Qty)',
          'Dimension Tables: Contextual descriptive attributes (e.g. DimCustomer, DimProduct, DimDate)',
          'Star Schema: Preferred BI architecture where single facts link directly to surrounding dimension tables.'
        ]
      },
      {
        category: 'DAX: Calculated Columns vs. Measures',
        items: [
          'Calculated Column: Computed row-by-row during data refresh, stored in RAM.',
          'Measure: Computed on the fly based on report filter context (dynamic, highly efficient, best practice).'
        ]
      }
    ],
    keyFormulasAndSyntax: [
      {
        name: 'DAX CALCULATE with Filter Context',
        syntax: 'Total Corporate Sales = \nCALCULATE(\n    SUM(FactSales[Revenue]),\n    DimCustomer[Segment] = "Enterprise"\n)',
        usage: 'Modify the evaluation filter context to isolate specific segments.'
      },
      {
        name: 'DAX Year-Over-Year Growth Measure',
        syntax: 'YoY Revenue Growth % = \nVAR CurrentYearSales = SUM(FactSales[Revenue])\nVAR PriorYearSales = CALCULATE(SUM(FactSales[Revenue]), SAMEPERIODLASTYEAR(DimDate[Date]))\nRETURN\nDIVIDE(CurrentYearSales - PriorYearSales, PriorYearSales, 0)',
        usage: 'Safely calculate percentage change handling zero-division scenarios.'
      }
    ],
    commonMistakes: [
      'Creating calculated columns for simple aggregations instead of reusable DAX measures, blowing up RAM usage.',
      'Allowing bi-directional cross-filtering on relationships without understanding ambiguity risks.'
    ],
    proTips: [
      'Always build a dedicated Date Dimension table (Calendar table) for robust time-intelligence formulas.',
      'Design dashboards following the F-pattern reading order: high-level KPI cards at the top, detailed trends in the middle, granular drilldowns at the bottom.'
    ]
  },
  {
    day: 10,
    domain: 'Business Analytics & Product Metrics',
    summary: 'Cohort retention analysis, LTV/CAC payback periods, funnel drop-off diagnostics, and RFM (Recency, Frequency, Monetary) segmentation.',
    cheatSheet: [
      {
        category: 'Core SaaS & E-Commerce Metrics',
        items: [
          'Monthly Recurring Revenue (MRR): Net subscription revenue billed per month',
          'Net Revenue Retention (NRR): (Beginning MRR + Expansion - Contraction - Churn) / Beginning MRR',
          'CAC Payback: Months of gross margin required to recover customer acquisition costs'
        ]
      },
      {
        category: 'RFM Customer Segmentation Model',
        items: [
          'Recency (R): Days since last transaction (lower is better)',
          'Frequency (F): Total purchase count over time window (higher is better)',
          'Monetary (M): Total lifetime spend (higher is better)',
          'Segments: Champions (555), Loyal Customers (X4X), At Risk (2X4), Hibernating (111)'
        ]
      }
    ],
    keyFormulasAndSyntax: [
      {
        name: 'Net Revenue Retention (NRR)',
        syntax: 'NRR = ((Starting ARR + Expansion ARR - Contraction ARR - Churn ARR) / Starting ARR) * 100',
        usage: 'Assess whether a business grows organically from existing customers (>110% is best in class).'
      },
      {
        name: 'Cohort Retention Rate',
        syntax: 'Month_N_Retention = (Active Users from Cohort in Month N / Initial Size of Cohort in Month 0) * 100',
        usage: 'Identify whether product retention curves flatten out (indicating product-market fit).'
      }
    ],
    commonMistakes: [
      'Confusing user churn with revenue churn (losing 10 small clients is very different from losing 1 enterprise account).',
      'Calculating blended CAC instead of segment-specific paid CAC, masking unprofitable channels.'
    ],
    proTips: [
      'When presenting to leadership, always pair metric changes with the underlying operational "why".',
      'Use RFM scores to direct marketing budget towards retaining high-value at-risk customers.'
    ]
  },
  {
    day: 11,
    domain: 'Analytics Portfolio & GitHub Engineering',
    summary: 'Enterprise repo structure, clean code documentation, reproducible environments, modular SQL/Python, and executive-facing project READMEs.',
    cheatSheet: [
      {
        category: 'Enterprise Git Workflow',
        items: [
          'main/master branch is production-ready and protected.',
          'Feature branches: `feature/customer-segmentation-pipeline`',
          'Commit message standard: Conventional Commits (`feat: add RFM calculation engine`, `fix: correct null handling in join`)'
        ]
      },
      {
        category: 'High-Impact Portfolio Structure',
        items: [
          '1. Executive Summary & TL;DR Business Impact (Dollar figures, efficiency gains)',
          '2. Data Pipeline Architecture Diagram',
          '3. Interactive Dashboard Embed or Screenshots',
          '4. Key Findings & Recommendations Matrix',
          '5. Reproducible Setup Instructions (`requirements.txt` or Docker)'
        ]
      }
    ],
    keyFormulasAndSyntax: [
      {
        name: 'Virtual Environment Setup & Reproducibility',
        syntax: 'python -m venv venv\nsource venv/bin/activate  # (On Windows: venv\\Scripts\\activate)\npip install -r requirements.txt\npip freeze > requirements.txt',
        usage: 'Ensure hiring managers can clone and execute your analysis without dependency conflicts.'
      }
    ],
    commonMistakes: [
      'Committing raw CSV files with sensitive customer PII or API keys to public GitHub repositories.',
      'Uploading messy Jupyter notebooks with out-of-order execution cells (`[12]`, `[3]`, `[56]`).'
    ],
    proTips: [
      'Clear notebook outputs and re-run all cells from top to bottom (1 to N) before pushing to GitHub.',
      'Add a 60-second Loom or YouTube walkthrough video at the top of your portfolio README.'
    ]
  },
  {
    day: 12,
    domain: 'Capstone Project & Executive Defense',
    summary: 'The capstone presentation: structuring an analytical narrative, answering tough executive objections, and proving commercial business value.',
    cheatSheet: [
      {
        category: 'The Minto Pyramid Principle',
        items: [
          'Top: The Conclusion / Bottom-Line Recommendation first (Answer First principle).',
          'Middle: Key Supporting Arguments (Market dynamics, customer behavior, financial impact).',
          'Bottom: Detailed quantitative evidence, query logic, and data validation.'
        ]
      },
      {
        category: 'Handling Executive Q&A',
        items: [
          'Acknowledge and Validate: "That is a critical nuance regarding seasonality..."',
          'Reference the Data: "When we sliced by Q4 holiday promotion cohorts, the effect remained..."',
          'State Assumptions Clearly: "Our forecast assumes baseline customer acquisition cost remains steady at $45."'
        ]
      }
    ],
    keyFormulasAndSyntax: [
      {
        name: 'Return on Investment (ROI) Projection',
        syntax: 'Projected ROI = ((Expected Commercial Gain - Implementation Cost) / Implementation Cost) * 100',
        usage: 'Translate technical recommendations into clear boardroom P&L justification.'
      }
    ],
    commonMistakes: [
      'Dumping 30 slides of technical code and query execution plans onto non-technical stakeholders.',
      'Becoming defensive when leadership questions data integrity or model assumptions.'
    ],
    proTips: [
      'Keep an appendix of 5-10 deep-dive slides ready for technical and methodology questions.',
      'End every presentation with a concrete Next Steps roadmap containing owners and deadlines.'
    ]
  }
];
