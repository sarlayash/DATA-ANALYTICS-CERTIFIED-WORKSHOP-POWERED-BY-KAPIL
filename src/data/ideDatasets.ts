import { IDESampleSnippet } from '../types';

export interface IDETableSchema {
  tableName: string;
  description: string;
  columns: string[];
  data: Record<string, any>[];
}

export const IDE_PRELOADED_TABLES: IDETableSchema[] = [
  {
    tableName: 'orders',
    description: 'E-commerce transactions log with customer and status details',
    columns: ['order_id', 'customer_id', 'customer_name', 'amount', 'item_quantity', 'tier', 'status', 'order_date'],
    data: [
      { order_id: 101, customer_id: 1, customer_name: 'Priya Sharma', amount: 150.0, item_quantity: 2, tier: 'Platinum', status: 'COMPLETED', order_date: '2024-01-10' },
      { order_id: 102, customer_id: 1, customer_name: 'Priya Sharma', amount: 200.0, item_quantity: 3, tier: 'Platinum', status: 'COMPLETED', order_date: '2024-01-25' },
      { order_id: 103, customer_id: 2, customer_name: 'Rahul Verma', amount: 80.0, item_quantity: 1, tier: 'Silver', status: 'COMPLETED', order_date: '2024-01-15' },
      { order_id: 104, customer_id: 3, customer_name: 'Aditi Rao', amount: 450.0, item_quantity: 5, tier: 'Gold', status: 'COMPLETED', order_date: '2024-02-01' },
      { order_id: 105, customer_id: 2, customer_name: 'Rahul Verma', amount: 50.0, item_quantity: 1, tier: 'Silver', status: 'CANCELLED', order_date: '2024-02-05' },
      { order_id: 106, customer_id: 4, customer_name: 'Vikram Mehta', amount: 320.0, item_quantity: 4, tier: 'Gold', status: 'COMPLETED', order_date: '2024-02-14' }
    ]
  },
  {
    tableName: 'customers',
    description: 'Registered customer profiles and loyalty tiers',
    columns: ['customer_id', 'name', 'email', 'signup_date', 'loyalty_tier', 'lifetime_spend'],
    data: [
      { customer_id: 1, name: 'Priya Sharma', email: 'priya@techcorp.io', signup_date: '2023-05-12', loyalty_tier: 'Platinum', lifetime_spend: 350.0 },
      { customer_id: 2, name: 'Rahul Verma', email: 'rahul.v@analytics.com', signup_date: '2023-08-20', loyalty_tier: 'Silver', lifetime_spend: 80.0 },
      { customer_id: 3, name: 'Aditi Rao', email: 'aditi.rao@growth.co', signup_date: '2023-11-04', loyalty_tier: 'Gold', lifetime_spend: 450.0 },
      { customer_id: 4, name: 'Vikram Mehta', email: 'vikram.m@finance.org', signup_date: '2024-01-02', loyalty_tier: 'Gold', lifetime_spend: 320.0 },
      { customer_id: 5, name: 'Ananya Gupta', email: 'ananya.g@startup.io', signup_date: '2024-01-20', loyalty_tier: 'Silver', lifetime_spend: 0.0 }
    ]
  },
  {
    tableName: 'funnel_stages',
    description: 'E-commerce conversion funnel progression steps',
    columns: ['stage_order', 'stage_name', 'user_count', 'conversion_rate_pct'],
    data: [
      { stage_order: 1, stage_name: 'Landing / Product Page', user_count: 50000, conversion_rate_pct: 100.0 },
      { stage_order: 2, stage_name: 'Add to Cart', user_count: 12500, conversion_rate_pct: 25.0 },
      { stage_order: 3, stage_name: 'Initiate Checkout', user_count: 6250, conversion_rate_pct: 12.5 },
      { stage_order: 4, stage_name: 'Order Confirmation', user_count: 2500, conversion_rate_pct: 5.0 }
    ]
  },
  {
    tableName: 'employees',
    description: 'Company staff directory with departments and salary tiers',
    columns: ['emp_id', 'name', 'department', 'salary', 'tenure_years'],
    data: [
      { emp_id: 1, name: 'Neha Gupta', department: 'Engineering', salary: 140000, tenure_years: 4 },
      { emp_id: 2, name: 'Siddharth Nair', department: 'Engineering', salary: 140000, tenure_years: 3 },
      { emp_id: 3, name: 'Karan Malhotra', department: 'Engineering', salary: 120000, tenure_years: 2 },
      { emp_id: 4, name: 'Rohan Joshi', department: 'Sales', salary: 110000, tenure_years: 5 },
      { emp_id: 5, name: 'Deepa Iyer', department: 'Sales', salary: 95000, tenure_years: 2 },
      { emp_id: 6, name: 'Simran Kaur', department: 'Product', salary: 135000, tenure_years: 3 }
    ]
  }
];

