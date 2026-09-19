import { SolvedExample } from '../types';

export const SOLVED_EXAMPLES_DAYS_1_TO_6: SolvedExample[] = [
  // DAY 1
  {
    id: 'ex-1-1',
    day: 1,
    exampleNumber: 1,
    title: 'E-Commerce Funnel Drop-off Diagnostic',
    difficulty: 'Beginner',
    businessContext: 'An online retailer wants to diagnose where users drop off between product page visits and order completions.',
    problemStatement: 'Calculate stage-by-stage drop-off percentages and overall conversion rate from raw traffic session counts.',
    inputDatasetSchema: {
      tableName: 'funnel_stages',
      columns: ['stage_name', 'user_count', 'stage_order'],
      sampleRows: [
        { stage_name: 'Product Page Visit', user_count: 50000, stage_order: 1 },
        { stage_name: 'Add to Cart', user_count: 12500, stage_order: 2 },
        { stage_name: 'Initiate Checkout', user_count: 6250, stage_order: 3 },
        { stage_name: 'Payment Completed', user_count: 2500, stage_order: 4 }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  stage_name,
  user_count,
  ROUND((user_count * 100.0) / (SELECT user_count FROM funnel_stages WHERE stage_order = 1), 2) AS pct_of_top_funnel,
  ROUND((1.0 - (user_count * 1.0 / NULLIF(LAG(user_count) OVER (ORDER BY stage_order), 0))) * 100, 2) AS stage_dropoff_pct
FROM funnel_stages
ORDER BY stage_order;`,
    stepByStepExplanation: [
      '1. Select the current funnel stage and count of users who reached it.',
      '2. Compute overall funnel conversion against Stage 1 using a scalar subquery.',
      '3. Use LAG() to fetch the preceding stage count and calculate step-by-step drop-off percentage.'
    ],
    expectedOutputPreview: {
      columns: ['stage_name', 'user_count', 'pct_of_top_funnel', 'stage_dropoff_pct'],
      rows: [
        ['Product Page Visit', 50000, 100.0, 'NULL'],
        ['Add to Cart', 12500, 25.0, 75.0],
        ['Initiate Checkout', 6250, 12.5, 50.0],
        ['Payment Completed', 2500, 5.0, 60.0]
      ],
      summaryText: 'Top-of-funnel conversion is 5.0%. The highest drop-off occurs between product visit and add to cart (75% drop).'
    },
    interviewRelevance: 'Common product analytics interview question testing funnel decomposition and LAG window functions.'
  },
  {
    id: 'ex-1-2',
    day: 1,
    exampleNumber: 2,
    title: 'Average Order Value (AOV) & Basket Size by Tier',
    difficulty: 'Beginner',
    businessContext: 'Marketing wants to know if loyalty tier members generate higher basket value.',
    problemStatement: 'Calculate Average Order Value (AOV) and average items per order grouped by customer membership tier.',
    inputDatasetSchema: {
      tableName: 'orders',
      columns: ['order_id', 'tier', 'order_amount', 'item_quantity'],
      sampleRows: [
        { order_id: 101, tier: 'Platinum', order_amount: 180.50, item_quantity: 4 },
        { order_id: 102, tier: 'Silver', order_amount: 45.00, item_quantity: 1 },
        { order_id: 103, tier: 'Gold', order_amount: 110.20, item_quantity: 3 },
        { order_id: 104, tier: 'Platinum', order_amount: 220.00, item_quantity: 5 },
        { order_id: 105, tier: 'Silver', order_amount: 35.00, item_quantity: 1 }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  tier,
  COUNT(order_id) AS total_orders,
  ROUND(AVG(order_amount), 2) AS average_order_value,
  ROUND(AVG(item_quantity), 1) AS avg_items_per_order,
  ROUND(SUM(order_amount), 2) AS total_revenue
FROM orders
GROUP BY tier
ORDER BY average_order_value DESC;`,
    stepByStepExplanation: [
      '1. Group orders by customer loyalty tier.',
      '2. Calculate average monetary amount per order using AVG(order_amount).',
      '3. Calculate average basket volume and total gross revenue for commercial context.'
    ],
    expectedOutputPreview: {
      columns: ['tier', 'total_orders', 'average_order_value', 'avg_items_per_order', 'total_revenue'],
      rows: [
        ['Platinum', 2, 200.25, 4.5, 400.50],
        ['Gold', 1, 110.20, 3.0, 110.20],
        ['Silver', 2, 40.00, 1.0, 80.00]
      ]
    },
    interviewRelevance: 'Core retail & e-commerce metric modeling; tests understanding of AOV calculation and grouping.'
  },
  {
    id: 'ex-1-3',
    day: 1,
    exampleNumber: 3,
    title: 'Leading vs. Lagging Churn Indicator Analysis',
    difficulty: 'Intermediate',
    businessContext: 'Determine if user inactivity (days since last login) correlates with subscription cancellation.',
    problemStatement: 'Segment users by inactivity buckets and compute the cancellation rate for each bucket.',
    inputDatasetSchema: {
      tableName: 'user_activity',
      columns: ['user_id', 'days_since_last_login', 'is_cancelled'],
      sampleRows: [
        { user_id: 1, days_since_last_login: 3, is_cancelled: 0 },
        { user_id: 2, days_since_last_login: 42, is_cancelled: 1 },
        { user_id: 3, days_since_last_login: 15, is_cancelled: 0 },
        { user_id: 4, days_since_last_login: 65, is_cancelled: 1 },
        { user_id: 5, days_since_last_login: 8, is_cancelled: 0 }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  CASE 
    WHEN days_since_last_login <= 7 THEN '01. Active (0-7d)'
    WHEN days_since_last_login <= 30 THEN '02. At Risk (8-30d)'
    ELSE '03. Dormant (30d+)'
  END AS activity_bucket,
  COUNT(user_id) AS total_users,
  SUM(is_cancelled) AS cancelled_users,
  ROUND(AVG(is_cancelled) * 100.0, 1) AS churn_rate_pct
FROM user_activity
GROUP BY 1
ORDER BY 1;`,
    stepByStepExplanation: [
      '1. Create conditional case buckets to group continuous login recency into operational cohorts.',
      '2. Aggregate total users and count of churned subscriptions.',
      '3. Compute the churn rate percentage to validate the leading indicator hypothesis.'
    ],
    expectedOutputPreview: {
      columns: ['activity_bucket', 'total_users', 'cancelled_users', 'churn_rate_pct'],
      rows: [
        ['01. Active (0-7d)', 2, 0, 0.0],
        ['02. At Risk (8-30d)', 1, 0, 0.0],
        ['03. Dormant (30d+)', 2, 2, 100.0]
      ]
    },
    interviewRelevance: 'Demonstrates ability to construct leading indicators and translate continuous signals into business action.'
  },
  {
    id: 'ex-1-4',
    day: 1,
    exampleNumber: 4,
    title: 'Customer Lifetime Value (LTV) to CAC Ratio',
    difficulty: 'Intermediate',
    businessContext: 'Finance needs to verify marketing channel viability by computing LTV:CAC ratios.',
    problemStatement: 'Calculate LTV, CAC, and LTV/CAC ratio per acquisition channel with target 3:1 validation.',
    inputDatasetSchema: {
      tableName: 'acquisition_channels',
      columns: ['channel', 'total_spend', 'acquired_users', 'avg_annual_revenue', 'churn_rate'],
      sampleRows: [
        { channel: 'Paid Search', total_spend: 50000, acquired_users: 1000, avg_annual_revenue: 180, churn_rate: 0.20 },
        { channel: 'Organic SEO', total_spend: 15000, acquired_users: 1500, avg_annual_revenue: 160, churn_rate: 0.15 },
        { channel: 'Influencer', total_spend: 40000, acquired_users: 500, avg_annual_revenue: 120, churn_rate: 0.35 }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  channel,
  ROUND(total_spend * 1.0 / acquired_users, 2) AS cac,
  ROUND(avg_annual_revenue / churn_rate, 2) AS ltv,
  ROUND((avg_annual_revenue / churn_rate) / (total_spend * 1.0 / acquired_users), 2) AS ltv_to_cac_ratio,
  CASE 
    WHEN (avg_annual_revenue / churn_rate) / (total_spend * 1.0 / acquired_users) >= 3.0 THEN 'Healthy (Scale)'
    WHEN (avg_annual_revenue / churn_rate) / (total_spend * 1.0 / acquired_users) >= 1.0 THEN 'Marginal (Optimize)'
    ELSE 'Unprofitable (Cut)'
  END AS channel_verdict
FROM acquisition_channels;`,
    stepByStepExplanation: [
      '1. Compute Customer Acquisition Cost (CAC = Total Spend / Acquired Users).',
      '2. Compute Lifetime Value (LTV = Annual Revenue / Annual Churn Rate).',
      '3. Evaluate LTV:CAC against SaaS benchmark thresholds (>3.0 indicates healthy efficiency).'
    ],
    expectedOutputPreview: {
      columns: ['channel', 'cac', 'ltv', 'ltv_to_cac_ratio', 'channel_verdict'],
      rows: [
        ['Paid Search', 50.00, 900.00, 18.00, 'Healthy (Scale)'],
        ['Organic SEO', 10.00, 1066.67, 106.67, 'Healthy (Scale)'],
        ['Influencer', 80.00, 342.86, 4.29, 'Healthy (Scale)']
      ]
    },
    interviewRelevance: 'Classic venture capital and growth analyst evaluation metric.'
  },
  {
    id: 'ex-1-5',
    day: 1,
    exampleNumber: 5,
    title: 'Net Revenue Retention (NRR) Formula Model',
    difficulty: 'Advanced',
    businessContext: 'SaaS Board meeting requirement: compute cohort Net Revenue Retention.',
    problemStatement: 'Calculate NRR percentage given starting ARR, expansion, contraction, and churn ARR.',
    inputDatasetSchema: {
      tableName: 'saas_cohorts',
      columns: ['cohort_year', 'starting_arr', 'expansion_arr', 'contraction_arr', 'churn_arr'],
      sampleRows: [
        { cohort_year: '2023', starting_arr: 1000000, expansion_arr: 250000, contraction_arr: 40000, churn_arr: 60000 },
        { cohort_year: '2024', starting_arr: 1500000, expansion_arr: 180000, contraction_arr: 90000, churn_arr: 150000 }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  cohort_year,
  starting_arr,
  (starting_arr + expansion_arr - contraction_arr - churn_arr) AS ending_arr,
  ROUND(((starting_arr + expansion_arr - contraction_arr - churn_arr) * 100.0) / starting_arr, 2) AS nrr_pct,
  CASE 
    WHEN ((starting_arr + expansion_arr - contraction_arr - churn_arr) * 100.0) / starting_arr >= 110.0 THEN 'Best-in-Class'
    WHEN ((starting_arr + expansion_arr - contraction_arr - churn_arr) * 100.0) / starting_arr >= 100.0 THEN 'Solid Organic Growth'
    ELSE 'Net Revenue Leakage'
  END AS tier_classification
FROM saas_cohorts;`,
    stepByStepExplanation: [
      '1. Calculate Ending ARR by adding expansions and subtracting contractions/churn.',
      '2. Divide Ending ARR by Starting ARR to derive the NRR multiplier percentage.',
      '3. Classify cohort health against industry standards.'
    ],
    expectedOutputPreview: {
      columns: ['cohort_year', 'starting_arr', 'ending_arr', 'nrr_pct', 'tier_classification'],
      rows: [
        ['2023', 1000000, 1150000, 115.00, 'Best-in-Class'],
        ['2024', 1500000, 1440000, 96.00, 'Net Revenue Leakage']
      ]
    },
    interviewRelevance: 'The #1 SaaS business metric evaluated in financial & commercial analytics.'
  },

  // DAY 2: SQL FUNDAMENTALS
  {
    id: 'ex-2-1',
    day: 2,
    exampleNumber: 1,
    title: 'High-Value Customer Spending with HAVING',
    difficulty: 'Beginner',
    businessContext: 'Find all customers who placed more than 1 completed order and spent over $300 in total.',
    problemStatement: 'Filter orders by COMPLETED status, group by customer, and apply post-aggregation filters using HAVING.',
    inputDatasetSchema: {
      tableName: 'orders',
      columns: ['order_id', 'customer_name', 'amount', 'status'],
      sampleRows: [
        { order_id: 1, customer_name: 'Priya Sharma', amount: 150, status: 'COMPLETED' },
        { order_id: 2, customer_name: 'Priya Sharma', amount: 200, status: 'COMPLETED' },
        { order_id: 3, customer_name: 'Rahul Verma', amount: 80, status: 'COMPLETED' },
        { order_id: 4, customer_name: 'Aditi Rao', amount: 450, status: 'COMPLETED' },
        { order_id: 5, customer_name: 'Rahul Verma', amount: 50, status: 'CANCELLED' }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  customer_name,
  COUNT(order_id) AS total_completed_orders,
  SUM(amount) AS total_spend,
  ROUND(AVG(amount), 2) AS avg_order_value
FROM orders
WHERE status = 'COMPLETED'
GROUP BY customer_name
HAVING COUNT(order_id) > 1 AND SUM(amount) > 300
ORDER BY total_spend DESC;`,
    stepByStepExplanation: [
      '1. Filter out cancelled transactions early in the WHERE clause.',
      '2. Aggregate by customer name to compute order counts and monetary sum.',
      '3. Use HAVING to filter groups meeting both the order volume and monetary thresholds.'
    ],
    expectedOutputPreview: {
      columns: ['customer_name', 'total_completed_orders', 'total_spend', 'avg_order_value'],
      rows: [
        ['Priya Sharma', 2, 350, 175.00]
      ]
    },
    interviewRelevance: 'Tests clear distinction between WHERE (pre-filter) and HAVING (post-aggregation filter).'
  },
  {
    id: 'ex-2-2',
    day: 2,
    exampleNumber: 2,
    title: 'Customer Order Reconciliation with LEFT JOIN',
    difficulty: 'Beginner',
    businessContext: 'Marketing needs a list of all registered customers, including those who have never placed an order.',
    problemStatement: 'Join customers with orders using a LEFT JOIN, counting orders and handling NULL values with COALESCE.',
    inputDatasetSchema: {
      tableName: 'customers_and_orders',
      columns: ['customer_id', 'name', 'order_id', 'amount'],
      sampleRows: [
        { customer_id: 101, name: 'Alice', order_id: 1, amount: 120 },
        { customer_id: 101, name: 'Alice', order_id: 2, amount: 80 },
        { customer_id: 102, name: 'Bob', order_id: null, amount: null },
        { customer_id: 103, name: 'Charlie', order_id: 3, amount: 250 }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  c.customer_id,
  c.name,
  COUNT(o.order_id) AS order_count,
  COALESCE(SUM(o.amount), 0) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name
ORDER BY total_spent DESC;`,
    stepByStepExplanation: [
      '1. Perform a LEFT JOIN from customers to orders so non-purchasers are preserved.',
      '2. Use COUNT(o.order_id) instead of COUNT(*) so customers with no orders report 0 instead of 1.',
      '3. Wrap SUM(amount) in COALESCE to display 0 instead of NULL.'
    ],
    expectedOutputPreview: {
      columns: ['customer_id', 'name', 'order_count', 'total_spent'],
      rows: [
        [103, 'Charlie', 1, 250],
        [101, 'Alice', 2, 200],
        [102, 'Bob', 0, 0]
      ]
    },
    interviewRelevance: 'Tests COUNT(column) vs COUNT(*) and defensive null replacement in joins.'
  },
  {
    id: 'ex-2-3',
    day: 2,
    exampleNumber: 3,
    title: 'Detect Inactive Accounts (Anti-Join Pattern)',
    difficulty: 'Intermediate',
    businessContext: 'Identify accounts that registered more than 30 days ago but never placed any transactions.',
    problemStatement: 'Write an anti-join using LEFT JOIN ... WHERE right_table.id IS NULL.',
    inputDatasetSchema: {
      tableName: 'accounts',
      columns: ['account_id', 'email', 'created_days_ago'],
      sampleRows: [
        { account_id: 1, email: 'usr1@domain.com', created_days_ago: 45 },
        { account_id: 2, email: 'usr2@domain.com', created_days_ago: 10 },
        { account_id: 3, email: 'usr3@domain.com', created_days_ago: 60 }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  a.account_id,
  a.email,
  a.created_days_ago
FROM accounts a
LEFT JOIN orders o ON a.account_id = o.customer_id
WHERE o.order_id IS NULL AND a.created_days_ago > 30;`,
    stepByStepExplanation: [
      '1. Join accounts to orders on account/customer identifier.',
      '2. Filter where order_id IS NULL, isolating non-purchasing accounts.',
      '3. Apply business condition for account tenure > 30 days.'
    ],
    expectedOutputPreview: {
      columns: ['account_id', 'email', 'created_days_ago'],
      rows: [
        [1, 'usr1@domain.com', 45],
        [3, 'usr3@domain.com', 60]
      ]
    },
    interviewRelevance: 'Anti-join is an interview favorite to test knowledge beyond basic INNER joins.'
  },
  {
    id: 'ex-2-4',
    day: 2,
    exampleNumber: 4,
    title: 'Multi-Condition Filtering with CASE WHEN Aggregation',
    difficulty: 'Intermediate',
    businessContext: 'Pivot transaction statuses into separate summary columns in a single query.',
    problemStatement: 'Count completed, refunded, and pending orders per payment gateway using conditional aggregation.',
    inputDatasetSchema: {
      tableName: 'transactions',
      columns: ['gateway', 'status'],
      sampleRows: [
        { gateway: 'Stripe', status: 'COMPLETED' },
        { gateway: 'Stripe', status: 'REFUNDED' },
        { gateway: 'Stripe', status: 'COMPLETED' },
        { gateway: 'PayPal', status: 'PENDING' },
        { gateway: 'PayPal', status: 'COMPLETED' }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  gateway,
  COUNT(*) AS total_transactions,
  COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) AS completed_count,
  COUNT(CASE WHEN status = 'REFUNDED' THEN 1 END) AS refunded_count,
  COUNT(CASE WHEN status = 'PENDING' THEN 1 END) AS pending_count,
  ROUND(COUNT(CASE WHEN status = 'REFUNDED' THEN 1 END) * 100.0 / COUNT(*), 2) AS refund_rate_pct
FROM transactions
GROUP BY gateway;`,
    stepByStepExplanation: [
      '1. Group by payment gateway provider.',
      '2. Use COUNT(CASE WHEN ...) to count non-null matches conditionally.',
      '3. Calculate the gateway-specific refund percentage.'
    ],
    expectedOutputPreview: {
      columns: ['gateway', 'total_transactions', 'completed_count', 'refunded_count', 'pending_count', 'refund_rate_pct'],
      rows: [
        ['Stripe', 3, 2, 1, 0, 33.33],
        ['PayPal', 2, 1, 0, 1, 0.00]
      ]
    },
    interviewRelevance: 'Conditional aggregation is an essential SQL pattern used to pivot rows to columns.'
  },
  {
    id: 'ex-2-5',
    day: 2,
    exampleNumber: 5,
    title: 'Subquery in WHERE vs. JOIN Performance',
    difficulty: 'Intermediate',
    businessContext: 'Find products priced above the company-wide average product price.',
    problemStatement: 'Select product details filtering where price is greater than the scalar average price subquery.',
    inputDatasetSchema: {
      tableName: 'products',
      columns: ['product_id', 'product_name', 'category', 'price'],
      sampleRows: [
        { product_id: 1, product_name: 'Wireless Mouse', category: 'Accessories', price: 25.00 },
        { product_id: 2, product_name: 'Ergonomic Keyboard', category: 'Accessories', price: 85.00 },
        { product_id: 3, product_name: '27-inch Monitor', category: 'Displays', price: 320.00 },
        { product_id: 4, product_name: 'USB Cable', category: 'Accessories', price: 10.00 }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  product_id,
  product_name,
  category,
  price,
  ROUND((SELECT AVG(price) FROM products), 2) AS catalog_avg_price,
  ROUND(price - (SELECT AVG(price) FROM products), 2) AS premium_above_avg
FROM products
WHERE price > (SELECT AVG(price) FROM products)
ORDER BY price DESC;`,
    stepByStepExplanation: [
      '1. Evaluate scalar subquery (SELECT AVG(price) FROM products) once.',
      '2. Filter records where price exceeds this benchmark.',
      '3. Project delta difference in SELECT for stakeholder reporting.'
    ],
    expectedOutputPreview: {
      columns: ['product_id', 'product_name', 'category', 'price', 'catalog_avg_price', 'premium_above_avg'],
      rows: [
        [3, '27-inch Monitor', 'Displays', 320.00, 110.00, 210.00]
      ]
    },
    interviewRelevance: 'Tests scalar subqueries and understanding of dataset benchmark baselines.'
  },

  // DAY 3: ADVANCED SQL & DATA TRANSFORMATIONS
  {
    id: 'ex-3-1',
    day: 3,
    exampleNumber: 1,
    title: 'Top 2 Salaries per Department (DENSE_RANK Pattern)',
    difficulty: 'Intermediate',
    businessContext: 'HR compensation audit: find top 2 highest paid compensation packages per department.',
    problemStatement: 'Partition employees by department and rank by salary descending using DENSE_RANK inside a CTE.',
    inputDatasetSchema: {
      tableName: 'employees',
      columns: ['emp_id', 'name', 'department', 'salary'],
      sampleRows: [
        { emp_id: 1, name: 'Neha', department: 'Engineering', salary: 140000 },
        { emp_id: 2, name: 'Siddharth', department: 'Engineering', salary: 140000 },
        { emp_id: 3, name: 'Karan', department: 'Engineering', salary: 120000 },
        { emp_id: 4, name: 'Rohan', department: 'Sales', salary: 110000 },
        { emp_id: 5, name: 'Deepa', department: 'Sales', salary: 95000 }
      ]
    },
    language: 'sql',
    solutionCode: `WITH RankedCompensation AS (
  SELECT 
    emp_id,
    name,
    department,
    salary,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank_pos
  FROM employees
)
SELECT 
  emp_id,
  name,
  department,
  salary,
  rank_pos
FROM RankedCompensation
WHERE rank_pos <= 2
ORDER BY department, rank_pos, name;`,
    stepByStepExplanation: [
      '1. Define CTE with DENSE_RANK() partitioned by department and ordered by salary DESC.',
      '2. DENSE_RANK handles the tie between Neha and Siddharth without skipping rank 2.',
      '3. Filter outer query for rank_pos <= 2.'
    ],
    expectedOutputPreview: {
      columns: ['emp_id', 'name', 'department', 'salary', 'rank_pos'],
      rows: [
        [1, 'Neha', 'Engineering', 140000, 1],
        [2, 'Siddharth', 'Engineering', 140000, 1],
        [3, 'Karan', 'Engineering', 120000, 2],
        [4, 'Rohan', 'Sales', 110000, 1],
        [5, 'Deepa', 'Sales', 95000, 2]
      ]
    },
    interviewRelevance: 'One of the most universally asked SQL interview questions across FAANG and enterprise teams.'
  },
  {
    id: 'ex-3-2',
    day: 3,
    exampleNumber: 2,
    title: 'Running Total & 7-Day Moving Average',
    difficulty: 'Intermediate',
    businessContext: 'Finance needs cumulative year-to-date revenue and 3-day smoothed trend lines.',
    problemStatement: 'Calculate running total revenue and 3-day moving average using frame specifications.',
    inputDatasetSchema: {
      tableName: 'daily_revenue',
      columns: ['txn_date', 'revenue'],
      sampleRows: [
        { txn_date: '2024-01-01', revenue: 1000 },
        { txn_date: '2024-01-02', revenue: 1500 },
        { txn_date: '2024-01-03', revenue: 1200 },
        { txn_date: '2024-01-04', revenue: 1800 }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  txn_date,
  revenue,
  SUM(revenue) OVER (ORDER BY txn_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_revenue,
  ROUND(AVG(revenue) OVER (ORDER BY txn_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg_3day
FROM daily_revenue
ORDER BY txn_date;`,
    stepByStepExplanation: [
      '1. Order rows chronologically by date.',
      '2. Use ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW for cumulative sum.',
      '3. Use ROWS BETWEEN 2 PRECEDING AND CURRENT ROW to average the current row and 2 prior rows.'
    ],
    expectedOutputPreview: {
      columns: ['txn_date', 'revenue', 'cumulative_revenue', 'moving_avg_3day'],
      rows: [
        ['2024-01-01', 1000, 1000, 1000.00],
        ['2024-01-02', 1500, 2500, 1250.00],
        ['2024-01-03', 1200, 3700, 1233.33],
        ['2024-01-04', 1800, 5500, 1500.00]
      ]
    },
    interviewRelevance: 'Tests understanding of window frame bounds (ROWS BETWEEN).'
  },
  {
    id: 'ex-3-3',
    day: 3,
    exampleNumber: 3,
    title: 'Customer Repeat Purchase Gap with LEAD/LAG',
    difficulty: 'Intermediate',
    businessContext: 'Identify average days elapsed between consecutive orders placed by the same customer.',
    problemStatement: 'Use LAG() to fetch prior order date per customer and calculate day differences.',
    inputDatasetSchema: {
      tableName: 'customer_orders',
      columns: ['customer_id', 'order_id', 'order_date'],
      sampleRows: [
        { customer_id: 1, order_id: 101, order_date: '2024-01-10' },
        { customer_id: 1, order_id: 102, order_date: '2024-01-25' },
        { customer_id: 1, order_id: 103, order_date: '2024-02-15' },
        { customer_id: 2, order_id: 104, order_date: '2024-01-05' }
      ]
    },
    language: 'sql',
    solutionCode: `WITH OrderGaps AS (
  SELECT 
    customer_id,
    order_id,
    order_date,
    LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_order_date
  FROM customer_orders
)
SELECT 
  customer_id,
  order_id,
  order_date,
  prev_order_date,
  JULIANDAY(order_date) - JULIANDAY(prev_order_date) AS days_since_last_purchase
FROM OrderGaps
ORDER BY customer_id, order_date;`,
    stepByStepExplanation: [
      '1. Partition by customer_id and order by order_date.',
      '2. LAG() retrieves the preceding order date for each customer record.',
      '3. Compute day difference between current and previous date.'
    ],
    expectedOutputPreview: {
      columns: ['customer_id', 'order_id', 'order_date', 'prev_order_date', 'days_since_last_purchase'],
      rows: [
        [1, 101, '2024-01-10', 'NULL', 'NULL'],
        [1, 102, '2024-01-25', '2024-01-10', 15],
        [1, 103, '2024-02-15', '2024-01-25', 21],
        [2, 104, '2024-01-05', 'NULL', 'NULL']
      ]
    },
    interviewRelevance: 'Essential customer lifecycle pattern for computing repeat purchase velocity.'
  },
  {
    id: 'ex-3-4',
    day: 3,
    exampleNumber: 4,
    title: 'Detect Gaps and Consecutive Active Day Streaks',
    difficulty: 'Advanced',
    businessContext: 'Find consecutive day login streaks for product gamification rewards.',
    problemStatement: 'Calculate login streaks using the difference between login_date and row_number() over user partition.',
    inputDatasetSchema: {
      tableName: 'user_logins',
      columns: ['user_id', 'login_date'],
      sampleRows: [
        { user_id: 1, login_date: '2024-02-01' },
        { user_id: 1, login_date: '2024-02-02' },
        { user_id: 1, login_date: '2024-02-03' },
        { user_id: 1, login_date: '2024-02-06' }
      ]
    },
    language: 'sql',
    solutionCode: `WITH NumberedLogins AS (
  SELECT 
    user_id,
    login_date,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn
  FROM user_logins
),
GroupedStreaks AS (
  SELECT 
    user_id,
    login_date,
    DATE(login_date, '-' || rn || ' days') AS streak_group
  FROM NumberedLogins
)
SELECT 
  user_id,
  streak_group,
  MIN(login_date) AS streak_start,
  MAX(login_date) AS streak_end,
  COUNT(*) AS streak_length_days
FROM GroupedStreaks
GROUP BY user_id, streak_group
ORDER BY user_id, streak_start;`,
    stepByStepExplanation: [
      '1. Assign sequential row numbers to consecutive logins.',
      '2. Subtracting the row number from the date creates an invariant group key for consecutive days.',
      '3. Group by the key to find streak start, end, and duration.'
    ],
    expectedOutputPreview: {
      columns: ['user_id', 'streak_group', 'streak_start', 'streak_end', 'streak_length_days'],
      rows: [
        [1, '2024-01-31', '2024-02-01', '2024-02-03', 3],
        [1, '2024-02-02', '2024-02-06', '2024-02-06', 1]
      ]
    },
    interviewRelevance: 'The famous "Gaps and Islands" SQL interview problem testing advanced date-arithmetic reasoning.'
  },
  {
    id: 'ex-3-5',
    day: 3,
    exampleNumber: 5,
    title: 'First and Last Touch Attribution via CTEs',
    difficulty: 'Advanced',
    businessContext: 'Attribute multi-channel marketing spend to conversions using First Touch vs. Last Touch models.',
    problemStatement: 'Identify the first ad channel clicked and last ad channel clicked prior to purchase per customer.',
    inputDatasetSchema: {
      tableName: 'ad_clicks',
      columns: ['customer_id', 'channel', 'click_time'],
      sampleRows: [
        { customer_id: 101, channel: 'Organic Search', click_time: '2024-01-01 10:00:00' },
        { customer_id: 101, channel: 'Facebook Ads', click_time: '2024-01-05 14:00:00' },
        { customer_id: 101, channel: 'Email Newsletter', click_time: '2024-01-10 09:30:00' }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT DISTINCT
  customer_id,
  FIRST_VALUE(channel) OVER (PARTITION BY customer_id ORDER BY click_time ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS first_touch_channel,
  LAST_VALUE(channel) OVER (PARTITION BY customer_id ORDER BY click_time ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_touch_channel
FROM ad_clicks;`,
    stepByStepExplanation: [
      '1. Partition ad clicks by customer_id and order chronologically.',
      '2. FIRST_VALUE retrieves the initial touchpoint that created awareness.',
      '3. LAST_VALUE retrieves the final touchpoint that closed the conversion.',
      '4. Crucial: specify UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING so LAST_VALUE does not default to the current row!'
    ],
    expectedOutputPreview: {
      columns: ['customer_id', 'first_touch_channel', 'last_touch_channel'],
      rows: [
        [101, 'Organic Search', 'Email Newsletter']
      ]
    },
    interviewRelevance: 'Directly tests the common LAST_VALUE window frame trap in marketing attribution modeling.'
  },

  // DAY 4: DATA CLEANING & PREPROCESSING
  {
    id: 'ex-4-1',
    day: 4,
    exampleNumber: 1,
    title: 'Deduplicating Dirty Customer Records (Keep Most Recent)',
    difficulty: 'Intermediate',
    businessContext: 'Customer registry contains duplicate entries with conflicting emails and timestamps.',
    problemStatement: 'Deduplicate records by email, retaining only the most recently updated entry.',
    inputDatasetSchema: {
      tableName: 'raw_customers',
      columns: ['customer_id', 'email', 'phone', 'updated_at'],
      sampleRows: [
        { customer_id: 1, email: 'alex@work.com', phone: '111-222', updated_at: '2023-01-01' },
        { customer_id: 2, email: 'alex@work.com', phone: '333-444', updated_at: '2023-05-15' },
        { customer_id: 3, email: 'sarah@work.com', phone: '555-666', updated_at: '2023-02-10' }
      ]
    },
    language: 'sql',
    solutionCode: `WITH Deduplicated AS (
  SELECT 
    customer_id,
    email,
    phone,
    updated_at,
    ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(email)) ORDER BY updated_at DESC) as rn
  FROM raw_customers
)
SELECT 
  customer_id,
  email,
  phone,
  updated_at
FROM Deduplicated
WHERE rn = 1;`,
    stepByStepExplanation: [
      '1. Normalize email strings by trimming whitespace and converting to lowercase.',
      '2. Partition by normalized email and order by updated_at descending.',
      '3. Filter outer query where row number equals 1 to retain the freshest record.'
    ],
    expectedOutputPreview: {
      columns: ['customer_id', 'email', 'phone', 'updated_at'],
      rows: [
        [2, 'alex@work.com', '333-444', '2023-05-15'],
        [3, 'sarah@work.com', '555-666', '2023-02-10']
      ]
    },
    interviewRelevance: 'Production data engineering pattern for Master Data Management and deduplication.'
  },
  {
    id: 'ex-4-2',
    day: 4,
    exampleNumber: 2,
    title: 'Conditional Imputation by Department Median',
    difficulty: 'Intermediate',
    businessContext: 'Salary field has missing NULLs; replace NULLs with the median salary of the employee department.',
    problemStatement: 'Write SQL query imputing NULL salaries using windowed average/median per department.',
    inputDatasetSchema: {
      tableName: 'staff_salaries',
      columns: ['emp_id', 'dept', 'salary'],
      sampleRows: [
        { emp_id: 1, dept: 'Sales', salary: 80000 },
        { emp_id: 2, dept: 'Sales', salary: null },
        { emp_id: 3, dept: 'Sales', salary: 90000 },
        { emp_id: 4, dept: 'Tech', salary: 130000 },
        { emp_id: 5, dept: 'Tech', salary: null }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  emp_id,
  dept,
  salary AS raw_salary,
  COALESCE(salary, ROUND(AVG(salary) OVER (PARTITION BY dept), 0)) AS imputed_salary,
  CASE WHEN salary IS NULL THEN 1 ELSE 0 END AS was_imputed_flag
FROM staff_salaries;`,
    stepByStepExplanation: [
      '1. Compute the department average salary using window function partitioned by dept.',
      '2. Use COALESCE to fallback to the department average when salary is NULL.',
      '3. Create an audit flag column indicating whether the record was imputed.'
    ],
    expectedOutputPreview: {
      columns: ['emp_id', 'dept', 'raw_salary', 'imputed_salary', 'was_imputed_flag'],
      rows: [
        [1, 'Sales', 80000, 80000, 0],
        [2, 'Sales', 'NULL', 85000, 1],
        [3, 'Sales', 90000, 90000, 0],
        [4, 'Tech', 130000, 130000, 0],
        [5, 'Tech', 'NULL', 130000, 1]
      ]
    },
    interviewRelevance: 'Shows defensive data auditing practices: always flag imputed values for downstream consumers.'
  },
  {
    id: 'ex-4-3',
    day: 4,
    exampleNumber: 3,
    title: 'Statistical Outlier Flagging via IQR Bounds',
    difficulty: 'Advanced',
    businessContext: 'Flag anomalous transaction sizes that exceed 1.5 * IQR above the 75th percentile.',
    problemStatement: 'Compute Q1, Q3, IQR, and mark transaction outliers as suspicious.',
    inputDatasetSchema: {
      tableName: 'transactions_audit',
      columns: ['txn_id', 'amount'],
      sampleRows: [
        { txn_id: 101, amount: 20 },
        { txn_id: 102, amount: 25 },
        { txn_id: 103, amount: 30 },
        { txn_id: 104, amount: 35 },
        { txn_id: 105, amount: 400 }
      ]
    },
    language: 'python',
    solutionCode: `import pandas as pd
import numpy as np

data = {'txn_id': [101, 102, 103, 104, 105], 'amount': [20, 25, 30, 35, 400]}
df = pd.DataFrame(data)

q1 = df['amount'].quantile(0.25)
q3 = df['amount'].quantile(0.75)
iqr = q3 - q1
lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr

df['is_outlier'] = (df['amount'] < lower_bound) | (df['amount'] > upper_bound)
print(f"IQR: {iqr}, Bounds: [{lower_bound}, {upper_bound}]")
print(df)`,
    stepByStepExplanation: [
      '1. Compute 25th percentile (Q1) and 75th percentile (Q3).',
      '2. Calculate Interquartile Range (IQR = Q3 - Q1).',
      '3. Identify any transaction with amount > Upper Bound as an anomalous outlier.'
    ],
    expectedOutputPreview: {
      columns: ['txn_id', 'amount', 'is_outlier'],
      rows: [
        [101, 20, false],
        [102, 25, false],
        [103, 30, false],
        [104, 35, false],
        [105, 400, true]
      ],
      summaryText: 'Txn 105 ($400) flagged as an outlier (threshold: >50).'
    },
    interviewRelevance: 'Standard risk and fraud analytics interview question testing statistical bounds.'
  },
  {
    id: 'ex-4-4',
    day: 4,
    exampleNumber: 4,
    title: 'Parsing Raw Log Strings with Regex & Substrings',
    difficulty: 'Intermediate',
    businessContext: 'Extract IP address, HTTP status code, and endpoint path from unparsed Apache server logs.',
    problemStatement: 'Parse structured fields from raw web log strings.',
    inputDatasetSchema: {
      tableName: 'raw_logs',
      columns: ['log_id', 'raw_text'],
      sampleRows: [
        { log_id: 1, raw_text: '192.168.1.1 - GET /api/v1/checkout HTTP/1.1 200' },
        { log_id: 2, raw_text: '10.0.0.45 - POST /login HTTP/1.1 401' }
      ]
    },
    language: 'python',
    solutionCode: `import re
import pandas as pd

logs = [
    "192.168.1.1 - GET /api/v1/checkout HTTP/1.1 200",
    "10.0.0.45 - POST /login HTTP/1.1 401"
]

pattern = r'(?P<ip>\S+) - (?P<method>[A-Z]+) (?P<endpoint>\S+) HTTP/\d\.\d (?P<status>\d{3})'
parsed_rows = [re.search(pattern, line).groupdict() for line in logs]
df_logs = pd.DataFrame(parsed_rows)
print(df_logs)`,
    stepByStepExplanation: [
      '1. Write named capturing groups (?P<name>...) in a Python regular expression.',
      '2. Iterate through unparsed log lines, extracting dictionary mappings.',
      '3. Load parsed dictionaries directly into a clean DataFrame.'
    ],
    expectedOutputPreview: {
      columns: ['ip', 'method', 'endpoint', 'status'],
      rows: [
        ['192.168.1.1', 'GET', '/api/v1/checkout', '200'],
        ['10.0.0.45', 'POST', '/login', '401']
      ]
    },
    interviewRelevance: 'Tests text wrangling and regex extraction skills common in engineering data intake.'
  },
  {
    id: 'ex-4-5',
    day: 4,
    exampleNumber: 5,
    title: 'Type Coercion and Corrupted Timestamp Repair',
    difficulty: 'Intermediate',
    businessContext: 'Timestamp column has mixed formats (epoch milliseconds vs. ISO strings).',
    problemStatement: 'Standardize heterogeneous date strings into uniform YYYY-MM-DD UTC timestamps.',
    inputDatasetSchema: {
      tableName: 'mixed_timestamps',
      columns: ['event_id', 'raw_time'],
      sampleRows: [
        { event_id: 1, raw_time: '2024-03-01T14:30:00Z' },
        { event_id: 2, raw_time: '03/05/2024' },
        { event_id: 3, raw_time: '1709400000' }
      ]
    },
    language: 'python',
    solutionCode: `import pandas as pd

raw_times = ['2024-03-01T14:30:00Z', '03/05/2024', '1709400000']
cleaned = []
for val in raw_times:
    if val.isdigit() and len(val) >= 10:
        cleaned.append(pd.to_datetime(int(val), unit='s', utc=True))
    else:
        cleaned.append(pd.to_datetime(val, utc=True))

df_dates = pd.DataFrame({'raw': raw_times, 'normalized_utc': cleaned})
print(df_dates)`,
    stepByStepExplanation: [
      '1. Inspect string characteristics (digit check for Unix epoch vs. calendar string).',
      '2. Apply unit=\'s\' conversion for numeric timestamps.',
      '3. Enforce UTC timezone consistency across all normalized values.'
    ],
    expectedOutputPreview: {
      columns: ['raw', 'normalized_utc'],
      rows: [
        ['2024-03-01T14:30:00Z', '2024-03-01 14:30:00+00:00'],
        ['03/05/2024', '2024-03-05 00:00:00+00:00'],
        ['1709400000', '2024-03-02 17:20:00+00:00']
      ]
    },
    interviewRelevance: 'Date alignment bugs cause 80% of data pipeline silent failures; tests time hygiene.'
  },

  // DAY 5: PYTHON FOR DATA ANALYTICS: FOUNDATIONS
  {
    id: 'ex-5-1',
    day: 5,
    exampleNumber: 1,
    title: 'NumPy Vectorized Pricing & Discount Calculator',
    difficulty: 'Beginner',
    businessContext: 'Apply tiered commercial discounts to a catalog of 100,000 product SKUs without slow for-loops.',
    problemStatement: 'Use NumPy boolean indexing and vectorized math to apply 15% discount for products above $50.',
    inputDatasetSchema: {
      tableName: 'product_prices',
      columns: ['sku', 'price'],
      sampleRows: [
        { sku: 'A1', price: 20.0 },
        { sku: 'A2', price: 80.0 },
        { sku: 'A3', price: 120.0 },
        { sku: 'A4', price: 45.0 }
      ]
    },
    language: 'python',
    solutionCode: `import numpy as np

prices = np.array([20.0, 80.0, 120.0, 45.0])
# Vectorized condition: where price > 50, apply 15% discount, else keep original
discounted_prices = np.where(prices > 50.0, prices * 0.85, prices)
savings = prices - discounted_prices

print("Original:", prices)
print("Discounted:", discounted_prices)
print("Total Savings:", np.sum(savings))`,
    stepByStepExplanation: [
      '1. Represent numerical arrays in contiguous NumPy arrays.',
      '2. Apply np.where(condition, if_true, if_false) for vectorized branching.',
      '3. Compute element-wise savings and sum without explicit for-loops.'
    ],
    expectedOutputPreview: {
      columns: ['original_price', 'discounted_price', 'savings'],
      rows: [
        [20.0, 20.0, 0.0],
        [80.0, 68.0, 12.0],
        [120.0, 102.0, 18.0],
        [45.0, 45.0, 0.0]
      ],
      summaryText: 'Total Savings: $30.00. Executed in compiled C registers.'
    },
    interviewRelevance: 'Tests vectorization vs. inefficient Python iteration.'
  },
  {
    id: 'ex-5-2',
    day: 5,
    exampleNumber: 2,
    title: 'Top Customer Spending via Dictionary Hash Maps',
    difficulty: 'Beginner',
    businessContext: 'Aggregate raw transaction streams into customer spend totals in O(N) linear time.',
    problemStatement: 'Aggregate order amounts by customer using Python collections.defaultdict.',
    inputDatasetSchema: {
      tableName: 'raw_events',
      columns: ['cust_id', 'amount'],
      sampleRows: [
        { cust_id: 'C1', amount: 150 },
        { cust_id: 'C2', amount: 200 },
        { cust_id: 'C1', amount: 50 },
        { cust_id: 'C3', amount: 400 }
      ]
    },
    language: 'python',
    solutionCode: `from collections import defaultdict

transactions = [
    ('C1', 150), ('C2', 200), ('C1', 50), ('C3', 400)
]

spend_map = defaultdict(float)
for cust, amt in transactions:
    spend_map[cust] += amt

# Sort by spend descending
top_spenders = sorted(spend_map.items(), key=lambda x: x[1], reverse=True)
for cust, total in top_spenders:
    print(f"Customer {cust}: \${total:.2f}")`,
    stepByStepExplanation: [
      '1. Utilize defaultdict(float) to eliminate KeyError initialization checks.',
      '2. Process incoming transactions in single-pass O(N) complexity.',
      '3. Sort hash map items with a lambda key expression.'
    ],
    expectedOutputPreview: {
      columns: ['customer', 'total_spend'],
      rows: [
        ['C3', 400.00],
        ['C1', 200.00],
        ['C2', 200.00]
      ]
    },
    interviewRelevance: 'Tests algorithmic complexity (O(N) vs O(N^2)) and core Python data structures.'
  },
  {
    id: 'ex-5-3',
    day: 5,
    exampleNumber: 3,
    title: 'Matrix Operations & Correlation with NumPy',
    difficulty: 'Intermediate',
    businessContext: 'Compute pairwise Pearson correlation matrix between marketing spend and signups.',
    problemStatement: 'Calculate correlation coefficient using np.corrcoef.',
    inputDatasetSchema: {
      tableName: 'campaign_data',
      columns: ['ad_spend_k', 'signups'],
      sampleRows: [
        { ad_spend_k: 10, signups: 120 },
        { ad_spend_k: 20, signups: 240 },
        { ad_spend_k: 30, signups: 310 },
        { ad_spend_k: 40, signups: 490 }
      ]
    },
    language: 'python',
    solutionCode: `import numpy as np

ad_spend = np.array([10, 20, 30, 40])
signups = np.array([120, 240, 310, 490])

corr_matrix = np.corrcoef(ad_spend, signups)
r_value = corr_matrix[0, 1]

print("Correlation Matrix:\\n", np.round(corr_matrix, 4))
print(f"Pearson r: {r_value:.4f} (Strong positive correlation)")`,
    stepByStepExplanation: [
      '1. Formulate parallel feature vectors in NumPy arrays.',
      '2. Call np.corrcoef to generate the normalized covariance matrix.',
      '3. Extract the off-diagonal Pearson correlation coefficient.'
    ],
    expectedOutputPreview: {
      columns: ['metric_1', 'metric_2', 'pearson_r'],
      rows: [
        ['ad_spend', 'signups', 0.9934]
      ],
      summaryText: 'r = 0.9934 confirms direct linear elasticity between ad spend and signups.'
    },
    interviewRelevance: 'Core data science foundation for assessing linear feature relationships.'
  },
  {
    id: 'ex-5-4',
    day: 5,
    exampleNumber: 4,
    title: 'Data Pipeline Error Handling & Custom Exceptions',
    difficulty: 'Intermediate',
    businessContext: 'Ensure data ingestion gracefully flags corrupted currency strings without crashing the pipeline.',
    problemStatement: 'Write a robust conversion function with try-except blocks and logging.',
    inputDatasetSchema: {
      tableName: 'raw_currency',
      columns: ['row_id', 'currency_str'],
      sampleRows: [
        { row_id: 1, currency_str: '$1,250.50' },
        { row_id: 2, currency_str: 'N/A' },
        { row_id: 3, currency_str: '$45.00' }
      ]
    },
    language: 'python',
    solutionCode: `def clean_currency(val: str) -> float:
    try:
        clean_str = val.replace('$', '').replace(',', '').strip()
        return float(clean_str)
    except (ValueError, AttributeError):
        # Graceful fallback for dirty or non-numeric tokens
        return 0.0

raw_inputs = ["$1,250.50", "N/A", "$45.00", None]
cleaned_numbers = [clean_currency(x) for x in raw_inputs]
print("Parsed Floats:", cleaned_numbers)`,
    stepByStepExplanation: [
      '1. Strip out dollar signs, commas, and whitespace.',
      '2. Attempt type conversion to float.',
      '3. Catch ValueError and AttributeError to safely return a fallback rather than crashing.'
    ],
    expectedOutputPreview: {
      columns: ['raw_string', 'cleaned_float'],
      rows: [
        ['$1,250.50', 1250.5],
        ['N/A', 0.0],
        ['$45.00', 45.0]
      ]
    },
    interviewRelevance: 'Separates production-ready coders from classroom programmers.'
  },
  {
    id: 'ex-5-5',
    day: 5,
    exampleNumber: 5,
    title: 'Functional Programming with Map, Filter, and Lambdas',
    difficulty: 'Intermediate',
    businessContext: 'Filter and transform transaction records using functional Python idioms.',
    problemStatement: 'Filter transactions above $100 and apply a 5% processing fee using map and filter.',
    inputDatasetSchema: {
      tableName: 'orders_list',
      columns: ['amount'],
      sampleRows: [
        { amount: 50 },
        { amount: 120 },
        { amount: 300 },
        { amount: 80 }
      ]
    },
    language: 'python',
    solutionCode: `amounts = [50, 120, 300, 80]

# Filter amounts > 100, then map 5% fee addition
filtered = filter(lambda x: x > 100, amounts)
with_fee = list(map(lambda x: round(x * 1.05, 2), filtered))

print("Transformed Amounts:", with_fee)`,
    stepByStepExplanation: [
      '1. Use filter() with lambda predicate to keep values > 100.',
      '2. Use map() to apply math transformation without modifying original list.',
      '3. Materialize results into a clean Python list.'
    ],
    expectedOutputPreview: {
      columns: ['original_amount', 'after_fee_amount'],
      rows: [
        [120, 126.00],
        [300, 315.00]
      ]
    },
    interviewRelevance: 'Demonstrates functional programming paradigms and clean lambda syntax.'
  },

  // DAY 6: DATA WRANGLING WITH PANDAS
  {
    id: 'ex-6-1',
    day: 6,
    exampleNumber: 1,
    title: 'Multi-Metric GroupBy Rollup & Sort',
    difficulty: 'Beginner',
    businessContext: 'Regional operations report: calculate total revenue, average order size, and unique customer count.',
    problemStatement: 'Use Pandas groupby with .agg() and named tuples to compute regional KPIs.',
    inputDatasetSchema: {
      tableName: 'sales_df',
      columns: ['region', 'customer_id', 'revenue'],
      sampleRows: [
        { region: 'North', customer_id: 'U1', revenue: 500 },
        { region: 'North', customer_id: 'U2', revenue: 300 },
        { region: 'South', customer_id: 'U3', revenue: 700 },
        { region: 'North', customer_id: 'U1', revenue: 200 }
      ]
    },
    language: 'python',
    solutionCode: `import pandas as pd

df = pd.DataFrame({
    'region': ['North', 'North', 'South', 'North'],
    'customer_id': ['U1', 'U2', 'U3', 'U1'],
    'revenue': [500, 300, 700, 200]
})

summary = df.groupby('region').agg(
    total_sales=('revenue', 'sum'),
    avg_order=('revenue', 'mean'),
    unique_customers=('customer_id', 'nunique')
).reset_index().sort_values('total_sales', ascending=False)

print(summary)`,
    stepByStepExplanation: [
      '1. Group DataFrame by the regional categorical dimension.',
      '2. Use named aggregation syntax: new_col=(existing_col, aggfunc).',
      '3. Reset index and sort by total sales descending.'
    ],
    expectedOutputPreview: {
      columns: ['region', 'total_sales', 'avg_order', 'unique_customers'],
      rows: [
        ['North', 1000, 333.33, 2],
        ['South', 700, 700.00, 1]
      ]
    },
    interviewRelevance: 'The single most common Pandas workflow required on the job and in technical screens.'
  },
  {
    id: 'ex-6-2',
    day: 6,
    exampleNumber: 2,
    title: 'Pandas Merge and Outer Join Reconciliation',
    difficulty: 'Intermediate',
    businessContext: 'Reconcile CRM registered leads against actual billing payments to identify non-converting leads.',
    problemStatement: 'Merge leads and payments using an outer join with indicator=True.',
    inputDatasetSchema: {
      tableName: 'leads_and_payments',
      columns: ['lead_id', 'lead_name', 'payment_id', 'amount'],
      sampleRows: [
        { lead_id: 1, lead_name: 'Alpha Corp', payment_id: 101, amount: 2500 },
        { lead_id: 2, lead_name: 'Beta LLC', payment_id: null, amount: null }
      ]
    },
    language: 'python',
    solutionCode: `import pandas as pd

leads = pd.DataFrame({'id': [1, 2, 3], 'company': ['Alpha', 'Beta', 'Gamma']})
payments = pd.DataFrame({'lead_id': [1, 3], 'paid_amt': [2500, 4800]})

reconciled = pd.merge(leads, payments, left_on='id', right_on='lead_id', how='outer', indicator=True)
print(reconciled[['company', 'paid_amt', '_merge']])`,
    stepByStepExplanation: [
      '1. Execute pd.merge with how=\'outer\'.',
      '2. Set indicator=True to automatically generate a \'_merge\' audit column.',
      '3. Identify records present in left_only (unpaid leads) vs. both (paid customers).'
    ],
    expectedOutputPreview: {
      columns: ['company', 'paid_amt', '_merge'],
      rows: [
        ['Alpha', 2500.0, 'both'],
        ['Beta', 'NaN', 'left_only'],
        ['Gamma', 4800.0, 'both']
      ]
    },
    interviewRelevance: 'Auditing data merges using indicator=True demonstrates senior-level data integrity habits.'
  },
  {
    id: 'ex-6-3',
    day: 6,
    exampleNumber: 3,
    title: 'Reshaping Data: Pivot Tables and Melting',
    difficulty: 'Intermediate',
    businessContext: 'Convert normalized long-format monthly financial logs into an executive wide-format cross-tab.',
    problemStatement: 'Use pivot_table to summarize quarterly revenue by business unit.',
    inputDatasetSchema: {
      tableName: 'quarterly_logs',
      columns: ['quarter', 'unit', 'revenue'],
      sampleRows: [
        { quarter: 'Q1', unit: 'Cloud', revenue: 120 },
        { quarter: 'Q1', unit: 'Hardware', revenue: 80 },
        { quarter: 'Q2', unit: 'Cloud', revenue: 150 },
        { quarter: 'Q2', unit: 'Hardware', revenue: 75 }
      ]
    },
    language: 'python',
    solutionCode: `import pandas as pd

df = pd.DataFrame({
    'quarter': ['Q1', 'Q1', 'Q2', 'Q2'],
    'unit': ['Cloud', 'Hardware', 'Cloud', 'Hardware'],
    'revenue': [120, 80, 150, 75]
})

pivoted = df.pivot_table(index='unit', columns='quarter', values='revenue', aggfunc='sum', fill_value=0)
pivoted['Total'] = pivoted.sum(axis=1)
print(pivoted)`,
    stepByStepExplanation: [
      '1. Specify row index as \'unit\' and column headers as \'quarter\'.',
      '2. Aggregate values using sum with fill_value=0.',
      '3. Compute row-wise total margins across quarters.'
    ],
    expectedOutputPreview: {
      columns: ['unit', 'Q1', 'Q2', 'Total'],
      rows: [
        ['Cloud', 120, 150, 270],
        ['Hardware', 80, 75, 155]
      ]
    },
    interviewRelevance: 'Tests mastery of reshaping operations (pivot vs. melt) for executive reporting.'
  },
  {
    id: 'ex-6-4',
    day: 6,
    exampleNumber: 4,
    title: 'Time Series Resampling & Rolling Calculations',
    difficulty: 'Advanced',
    businessContext: 'Compute a 7-day rolling average on daily active user counts to smooth out weekend seasonality.',
    problemStatement: 'Convert date column to DatetimeIndex, sort, and calculate a 7-day rolling window mean.',
    inputDatasetSchema: {
      tableName: 'daily_dau',
      columns: ['date', 'active_users'],
      sampleRows: [
        { date: '2024-01-01', active_users: 12000 },
        { date: '2024-01-02', active_users: 13500 },
        { date: '2024-01-03', active_users: 14000 }
      ]
    },
    language: 'python',
    solutionCode: `import pandas as pd

dates = pd.date_range(start='2024-01-01', periods=5, freq='D')
users = [10000, 12000, 11000, 15000, 14000]
df = pd.DataFrame({'date': dates, 'active_users': users}).set_index('date')

df['rolling_3d_mean'] = df['active_users'].rolling(window=3, min_periods=1).mean()
print(df)`,
    stepByStepExplanation: [
      '1. Set a clean DatetimeIndex on the DataFrame.',
      '2. Call .rolling(window=3, min_periods=1) to prevent initial NaN values.',
      '3. Calculate the moving average to eliminate seasonal noise.'
    ],
    expectedOutputPreview: {
      columns: ['date', 'active_users', 'rolling_3d_mean'],
      rows: [
        ['2024-01-01', 10000, 10000.00],
        ['2024-01-02', 12000, 11000.00],
        ['2024-01-03', 11000, 11000.00],
        ['2024-01-04', 15000, 1266.67],
        ['2024-01-05', 14000, 13333.33]
      ]
    },
    interviewRelevance: 'Critical for time-series trend analysis and metrics reporting.'
  },
  {
    id: 'ex-6-5',
    day: 6,
    exampleNumber: 5,
    title: 'High-Performance String Operations with Vectorized .str',
    difficulty: 'Intermediate',
    businessContext: 'Extract clean domain names and company titles from unstandardized customer email addresses.',
    problemStatement: 'Extract domain names using df[\'email\'].str.split().',
    inputDatasetSchema: {
      tableName: 'contacts',
      columns: ['contact_id', 'email'],
      sampleRows: [
        { contact_id: 1, email: 'john.doe@acme-corp.com' },
        { contact_id: 2, email: 'jane.smith@global-bank.org' }
      ]
    },
    language: 'python',
    solutionCode: `import pandas as pd

df = pd.DataFrame({
    'contact_id': [1, 2],
    'email': ['john.doe@acme-corp.com', 'jane.smith@global-bank.org']
})

df['domain'] = df['email'].str.split('@').str[1]
df['company'] = df['domain'].str.split('.').str[0].str.replace('-', ' ').str.title()
print(df[['email', 'company']])`,
    stepByStepExplanation: [
      '1. Use df.str.split(\'@\').str[1] to isolate the domain substring.',
      '2. Strip out top-level domain extensions (.com, .org).',
      '3. Format company names with title casing cleanly in a vectorized chain.'
    ],
    expectedOutputPreview: {
      columns: ['email', 'company'],
      rows: [
        ['john.doe@acme-corp.com', 'Acme Corp'],
        ['jane.smith@global-bank.org', 'Global Bank']
      ]
    },
    interviewRelevance: 'Demonstrates fast vectorized string cleaning in Pandas without Python loops.'
  }
];