export const DAY_SAMPLE_SNIPPETS: Record<number, IDESampleSnippet[]> = {
  1: [
    {
      id: 'snip-1-1',
      title: 'Analyze Funnel Drop-off in SQL',
      language: 'sql',
      code: `-- Funnel Conversion Analysis
SELECT 
  stage_name,
  user_count,
  ROUND(user_count * 100.0 / 50000, 1) AS pct_of_top_funnel
FROM funnel_stages
ORDER BY stage_order;`
    },
    {
      id: 'snip-1-2',
      title: 'Calculate Average Order Value (AOV)',
      language: 'sql',
      code: `-- Average Order Value (AOV) by Tier
SELECT 
  tier,
  COUNT(order_id) AS orders_count,
  ROUND(AVG(amount), 2) AS average_order_value,
  ROUND(SUM(amount), 2) AS total_revenue
FROM orders
WHERE status = 'COMPLETED'
GROUP BY tier
ORDER BY total_revenue DESC;`
    },
    {
      id: 'snip-1-3',
      title: 'Check Metric Ratios in Python',
      language: 'python',
      code: `# Calculate LTV to CAC Ratio
cac = 45.0
arpu = 35.0
monthly_churn = 0.04
ltv = arpu / monthly_churn
ratio = ltv / cac

print(f"Calculated LTV: \${ltv:.2f}")
print(f"Calculated CAC: \${cac:.2f}")
print(f"LTV to CAC Ratio: {ratio:.2f}x")
print("Target Benchmark: >3.0x (Healthy Growth)")`
    }
  ],
  2: [
    {
      id: 'snip-2-1',
      title: 'WHERE vs. HAVING Filter Test',
      language: 'sql',
      code: `-- Filter completed orders, aggregate, then filter groups with HAVING
SELECT 
  customer_name,
  COUNT(order_id) AS total_orders,
  SUM(amount) AS total_spent
FROM orders
WHERE status = 'COMPLETED'
GROUP BY customer_name
HAVING COUNT(order_id) > 1;`
    },
    {
      id: 'snip-2-2',
      title: 'LEFT JOIN Customers & Orders Reconciliation',
      language: 'sql',
      code: `-- Reconcile customers with orders including non-purchasers
SELECT 
  c.name,
  c.loyalty_tier,
  COUNT(o.order_id) AS orders_count,
  COALESCE(SUM(o.amount), 0) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.status = 'COMPLETED'
GROUP BY c.customer_id, c.name, c.loyalty_tier
ORDER BY total_spent DESC;`
    }
  ],
  3: [
    {
      id: 'snip-3-1',
      title: 'Rank Salaries by Department',
      language: 'sql',
      code: `-- Rank departmental compensation using DENSE_RANK
SELECT 
  name,
  department,
  salary,
  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank
FROM employees;`
    },
    {
      id: 'snip-3-2',
      title: 'Cumulative Running Revenue Total',
      language: 'sql',
      code: `-- Running total across chronologically sorted completed orders
SELECT 
  order_id,
  order_date,
  amount,
  SUM(amount) OVER (ORDER BY order_date, order_id) AS cumulative_revenue
FROM orders
WHERE status = 'COMPLETED';`
    }
  ],
  4: [
    {
      id: 'snip-4-1',
      title: 'Audit Missing & Flag Duplicates',
      language: 'sql',
      code: `-- Identify duplicate or inactive customer profiles
SELECT 
  c.name,
  c.email,
  COUNT(o.order_id) AS order_count,
  CASE WHEN COUNT(o.order_id) = 0 THEN 'DORMANT' ELSE 'ACTIVE' END AS customer_status
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name, c.email;`
    },
    {
      id: 'snip-4-2',
      title: 'Outlier Detection Logic in Python',
      language: 'python',
      code: `# Detect outliers using Interquartile Range (IQR)
data = [150, 200, 80, 450, 50, 320, 2400] # 2400 is an anomaly
data_sorted = sorted(data)
q1 = data_sorted[int(len(data_sorted) * 0.25)]
q3 = data_sorted[int(len(data_sorted) * 0.75)]
iqr = q3 - q1
upper_bound = q3 + 1.5 * iqr

print(f"Q1: {q1}, Q3: {q3}, IQR: {iqr}")
print(f"Anomaly threshold: > {upper_bound}")
outliers = [x for x in data if x > upper_bound]
print(f"Detected Outliers: {outliers}")`
    }
  ],
  5: [
    {
      id: 'snip-5-1',
      title: 'NumPy Vectorized Price Calculator',
      language: 'python',
      code: `# Vectorized pricing simulation with NumPy idioms
catalog_prices = [45.0, 120.0, 85.0, 250.0, 15.0]
# 15% discount for items > $50
discounted = [p * 0.85 if p > 50 else p for p in catalog_prices]
savings = [orig - disc for orig, disc in zip(catalog_prices, discounted)]

print("Original Prices:", catalog_prices)
print("Discounted Prices:", [round(x, 2) for x in discounted])
print("Total Customer Savings: \${:.2f}".format(sum(savings)))`
    }
  ],
  6: [
    {
      id: 'snip-6-1',
      title: 'Pandas GroupBy & Aggregation Pipeline',
      language: 'python',
      code: `# Group customer transactions and calculate customer lifetime stats
orders = [
    {"cust": "Priya", "amt": 150, "items": 2},
    {"cust": "Priya", "amt": 200, "items": 3},
    {"cust": "Rahul", "amt": 80, "items": 1},
    {"cust": "Aditi", "amt": 450, "items": 5}
]

from collections import defaultdict
grouped = defaultdict(lambda: {"total": 0, "orders": 0, "items": 0})
for o in orders:
    grouped[o["cust"]]["total"] += o["amt"]
    grouped[o["cust"]]["orders"] += 1
    grouped[o["cust"]]["items"] += o["items"]

print("--- CUSTOMER SEGMENT REPORT ---")
for cust, stats in grouped.items():
    aov = stats["total"] / stats["orders"]
    print(f"Customer: {cust.ljust(8)} | Orders: {stats['orders']} | Total: \${stats['total']} | AOV: \${aov:.2f}")`
    }
  ],
  7: [
    {
      id: 'snip-7-1',
      title: 'A/B Test Statistical Significance (Z/T-Test)',
      language: 'python',
      code: `# A/B Test Two-Proportion Significance Evaluation
control_conversions = 120
control_visitors = 1000
test_conversions = 165
test_visitors = 1000

cr_control = control_conversions / control_visitors
cr_test = test_conversions / test_visitors
lift = (cr_test - cr_control) / cr_control * 100

import math
pooled_p = (control_conversions + test_conversions) / (control_visitors + test_visitors)
se = math.sqrt(pooled_p * (1 - pooled_p) * (1/control_visitors + 1/test_visitors))
z_score = (cr_test - cr_control) / se

print(f"Control Conversion Rate: {cr_control * 100:.1f}%")
print(f"Test Conversion Rate:    {cr_test * 100:.1f}%")
print(f"Observed Relative Lift:  +{lift:.2f}%")
print(f"Computed Z-Score:        {z_score:.3f}")
print("Statistical Verdict:     " + ("Statistically Significant (p < 0.05)" if z_score > 1.96 else "Not Significant"))`
    }
  ],
  8: [
    {
      id: 'snip-8-1',
      title: 'ASCII Executive Dashboard Visualizer',
      language: 'python',
      code: `# Terminal Bar Chart Generator for Quick Data Storytelling
categories = [
    ("Enterprise Cloud", 42.5),
    ("Dev Tools", 28.1),
    ("Consulting", 14.8),
    ("Training", 9.2)
]

max_val = max(v for _, v in categories)
print("=== EXECUTIVE REVENUE BREAKDOWN ($M) ===")
for cat, val in categories:
    bar_length = int((val / max_val) * 30)
    bar = "█" * bar_length
    print(f"{cat.ljust(18)} | {bar} \${val:.1f}M")`
    }
  ],
  9: [
    {
      id: 'snip-9-1',
      title: 'DAX Simulation: Cumulative Sales Measure',
      language: 'sql',
      code: `-- Simulate DAX CALCULATE with running totals
SELECT 
  strftime('%Y-%m', order_date) AS sales_month,
  COUNT(order_id) AS monthly_orders,
  SUM(amount) AS monthly_revenue,
  SUM(SUM(amount)) OVER (ORDER BY strftime('%Y-%m', order_date)) AS ytd_cumulative_revenue
FROM orders
WHERE status = 'COMPLETED'
GROUP BY strftime('%Y-%m', order_date);`
    }
  ],
  10: [
    {
      id: 'snip-10-1',
      title: 'RFM Customer Scoring Engine',
      language: 'python',
      code: `# Recency, Frequency, Monetary (RFM) Segmentation Engine
customers = [
    {"name": "Priya", "recency_days": 5, "orders": 2, "spend": 350},
    {"name": "Rahul", "recency_days": 18, "orders": 1, "spend": 80},
    {"name": "Aditi", "recency_days": 2, "orders": 1, "spend": 450}
]

print("=== RFM SEGMENTATION ENGINE ===")
for c in customers:
    r_score = 3 if c["recency_days"] < 7 else (2 if c["recency_days"] < 30 else 1)
    f_score = 3 if c["orders"] >= 3 else (2 if c["orders"] >= 2 else 1)
    m_score = 3 if c["spend"] >= 300 else (2 if c["spend"] >= 100 else 1)
    rfm_composite = f"{r_score}{f_score}{m_score}"
    
    tier = "VIP Champion" if r_score == 3 and m_score == 3 else "Growing Loyalist"
    print(f"{c['name'].ljust(8)} | Score: {rfm_composite} | Tier: {tier} | Spend: \${c['spend']}")`
    }
  ],
  11: [
    {
      id: 'snip-11-1',
      title: 'Bash Commands for Data Profiling',
      language: 'bash',
      code: `# Quick CLI Profiling Commands
echo "=== SYSTEM FILE INSPECTION ==="
pwd
echo "--- Directory Structure ---"
ls -la
echo "--- Word & Line Count ---"
wc -l README.md 2>/dev/null || echo "Count: 42 lines detected"
echo "--- Data Pipeline Status Check ---"
echo "Status: CI/CD Pipeline Build Green ✅"`
    }
  ],
  12: [
    {
      id: 'snip-12-1',
      title: 'Capstone ROI & Payback Defense Calculator',
      language: 'python',
      code: `# Capstone Defense: Commercial ROI and Break-Even Model
annual_retention_lift = 1200000.0  # $1.2M protected ARR
implementation_cost = 85000.0     # $85k engineering cost
net_benefit = annual_retention_lift - implementation_cost
roi_pct = (net_benefit / implementation_cost) * 100
payback_months = (implementation_cost / annual_retention_lift) * 12

print("=== C-SUITE CAPSTONE DEFENSE MODEL ===")
print(f"Annual ARR Protected: \${annual_retention_lift:,.2f}")
print(f"Implementation Cost:  \${implementation_cost:,.2f}")
print(f"Net Economic Gain:    \${net_benefit:,.2f}")
print(f"Return on Investment: {roi_pct:.1f}%")
print(f"Payback Timeline:     {payback_months:.1f} months (Quick Win)")`
    }
  ]
};
