import { SolvedExample } from '../types';

export const SOLVED_EXAMPLES_DAYS_7_TO_12: SolvedExample[] = [
  // DAY 7: EDA & STATISTICAL THINKING
  {
    id: 'ex-7-1',
    day: 7,
    exampleNumber: 1,
    title: 'A/B Testing Two-Sample T-Test for Conversion Rates',
    difficulty: 'Intermediate',
    businessContext: 'Evaluate whether a newly designed checkout flow variant generated statistically significant revenue lift.',
    problemStatement: 'Perform a two-sample t-test on variant A vs variant B order values and interpret p-value.',
    inputDatasetSchema: {
      tableName: 'ab_test_orders',
      columns: ['variant', 'order_value'],
      sampleRows: [
        { variant: 'Control (A)', order_value: 45.0 },
        { variant: 'Control (A)', order_value: 52.0 },
        { variant: 'Treatment (B)', order_value: 58.0 },
        { variant: 'Treatment (B)', order_value: 64.0 }
      ]
    },
    language: 'python',
    solutionCode: `from scipy import stats
import numpy as np

# Sample transaction arrays for control (A) and treatment (B)
group_a = np.array([45.0, 52.0, 48.5, 50.2, 47.8, 53.1, 49.0])
group_b = np.array([58.0, 64.0, 59.5, 62.0, 61.2, 57.5, 63.8])

t_stat, p_val = stats.ttest_ind(group_a, group_b)
print(f"Mean A: \${group_a.mean():.2f}, Mean B: \${group_b.mean():.2f}")
print(f"T-statistic: {t_stat:.4f}, P-value: {p_val:.5f}")
if p_val < 0.05:
    print("Result: Statistically significant lift (Reject H0). Proceed to launch.")
else:
    print("Result: Inconclusive; difference could be random noise.")`,
    stepByStepExplanation: [
      '1. Define baseline hypothesis: H0 = no difference between group means.',
      '2. Run two-sample independent Student\'s t-test via scipy.stats.',
      '3. Compare p-value against alpha threshold of 0.05 to reach a commercial launch decision.'
    ],
    expectedOutputPreview: {
      columns: ['group', 'mean_order_value', 'p_value', 'statistically_significant'],
      rows: [
        ['Control (A)', 49.37, 0.00001, true],
        ['Treatment (B)', 60.86, 0.00001, true]
      ],
      summaryText: 'Treatment group showed +23.3% lift with p < 0.001. Launch approved.'
    },
    interviewRelevance: 'The gold standard statistical question asked in experimentation & product analytics interviews.'
  },
  {
    id: 'ex-7-2',
    day: 7,
    exampleNumber: 2,
    title: 'Correlation Matrix & Multicollinearity Detection',
    difficulty: 'Intermediate',
    businessContext: 'Identify redundant correlated features before building regression or forecasting models.',
    problemStatement: 'Compute Pearson correlation matrix and isolate feature pairs with correlation r > 0.80.',
    inputDatasetSchema: {
      tableName: 'feature_metrics',
      columns: ['session_duration', 'pages_viewed', 'cart_items', 'checkout_time'],
      sampleRows: [
        { session_duration: 300, pages_viewed: 12, cart_items: 3, checkout_time: 45 },
        { session_duration: 120, pages_viewed: 4, cart_items: 1, checkout_time: 20 }
      ]
    },
    language: 'python',
    solutionCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'session_duration': [300, 120, 450, 200, 500],
    'pages_viewed': [12, 4, 16, 7, 19],
    'cart_items': [3, 1, 4, 2, 5],
    'discount_pct': [0.1, 0.0, 0.2, 0.05, 0.15]
})

corr = df.corr()
# Find pairs with r > 0.85
high_corr = []
for i in range(len(corr.columns)):
    for j in range(i+1, len(corr.columns)):
        col1, col2 = corr.columns[i], corr.columns[j]
        val = corr.iloc[i, j]
        if abs(val) > 0.85:
            high_corr.append((col1, col2, round(val, 3)))

print("Highly Correlated Pairs:", high_corr)`,
    stepByStepExplanation: [
      '1. Calculate the continuous Pearson correlation matrix across numerical dimensions.',
      '2. Inspect off-diagonal elements in upper triangle to avoid duplicate pairs.',
      '3. Flag feature collinearity for dimensionality reduction.'
    ],
    expectedOutputPreview: {
      columns: ['feature_a', 'feature_b', 'correlation_r'],
      rows: [
        ['session_duration', 'pages_viewed', 0.985],
        ['pages_viewed', 'cart_items', 0.942]
      ]
    },
    interviewRelevance: 'Critical for predictive modeling interviews to prevent multicollinearity distortion.'
  },
  {
    id: 'ex-7-3',
    day: 7,
    exampleNumber: 3,
    title: 'Detecting Skewness & Log Transformation for Normalization',
    difficulty: 'Intermediate',
    businessContext: 'Customer spend is heavily right-skewed with a long tail; normalize for parametric modeling.',
    problemStatement: 'Calculate skewness before and after applying np.log1p.',
    inputDatasetSchema: {
      tableName: 'spend_dist',
      columns: ['spend'],
      sampleRows: [
        { spend: 10 },
        { spend: 15 },
        { spend: 25 },
        { spend: 50 },
        { spend: 1200 }
      ]
    },
    language: 'python',
    solutionCode: `import numpy as np
import pandas as pd
from scipy.stats import skew

spends = np.array([10, 15, 20, 25, 30, 45, 60, 1200])
raw_skew = skew(spends)

log_spends = np.log1p(spends)
norm_skew = skew(log_spends)

print(f"Raw Skewness: {raw_skew:.3f} (Severely right-skewed)")
print(f"Log1p Skewness: {norm_skew:.3f} (Near-normal distribution)")`,
    stepByStepExplanation: [
      '1. Calculate Fisher-Pearson coefficient of skewness on raw distribution.',
      '2. Apply np.log1p (log(1 + x)) to handle zeros and compress long right tails.',
      '3. Compare post-transformation skewness to confirm normal bell-curve approximation.'
    ],
    expectedOutputPreview: {
      columns: ['metric', 'skew_coefficient', 'distribution_shape'],
      rows: [
        ['Raw Spend', 2.541, 'Heavily Right-Skewed (Outlier Driven)'],
        ['Log1p Spend', 0.412, 'Moderately Symmetrical (Near-Normal)']
      ]
    },
    interviewRelevance: 'Tests statistical feature engineering and understanding of mathematical transformations.'
  },
  {
    id: 'ex-7-4',
    day: 7,
    exampleNumber: 4,
    title: 'Z-Score Standardization Across Diverse Metrics',
    difficulty: 'Beginner',
    businessContext: 'Compare employee performance across different departments with varying measurement scales.',
    problemStatement: 'Calculate normalized Z-scores: (X - mean) / std.',
    inputDatasetSchema: {
      tableName: 'dept_metrics',
      columns: ['emp_id', 'tickets_resolved', 'call_minutes'],
      sampleRows: [
        { emp_id: 'E1', tickets_resolved: 45, call_minutes: 320 },
        { emp_id: 'E2', tickets_resolved: 90, call_minutes: 180 },
        { emp_id: 'E3', tickets_resolved: 30, call_minutes: 500 }
      ]
    },
    language: 'python',
    solutionCode: `import pandas as pd

df = pd.DataFrame({
    'emp_id': ['E1', 'E2', 'E3'],
    'tickets': [45, 90, 30],
    'calls': [320, 180, 500]
})

df['z_tickets'] = (df['tickets'] - df['tickets'].mean()) / df['tickets'].std()
df['z_calls'] = (df['calls'] - df['calls'].mean()) / df['calls'].std()
df['composite_score'] = (df['z_tickets'] + df['z_calls']) / 2
print(df.round(2))`,
    stepByStepExplanation: [
      '1. Compute mean and standard deviation per metric column.',
      '2. Standardize into dimensionless Z-scores (mean = 0, std = 1).',
      '3. Average Z-scores into a composite performance index.'
    ],
    expectedOutputPreview: {
      columns: ['emp_id', 'z_tickets', 'z_calls', 'composite_score'],
      rows: [
        ['E1', -0.32, -0.09, -0.21],
        ['E2', 1.14, -0.96, 0.09],
        ['E3', -0.82, 1.05, 0.12]
      ]
    },
    interviewRelevance: 'Demonstrates foundational normalization principles for index construction.'
  },
  {
    id: 'ex-7-5',
    day: 7,
    exampleNumber: 5,
    title: 'Chi-Square Test of Independence for Marketing Conversion',
    difficulty: 'Advanced',
    businessContext: 'Test whether email subject line variant (A, B, C) is independent of email click-through rate.',
    problemStatement: 'Construct a contingency table and run scipy.stats.chi2_contingency.',
    inputDatasetSchema: {
      tableName: 'email_campaign',
      columns: ['variant', 'clicked', 'not_clicked'],
      sampleRows: [
        { variant: 'Urgent', clicked: 120, not_clicked: 880 },
        { variant: 'Casual', clicked: 160, not_clicked: 840 },
        { variant: 'Discount', clicked: 210, not_clicked: 790 }
      ]
    },
    language: 'python',
    solutionCode: `from scipy.stats import chi2_contingency
import numpy as np

# Contingency table: [[clicked, not_clicked], ...]
contingency = np.array([
    [120, 880],  # Urgent: 12% CTR
    [160, 840],  # Casual: 16% CTR
    [210, 790]   # Discount: 21% CTR
])

chi2, p_val, dof, expected = chi2_contingency(contingency)
print(f"Chi-square Statistic: {chi2:.4f}")
print(f"P-value: {p_val:.6f}")
if p_val < 0.05:
    print("Conclusion: Significant relationship between subject line and CTR.")`,
    stepByStepExplanation: [
      '1. Structure observed frequencies in a 2D contingency matrix.',
      '2. Execute Pearson\'s chi-square test of independence.',
      '3. Confirm whether variations in CTR are statistically non-random.'
    ],
    expectedOutputPreview: {
      columns: ['test', 'chi2_statistic', 'p_value', 'conclusion'],
      rows: [
        ['Chi-Square Test', 29.84, 0.000001, 'Reject H0 (Strongly Dependent)']
      ]
    },
    interviewRelevance: 'Common question for analyzing categorical A/B/n multivariate testing.'
  },

  // DAY 8: DATA VISUALIZATION & STORYTELLING
  {
    id: 'ex-8-1',
    day: 8,
    exampleNumber: 1,
    title: 'Publication-Quality Executive Bar Chart with Seaborn',
    difficulty: 'Beginner',
    businessContext: 'Build an executive slide chart highlighting top 5 product categories by revenue with direct data labels.',
    problemStatement: 'Generate a horizontal bar chart with custom color highlighting for the top category.',
    inputDatasetSchema: {
      tableName: 'cat_revenue',
      columns: ['category', 'revenue_m'],
      sampleRows: [
        { category: 'Enterprise Cloud', revenue_m: 42.5 },
        { category: 'Developer Tools', revenue_m: 28.1 },
        { category: 'Consulting', revenue_m: 14.8 }
      ]
    },
    language: 'python',
    solutionCode: `import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

df = pd.DataFrame({
    'category': ['Enterprise Cloud', 'Dev Tools', 'Consulting', 'Training'],
    'revenue_m': [42.5, 28.1, 14.8, 9.2]
})

fig, ax = plt.subplots(figsize=(8, 4))
# Use dark indigo for top driver, subtle slate for others (intentional pre-attentive focus)
colors = ['#4f46e5', '#94a3b8', '#94a3b8', '#94a3b8']
sns.barplot(data=df, x='revenue_m', y='category', palette=colors, ax=ax)

# Add direct data labels
for p in ax.patches:
    ax.annotate(f"\${p.get_width():.1f}M", (p.get_width() + 0.8, p.get_y() + p.get_height() / 2),
                ha='left', va='center', weight='bold')

ax.set_title("Enterprise Cloud Generates 45% of Overall Revenue ($M)", weight='bold', fontsize=12)
ax.set_xlim(0, 50)
sns.despine(left=True, bottom=True)
plt.tight_layout()`,
    stepByStepExplanation: [
      '1. Order categories descending by revenue.',
      '2. Apply intentional pre-attentive color accent to the top performer.',
      '3. Annotate direct data labels on bars and write an action-oriented chart headline.'
    ],
    expectedOutputPreview: {
      columns: ['category', 'revenue_m', 'share_pct'],
      rows: [
        ['Enterprise Cloud', 42.5, '45.0%'],
        ['Dev Tools', 28.1, '29.7%'],
        ['Consulting', 14.8, '15.6%'],
        ['Training', 9.2, '9.7%']
      ]
    },
    interviewRelevance: 'Tests Edward Tufte Data-Ink ratio principles and executive presentation aesthetics.'
  },
  {
    id: 'ex-8-2',
    day: 8,
    exampleNumber: 2,
    title: 'Cohort Retention Heatmap Construction',
    difficulty: 'Advanced',
    businessContext: 'Visualize monthly cohort retention decay across 6 months in a standard enterprise heatmap.',
    problemStatement: 'Construct a normalized percentage matrix and render using sns.heatmap.',
    inputDatasetSchema: {
      tableName: 'cohort_matrix',
      columns: ['cohort', 'm0', 'm1', 'm2', 'm3'],
      sampleRows: [
        { cohort: '2024-01', m0: 100, m1: 42, m2: 35, m3: 31 },
        { cohort: '2024-02', m0: 100, m1: 45, m2: 38, m3: null }
      ]
    },
    language: 'python',
    solutionCode: `import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

retention_data = pd.DataFrame({
    'M0': [100, 100, 100],
    'M1': [42, 45, 48],
    'M2': [35, 38, None],
    'M3': [31, None, None]
}, index=['2024-01', '2024-02', '2024-03'])

fig, ax = plt.subplots(figsize=(7, 4))
sns.heatmap(retention_data, annot=True, fmt='.0f', cmap='Blues', vmin=0, vmax=100, cbar=False, ax=ax)
ax.set_title("Monthly Cohort Retention Curve (%)", weight='bold')
ax.set_ylabel("Acquisition Cohort")
plt.tight_layout()`,
    stepByStepExplanation: [
      '1. Normalize retention percentages relative to Month 0 (100%).',
      '2. Plot with Blues colormap and numeric annotations.',
      '3. Highlight whether recent cohorts retain at higher percentages than older ones.'
    ],
    expectedOutputPreview: {
      columns: ['cohort', 'M0', 'M1', 'M2', 'M3'],
      rows: [
        ['2024-01', 100, 42, 35, 31],
        ['2024-02', 100, 45, 38, '-'],
        ['2024-03', 100, 48, '-', '-']
      ]
    },
    interviewRelevance: 'Essential product analytics visualization tested in SaaS and consumer app interviews.'
  },
  {
    id: 'ex-8-3',
    day: 8,
    exampleNumber: 3,
    title: 'De-Cluttering & Increasing Data-Ink Ratio',
    difficulty: 'Intermediate',
    businessContext: 'Refactor a cluttered chart with 3D effects and heavy gridlines into a minimalist, accessible visual.',
    problemStatement: 'Remove extraneous chart junk and add contextual threshold benchmarks.',
    inputDatasetSchema: {
      tableName: 'sla_uptime',
      columns: ['month', 'uptime_pct'],
      sampleRows: [
        { month: 'Jan', uptime_pct: 99.85 },
        { month: 'Feb', uptime_pct: 99.92 },
        { month: 'Mar', uptime_pct: 99.70 }
      ]
    },
    language: 'python',
    solutionCode: `import matplotlib.pyplot as plt
import pandas as pd

df = pd.DataFrame({
    'month': ['Jan', 'Feb', 'Mar', 'Apr'],
    'uptime': [99.85, 99.92, 99.70, 99.95]
})

fig, ax = plt.subplots(figsize=(8, 3.5))
ax.plot(df['month'], df['uptime'], marker='o', color='#2563eb', linewidth=2.5)
ax.axhline(99.90, color='#ef4444', linestyle='--', label='SLA Target (99.90%)')

ax.set_title("System Availability vs. Contractual SLA", weight='bold', loc='left')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.legend(frameon=False)
plt.tight_layout()`,
    stepByStepExplanation: [
      '1. Draw a continuous line series with discrete markers.',
      '2. Overlay the horizontal SLA benchmark threshold in red dashed styling.',
      '3. Despine redundant borders and frame the visual with generous white space.'
    ],
    expectedOutputPreview: {
      columns: ['month', 'uptime_pct', 'sla_status'],
      rows: [
        ['Jan', 99.85, 'Breached (-0.05%)'],
        ['Feb', 99.92, 'Compliant (+0.02%)'],
        ['Mar', 99.70, 'Breached (-0.20%)'],
        ['Apr', 99.95, 'Compliant (+0.05%)']
      ]
    },
    interviewRelevance: 'Tests design judgment and operational SLA monitoring communication.'
  },
  {
    id: 'ex-8-4',
    day: 8,
    exampleNumber: 4,
    title: 'Dual-Axis vs. Normalized Indexing Comparison',
    difficulty: 'Intermediate',
    businessContext: 'Stakeholder requests a misleading dual-axis chart (Revenue $ vs Signups #); propose a normalized index.',
    problemStatement: 'Index both series to 100 at baseline period to accurately compare percentage growth trajectories.',
    inputDatasetSchema: {
      tableName: 'growth_series',
      columns: ['quarter', 'revenue', 'users'],
      sampleRows: [
        { quarter: 'Q1', revenue: 100000, users: 5000 },
        { quarter: 'Q2', revenue: 130000, users: 6000 }
      ]
    },
    language: 'python',
    solutionCode: `import pandas as pd

df = pd.DataFrame({
    'quarter': ['Q1', 'Q2', 'Q3', 'Q4'],
    'revenue': [100000, 130000, 150000, 190000],
    'users': [5000, 6000, 8500, 9500]
})

# Re-index to baseline period (Q1 = 100)
df['rev_indexed'] = (df['revenue'] / df['revenue'].iloc[0]) * 100
df['users_indexed'] = (df['users'] / df['users'].iloc[0]) * 100

print(df[['quarter', 'rev_indexed', 'users_indexed']])`,
    stepByStepExplanation: [
      '1. Divide each period by the baseline Q1 value.',
      '2. Multiply by 100 to create a normalized index.',
      '3. Compare relative trajectories on a single unified percentage axis without misleading dual-axis scaling.'
    ],
    expectedOutputPreview: {
      columns: ['quarter', 'revenue_index', 'users_index'],
      rows: [
        ['Q1', 100.0, 100.0],
        ['Q2', 130.0, 120.0],
        ['Q3', 150.0, 170.0],
        ['Q4', 190.0, 190.0]
      ]
    },
    interviewRelevance: 'Directly evaluates your ability to diplomatically push back against misleading visualization requests.'
  },
  {
    id: 'ex-8-5',
    day: 8,
    exampleNumber: 5,
    title: 'Distribution Comparison via Box Plots & Outliers',
    difficulty: 'Beginner',
    businessContext: 'Compare order delivery times across 3 logistics carrier partners to diagnose shipment variance.',
    problemStatement: 'Plot distribution median, interquartile spread, and extreme delays per carrier.',
    inputDatasetSchema: {
      tableName: 'shipping_times',
      columns: ['carrier', 'days_to_deliver'],
      sampleRows: [
        { carrier: 'FedEx', days_to_deliver: 2.1 },
        { carrier: 'UPS', days_to_deliver: 3.5 },
        { carrier: 'Postal', days_to_deliver: 6.2 }
      ]
    },
    language: 'python',
    solutionCode: `import pandas as pd

df = pd.DataFrame({
    'carrier': ['FedEx']*5 + ['UPS']*5 + ['Postal']*5,
    'days': [2, 2.5, 3, 2.2, 5.5,  3, 3.2, 3.5, 4, 8.0,  5, 6, 7, 6.5, 14.0]
})

summary = df.groupby('carrier')['days'].describe()
print(summary[['50%', 'mean', 'std', 'max']])`,
    stepByStepExplanation: [
      '1. Group shipment delivery duration by carrier partner.',
      '2. Compare median (50%) against mean to identify extreme delay outliers.',
      '3. Evaluate standard deviation to quantify delivery predictability.'
    ],
    expectedOutputPreview: {
      columns: ['carrier', 'median_days', 'mean_days', 'max_delay'],
      rows: [
        ['FedEx', 2.5, 3.04, 5.5],
        ['UPS', 3.5, 4.34, 8.0],
        ['Postal', 6.5, 7.70, 14.0]
      ]
    },
    interviewRelevance: 'Evaluates statistical distribution analysis in supply chain and logistics analytics.'
  },

  // DAY 9: ENTERPRISE BI & DASHBOARDS
  {
    id: 'ex-9-1',
    day: 9,
    exampleNumber: 1,
    title: 'DAX CALCULATE with Multiple Filter Contexts',
    difficulty: 'Intermediate',
    businessContext: 'Calculate YTD sales for a specific product category while ignoring store region slicers.',
    problemStatement: 'Write a DAX measure combining CALCULATE, USERELATIONSHIP, and ALL/REMOVEFILTERS.',
    inputDatasetSchema: {
      tableName: 'FactSales',
      columns: ['SalesAmount', 'CategoryID', 'Region'],
      sampleRows: [
        { SalesAmount: 1500, CategoryID: 1, Region: 'West' }
      ]
    },
    language: 'powerbi',
    solutionCode: `Total Enterprise Cloud Sales = 
CALCULATE(
    SUM(FactSales[SalesAmount]),
    DimProduct[Category] = "Enterprise Cloud",
    REMOVEFILTERS(DimGeography[Region])
)`,
    stepByStepExplanation: [
      '1. Start with SUM(FactSales[SalesAmount]) base aggregation.',
      '2. Filter Category to "Enterprise Cloud".',
      '3. Use REMOVEFILTERS on Geography to compute nationwide total regardless of dashboard slicer selection.'
    ],
    expectedOutputPreview: {
      columns: ['Measure Name', 'Context Behavior', 'Output Format'],
      rows: [
        ['Total Enterprise Cloud Sales', 'Overrides Region slicer filter', 'Currency ($)']
      ]
    },
    interviewRelevance: 'Core Power BI / DAX interview question testing filter context override mechanisms.'
  },
  {
    id: 'ex-9-2',
    day: 9,
    exampleNumber: 2,
    title: 'Star Schema Dimensional Relationship Design',
    difficulty: 'Beginner',
    businessContext: 'Model an e-commerce retail warehouse with orders, customers, dates, and products.',
    problemStatement: 'Structure fact and dimension tables with surrogate keys to enforce 1-to-many relationships.',
    inputDatasetSchema: {
      tableName: 'star_schema',
      columns: ['table_name', 'table_type', 'primary_key', 'foreign_keys'],
      sampleRows: [
        { table_name: 'FactSales', table_type: 'Fact', primary_key: 'SalesKey', foreign_keys: 'CustomerKey, DateKey, ProductKey' },
        { table_name: 'DimCustomer', table_type: 'Dimension', primary_key: 'CustomerKey', foreign_keys: 'None' }
      ]
    },
    language: 'sql',
    solutionCode: `CREATE TABLE DimCustomer (
  CustomerKey INT PRIMARY KEY,
  CustomerID VARCHAR(50),
  CustomerName VARCHAR(100),
  Segment VARCHAR(50)
);

CREATE TABLE FactSales (
  SalesKey INT PRIMARY KEY,
  DateKey INT,
  CustomerKey INT,
  Revenue DECIMAL(10,2),
  FOREIGN KEY (CustomerKey) REFERENCES DimCustomer(CustomerKey)
);`,
    stepByStepExplanation: [
      '1. Separate descriptive attributes into Dimension tables.',
      '2. Store numerical transactions and surrogate keys in Fact tables.',
      '3. Enforce 1-to-many directional filtering flowing from Dimensions to Facts.'
    ],
    expectedOutputPreview: {
      columns: ['schema_architecture', 'cardinality', 'query_efficiency'],
      rows: [
        ['Star Schema', '1-to-Many', 'Sub-second in VertiPaq RAM engine']
      ]
    },
    interviewRelevance: 'Tests data warehouse modeling fundamentals (Kimball methodology).'
  },
  {
    id: 'ex-9-3',
    day: 9,
    exampleNumber: 3,
    title: 'DAX Time Intelligence: Same Period Last Year YoY Growth',
    difficulty: 'Intermediate',
    businessContext: 'Calculate Year-over-Year revenue expansion comparing identical calendar periods.',
    problemStatement: 'Write DAX measure using SAMEPERIODLASTYEAR and DIVIDE with zero-division safety.',
    inputDatasetSchema: {
      tableName: 'TimeFact',
      columns: ['Date', 'Revenue'],
      sampleRows: [
        { Date: '2024-03-01', Revenue: 50000 },
        { Date: '2023-03-01', Revenue: 40000 }
      ]
    },
    language: 'powerbi',
    solutionCode: `YoY Revenue Lift % = 
VAR CurrentSales = SUM(FactSales[Revenue])
VAR PriorYearSales = 
    CALCULATE(
        SUM(FactSales[Revenue]),
        SAMEPERIODLASTYEAR(DimDate[Date])
    )
RETURN
    DIVIDE(CurrentSales - PriorYearSales, PriorYearSales, 0)`,
    stepByStepExplanation: [
      '1. Store current period sales in a DAX variable.',
      '2. Evaluate prior year equivalent via SAMEPERIODLASTYEAR shifted across DimDate.',
      '3. Compute percentage delta using DIVIDE(numerator, denominator, alternateResult).'
    ],
    expectedOutputPreview: {
      columns: ['CurrentSales', 'PriorYearSales', 'YoY_Growth_Pct'],
      rows: [
        [50000, 40000, '25.0%']
      ]
    },
    interviewRelevance: 'The single most demanded DAX measure across commercial enterprise reporting.'
  },
  {
    id: 'ex-9-4',
    day: 9,
    exampleNumber: 4,
    title: 'Context Transition with Iterating Function SUMX',
    difficulty: 'Advanced',
    businessContext: 'Calculate weighted average profit margin across items where margin percentage varies per line item.',
    problemStatement: 'Write a measure using SUMX to compute (Units * UnitPrice * ProfitMarginPct).',
    inputDatasetSchema: {
      tableName: 'FactSalesLines',
      columns: ['Units', 'UnitPrice', 'MarginPct'],
      sampleRows: [
        { Units: 10, UnitPrice: 50, MarginPct: 0.20 },
        { Units: 2, UnitPrice: 500, MarginPct: 0.40 }
      ]
    },
    language: 'powerbi',
    solutionCode: `Total Gross Profit = 
SUMX(
    FactSales,
    FactSales[Quantity] * FactSales[UnitPrice] * FactSales[MarginPercentage]
)`,
    stepByStepExplanation: [
      '1. SUMX creates an iterative row context over FactSales.',
      '2. Evaluates the multi-column line-item multiplication row-by-row.',
      '3. Sums individual line profits dynamically according to report filter context.'
    ],
    expectedOutputPreview: {
      columns: ['item_line', 'revenue', 'computed_profit'],
      rows: [
        ['Line 1', 500, 100],
        ['Line 2', 1000, 400]
      ],
      summaryText: 'Total Profit: $500 on $1,500 total revenue (33.3% weighted margin).'
    },
    interviewRelevance: 'Evaluates understanding of iterating DAX functions vs standard aggregation.'
  },
  {
    id: 'ex-9-5',
    day: 9,
    exampleNumber: 5,
    title: 'Dynamic Slicing with Disconnected Parameter Tables',
    difficulty: 'Advanced',
    businessContext: 'Allow executives to choose metric toggles (Revenue, Orders, Margin) dynamically without rewriting visuals.',
    problemStatement: 'Implement a SWITCH measure reading SELECTEDVALUE from a disconnected parameter table.',
    inputDatasetSchema: {
      tableName: 'ParameterTable',
      columns: ['MetricChoice', 'OrderIndex'],
      sampleRows: [
        { MetricChoice: 'Revenue', OrderIndex: 1 },
        { MetricChoice: 'Orders', OrderIndex: 2 }
      ]
    },
    language: 'powerbi',
    solutionCode: `Dynamic Selected Metric = 
VAR SelectedMetric = SELECTEDVALUE(DimMetricSelector[MetricName], "Revenue")
RETURN
    SWITCH(
        SelectedMetric,
        "Revenue", [Total Revenue],
        "Orders", [Total Order Count],
        "Profit", [Total Gross Profit],
        [Total Revenue]
    )`,
    stepByStepExplanation: [
      '1. Create a disconnected parameter dimension table with candidate metric names.',
      '2. Read the active slicer selection using SELECTEDVALUE.',
      '3. Use SWITCH to route the visual to the appropriate DAX measure dynamically.'
    ],
    expectedOutputPreview: {
      columns: ['Slicer Selection', 'Active Visual Value'],
      rows: [
        ['Revenue', '$1,250,000'],
        ['Orders', '8,420']
      ]
    },
    interviewRelevance: 'Demonstrates senior BI dashboard architecture and interactive UX design.'
  },

  // DAY 10: BUSINESS ANALYTICS & PRODUCT METRICS
  {
    id: 'ex-10-1',
    day: 10,
    exampleNumber: 1,
    title: 'RFM (Recency, Frequency, Monetary) Customer Segmentation',
    difficulty: 'Intermediate',
    businessContext: 'Segment 50,000 customers into Champions, Loyal Customers, At Risk, and Dormant cohorts.',
    problemStatement: 'Score Recency, Frequency, and Monetary metrics from 1 to 4 using quintiles/quartiles.',
    inputDatasetSchema: {
      tableName: 'customer_rfm',
      columns: ['cust_id', 'days_since_last_order', 'order_count', 'total_spend'],
      sampleRows: [
        { cust_id: 'C1', days_since_last_order: 5, order_count: 12, total_spend: 3500 },
        { cust_id: 'C2', days_since_last_order: 180, order_count: 1, total_spend: 45 },
        { cust_id: 'C3', days_since_last_order: 25, order_count: 6, total_spend: 1200 }
      ]
    },
    language: 'python',
    solutionCode: `import pandas as pd

df = pd.DataFrame({
    'cust_id': ['C1', 'C2', 'C3'],
    'recency': [5, 180, 25],
    'frequency': [12, 1, 6],
    'monetary': [3500, 45, 1200]
})

# Assign scores (1 to 3 for illustration; lower recency is better)
df['R_score'] = pd.qcut(df['recency'].rank(method='first'), q=3, labels=[3, 2, 1])
df['F_score'] = pd.qcut(df['frequency'].rank(method='first'), q=3, labels=[1, 2, 3])
df['M_score'] = pd.qcut(df['monetary'].rank(method='first'), q=3, labels=[1, 2, 3])

df['RFM_Segment'] = df['R_score'].astype(str) + df['F_score'].astype(str) + df['M_score'].astype(str)
print(df[['cust_id', 'RFM_Segment']])`,
    stepByStepExplanation: [
      '1. Calculate days since last order (R), order count (F), and total spend (M).',
      '2. Score using quartiles: R is inverted (low days = top score).',
      '3. Combine scores into 3-digit RFM codes to identify VIPs vs. Churn Risks.'
    ],
    expectedOutputPreview: {
      columns: ['cust_id', 'R_score', 'F_score', 'M_score', 'Segment_Label'],
      rows: [
        ['C1', 3, 3, 3, 'Champion (VIP)'],
        ['C3', 2, 2, 2, 'Potential Loyalist'],
        ['C2', 1, 1, 1, 'Lost / Hibernating']
      ]
    },
    interviewRelevance: 'Standard marketing analytics interview question testing customer segmentation.'
  },
  {
    id: 'ex-10-2',
    day: 10,
    exampleNumber: 2,
    title: 'CAC Payback Period in Months of Gross Margin',
    difficulty: 'Intermediate',
    businessContext: 'Determine how many months it takes for a newly acquired customer to pay back their acquisition cost.',
    problemStatement: 'Compute Payback Months = CAC / (Monthly ARPU * Gross Margin %).',
    inputDatasetSchema: {
      tableName: 'acquisition_economics',
      columns: ['channel', 'cac', 'monthly_arpu', 'gross_margin_pct'],
      sampleRows: [
        { channel: 'Google Ads', cac: 300, monthly_arpu: 50, gross_margin_pct: 0.80 },
        { channel: 'Events', cac: 1200, monthly_arpu: 120, gross_margin_pct: 0.75 }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  channel,
  cac,
  monthly_arpu,
  gross_margin_pct,
  ROUND(monthly_arpu * gross_margin_pct, 2) AS monthly_gross_profit,
  ROUND(cac / (monthly_arpu * gross_margin_pct), 1) AS payback_period_months,
  CASE 
    WHEN cac / (monthly_arpu * gross_margin_pct) <= 12.0 THEN 'Fast Payback (<1yr)'
    WHEN cac / (monthly_arpu * gross_margin_pct) <= 18.0 THEN 'Acceptable'
    ELSE 'High Working Capital Risk'
  END AS financial_health
FROM acquisition_economics;`,
    stepByStepExplanation: [
      '1. Compute monthly gross profit contribution per user.',
      '2. Divide Customer Acquisition Cost (CAC) by monthly gross profit.',
      '3. Benchmark against SaaS standard: payback <= 12 months is highly capital-efficient.'
    ],
    expectedOutputPreview: {
      columns: ['channel', 'cac', 'monthly_gross_profit', 'payback_period_months', 'financial_health'],
      rows: [
        ['Google Ads', 300, 40.00, 7.5, 'Fast Payback (<1yr)'],
        ['Events', 1200, 90.00, 13.3, 'Acceptable']
      ]
    },
    interviewRelevance: 'Critical for commercial finance, product strategy, and growth analytics.'
  },
  {
    id: 'ex-10-3',
    day: 10,
    exampleNumber: 3,
    title: 'Cohort Retention Triangular Grid Matrix in SQL',
    difficulty: 'Advanced',
    businessContext: 'Generate an executive cohort triangular matrix tracking user retention month by month.',
    problemStatement: 'Join cohort registration month with activity logs and compute retention rates.',
    inputDatasetSchema: {
      tableName: 'user_events',
      columns: ['user_id', 'cohort_month', 'activity_month'],
      sampleRows: [
        { user_id: 1, cohort_month: '2024-01', activity_month: '2024-01' },
        { user_id: 1, cohort_month: '2024-01', activity_month: '2024-02' },
        { user_id: 2, cohort_month: '2024-01', activity_month: '2024-01' }
      ]
    },
    language: 'sql',
    solutionCode: `WITH CohortSizes AS (
  SELECT cohort_month, COUNT(DISTINCT user_id) as initial_users
  FROM user_events
  GROUP BY cohort_month
),
ActivityBuckets AS (
  SELECT 
    e.cohort_month,
    -- Months elapsed between acquisition and activity
    (CAST(SUBSTR(e.activity_month, 6, 2) AS INT) - CAST(SUBSTR(e.cohort_month, 6, 2) AS INT)) AS month_number,
    COUNT(DISTINCT e.user_id) AS active_users
  FROM user_events e
  GROUP BY e.cohort_month, month_number
)
SELECT 
  a.cohort_month,
  c.initial_users,
  a.month_number,
  a.active_users,
  ROUND((a.active_users * 100.0) / c.initial_users, 1) AS retention_pct
FROM ActivityBuckets a
JOIN CohortSizes c ON a.cohort_month = c.cohort_month
ORDER BY a.cohort_month, a.month_number;`,
    stepByStepExplanation: [
      '1. Calculate cohort initial volume in CohortSizes CTE.',
      '2. Compute month offset (month_number = activity_month - cohort_month).',
      '3. Calculate percentage of active users remaining per month index.'
    ],
    expectedOutputPreview: {
      columns: ['cohort_month', 'initial_users', 'month_number', 'active_users', 'retention_pct'],
      rows: [
        ['2024-01', 2, 0, 2, 100.0],
        ['2024-01', 2, 1, 1, 50.0]
      ]
    },
    interviewRelevance: 'One of the most prestigious SQL problems in senior product analytics interviews.'
  },
  {
    id: 'ex-10-4',
    day: 10,
    exampleNumber: 4,
    title: 'Logo Churn vs. Net Revenue Churn Contrast',
    difficulty: 'Intermediate',
    businessContext: 'Illustrate how losing 10% of customers can result in positive net revenue growth.',
    problemStatement: 'Calculate Logo Churn Rate % alongside Net Revenue Expansion Rate % in SQL.',
    inputDatasetSchema: {
      tableName: 'client_renewals',
      columns: ['client_id', 'tier', 'initial_arr', 'renewal_arr', 'renewed'],
      sampleRows: [
        { client_id: 'SMB-1', tier: 'SMB', initial_arr: 1000, renewal_arr: 0, renewed: 0 },
        { client_id: 'SMB-2', tier: 'SMB', initial_arr: 1000, renewal_arr: 0, renewed: 0 },
        { client_id: 'ENT-1', tier: 'Enterprise', initial_arr: 50000, renewal_arr: 75000, renewed: 1 }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  COUNT(client_id) AS total_clients_start,
  SUM(CASE WHEN renewed = 0 THEN 1 ELSE 0 END) AS lost_logos,
  ROUND(SUM(CASE WHEN renewed = 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(client_id), 1) AS logo_churn_pct,
  SUM(initial_arr) AS starting_arr,
  SUM(renewal_arr) AS ending_arr,
  ROUND(((SUM(renewal_arr) - SUM(initial_arr)) * 100.0) / SUM(initial_arr), 1) AS net_arr_growth_pct
FROM client_renewals;`,
    stepByStepExplanation: [
      '1. Calculate lost customer account count (Logo Churn).',
      '2. Calculate starting ARR vs. ending ARR across the exact cohort.',
      '3. Contrast the 66.7% logo churn with the positive 44.2% net revenue expansion.'
    ],
    expectedOutputPreview: {
      columns: ['total_clients_start', 'lost_logos', 'logo_churn_pct', 'starting_arr', 'ending_arr', 'net_arr_growth_pct'],
      rows: [
        [3, 2, 66.7, 52000, 75000, 44.2]
      ],
      summaryText: 'Lost 2 out of 3 logos, but Enterprise expansion grew revenue by +44.2%!'
    },
    interviewRelevance: 'Distinguishes naive analysts from business-literate enterprise advisors.'
  },
  {
    id: 'ex-10-5',
    day: 10,
    exampleNumber: 5,
    title: 'Customer Conversion Funnel Leakage & Bottlenecks',
    difficulty: 'Intermediate',
    businessContext: 'Identify which specific checkout step has the highest statistical drop-off velocity.',
    problemStatement: 'Rank funnel step transitions by absolute user loss and drop-off rate.',
    inputDatasetSchema: {
      tableName: 'step_conversions',
      columns: ['step_order', 'step_name', 'reached_users'],
      sampleRows: [
        { step_order: 1, step_name: 'Shipping Address', reached_users: 10000 },
        { step_order: 2, step_name: 'Payment Selection', reached_users: 9200 },
        { step_order: 3, step_name: 'CVV & Confirmation', reached_users: 4500 },
        { step_order: 4, step_name: 'Order Placed', reached_users: 4100 }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  step_order,
  step_name,
  reached_users,
  (LAG(reached_users) OVER (ORDER BY step_order) - reached_users) AS users_lost,
  ROUND((1.0 - (reached_users * 1.0 / NULLIF(LAG(reached_users) OVER (ORDER BY step_order), 0))) * 100, 1) AS step_dropoff_pct
FROM step_conversions
ORDER BY step_order;`,
    stepByStepExplanation: [
      '1. Order stages sequentially.',
      '2. Calculate absolute user loss against the prior step using LAG().',
      '3. Identify the CVV & Confirmation step as the primary friction bottleneck (51.1% drop-off).'
    ],
    expectedOutputPreview: {
      columns: ['step_order', 'step_name', 'reached_users', 'users_lost', 'step_dropoff_pct'],
      rows: [
        [1, 'Shipping Address', 10000, 'NULL', 'NULL'],
        [2, 'Payment Selection', 9200, 800, 8.0],
        [3, 'CVV & Confirmation', 4500, 4700, 51.1],
        [4, 'Order Placed', 4100, 400, 8.9]
      ]
    },
    interviewRelevance: 'Standard product diagnostic exercise for diagnosing payment gateway or UX friction.'
  },

  // DAY 11: ANALYTICS PORTFOLIO & GITHUB ENGINEERING
  {
    id: 'ex-11-1',
    day: 11,
    exampleNumber: 1,
    title: 'Automated Data Quality Tests with PyTest',
    difficulty: 'Intermediate',
    businessContext: 'Add automated CI/CD unit tests to verify dataset integrity before feeding downstream BI models.',
    problemStatement: 'Write test functions verifying no negative revenues, unique primary keys, and no future dates.',
    inputDatasetSchema: {
      tableName: 'pipeline_output',
      columns: ['order_id', 'revenue', 'order_date'],
      sampleRows: [
        { order_id: 101, revenue: 150.0, order_date: '2024-01-15' },
        { order_id: 102, revenue: 80.0, order_date: '2024-02-01' }
      ]
    },
    language: 'python',
    solutionCode: `import pandas as pd
import datetime

def test_dataset_integrity(df: pd.DataFrame):
    # Test 1: Unique primary keys
    assert df['order_id'].is_unique, "Primary key violation: order_id contains duplicates!"
    
    # Test 2: No negative monetary amounts
    assert (df['revenue'] >= 0).all(), "Data error: negative revenue values found!"
    
    # Test 3: No future dates
    today = pd.to_datetime(datetime.date.today())
    assert (pd.to_datetime(df['order_date']) <= today).all(), "Anomaly: Future timestamps detected!"
    
    print("All 3 data quality constraints passed successfully.")

# Mock test execution
sample_df = pd.DataFrame({'order_id': [1, 2], 'revenue': [150.0, 80.0], 'order_date': ['2024-01-15', '2024-02-01']})
test_dataset_integrity(sample_df)`,
    stepByStepExplanation: [
      '1. Enforce uniqueness assertions on primary key columns.',
      '2. Assert non-negative domain rules on financial measurements.',
      '3. Validate that timestamps do not exceed current execution dates.'
    ],
    expectedOutputPreview: {
      columns: ['test_name', 'target_column', 'status'],
      rows: [
        ['test_primary_key_unique', 'order_id', 'PASSED'],
        ['test_non_negative_revenue', 'revenue', 'PASSED'],
        ['test_no_future_timestamps', 'order_date', 'PASSED']
      ]
    },
    interviewRelevance: 'Shows production data engineering maturity and defensive software standards.'
  },
  {
    id: 'ex-11-2',
    day: 11,
    exampleNumber: 2,
    title: 'Modular Analytics Pipeline Architecture in Python',
    difficulty: 'Intermediate',
    businessContext: 'Structure raw spaghetti code into a clean Extract-Transform-Load (ETL) pipeline pattern.',
    problemStatement: 'Refactor into extract(), transform(), and load() modular functions with typing.',
    inputDatasetSchema: {
      tableName: 'etl_architecture',
      columns: ['stage', 'responsibility'],
      sampleRows: [
        { stage: 'Extract', responsibility: 'Read raw source data' },
        { stage: 'Transform', responsibility: 'Business cleaning and KPIs' },
        { stage: 'Load', responsibility: 'Write to target data warehouse' }
      ]
    },
    language: 'python',
    solutionCode: `import pandas as pd
from typing import Dict

def extract_data() -> pd.DataFrame:
    """Extract raw transaction logs."""
    return pd.DataFrame({'id': [1, 2], 'amt': [100, 200], 'status': ['PAID', 'PENDING']})

def transform_data(df: pd.DataFrame) -> pd.DataFrame:
    """Filter completed orders and calculate fee."""
    clean = df[df['status'] == 'PAID'].copy()
    clean['net_amt'] = clean['amt'] * 0.97
    return clean

def load_data(df: pd.DataFrame) -> Dict[str, int]:
    """Simulate warehouse write."""
    return {"rows_loaded": len(df), "status": "SUCCESS"}

# Pipeline runner
raw = extract_data()
transformed = transform_data(raw)
result = load_data(transformed)
print("Pipeline Run Result:", result)`,
    stepByStepExplanation: [
      '1. Isolate ingestion logic into extract().',
      '2. Pure transformation logic in transform() without side-effects.',
      '3. Centralize database target loading in load() with telemetry.'
    ],
    expectedOutputPreview: {
      columns: ['pipeline_stage', 'records_processed', 'status'],
      rows: [
        ['Extract', 2, 'OK'],
        ['Transform', 1, 'OK'],
        ['Load', 1, 'SUCCESS']
      ]
    },
    interviewRelevance: 'Proves you write maintainable, modular production code rather than unreadable scripts.'
  },
  {
    id: 'ex-11-3',
    day: 11,
    exampleNumber: 3,
    title: 'Bash Command Line for Large File Profiling',
    difficulty: 'Beginner',
    businessContext: 'Quickly inspect a 10GB CSV file from the terminal without loading it into RAM.',
    problemStatement: 'Inspect header, count total lines, check unique values, and search for errors.',
    inputDatasetSchema: {
      tableName: 'server_terminal',
      columns: ['command', 'utility'],
      sampleRows: [
        { command: 'head -n 5 data.csv', utility: 'View header and first rows' },
        { command: 'wc -l data.csv', utility: 'Count total lines' }
      ]
    },
    language: 'bash',
    solutionCode: `# 1. Preview header and first 5 records
head -n 5 transactions.csv

# 2. Count total rows in file without opening Python/Excel
wc -l transactions.csv

# 3. Search for error codes in server logs
grep "HTTP 500" access.log | wc -l

# 4. Extract unique payment gateways from column 4
cut -d',' -f4 transactions.csv | sort | uniq -c`,
    stepByStepExplanation: [
      '1. head -n 5 displays top rows in 2 milliseconds.',
      '2. wc -l streams lines to count rows without memory exhaustion.',
      '3. grep filters error logs instantly.',
      '4. cut, sort, and uniq count frequency distributions directly from the command line.'
    ],
    expectedOutputPreview: {
      columns: ['command', 'execution_speed', 'memory_used'],
      rows: [
        ['wc -l', '1.2s for 10M rows', '< 2MB RAM'],
        ['head -n 5', '0.01s', '< 1MB RAM']
      ]
    },
    interviewRelevance: 'Crucial CLI survival skills tested by senior data platform interviewers.'
  },
  {
    id: 'ex-11-4',
    day: 11,
    exampleNumber: 4,
    title: 'Git Version Control & Merge Conflict Resolution',
    difficulty: 'Intermediate',
    businessContext: 'Safely merge a collaborative feature branch into main while resolving schema conflicts.',
    problemStatement: 'Execute git commands to checkout, rebase, resolve conflict, and push.',
    inputDatasetSchema: {
      tableName: 'git_workflow',
      columns: ['step', 'command_syntax'],
      sampleRows: [
        { step: 'Create branch', command_syntax: 'git checkout -b feature/rfm-pipeline' },
        { step: 'Commit', command_syntax: 'git commit -m "feat: add rfm scores"' }
      ]
    },
    language: 'bash',
    solutionCode: `# 1. Fetch latest changes from remote
git fetch origin

# 2. Switch to your feature branch and rebase against main
git checkout feature/churn-model
git rebase origin/main

# (If conflict arises in sql/models.sql, edit conflicting markers, then:)
git add sql/models.sql
git rebase --continue

# 3. Push verified branch for GitHub Pull Request review
git push origin feature/churn-model --force-with-lease`,
    stepByStepExplanation: [
      '1. Keep feature branches updated by rebasing against latest main.',
      '2. Resolve conflicting lines manually, keeping target schema changes.',
      '3. Use --force-with-lease for safe branch updating.'
    ],
    expectedOutputPreview: {
      columns: ['git_operation', 'branch_status', 'safety_level'],
      rows: [
        ['Rebase on Main', 'Up-to-date with production', 'Safe (Clean History)'],
        ['Pull Request Ready', '0 merge conflicts', 'Peer-Review Ready']
      ]
    },
    interviewRelevance: 'Validates that you understand standard enterprise engineering collaboration workflows.'
  },
  {
    id: 'ex-11-5',
    day: 11,
    exampleNumber: 5,
    title: 'Writing an Executive-Ready GitHub Project README',
    difficulty: 'Beginner',
    businessContext: 'Structure a portfolio README that captures recruiter interest in under 30 seconds.',
    problemStatement: 'Format a Markdown README with Business Impact, Architecture, Key Insights, and Setup.',
    inputDatasetSchema: {
      tableName: 'readme_sections',
      columns: ['section', 'content_focus'],
      sampleRows: [
        { section: '1. Executive Summary', content_focus: 'Dollar savings, ROI, core problem' },
        { section: '2. Architecture', content_focus: 'Data pipeline diagram, tech stack' }
      ]
    },
    language: 'bash',
    solutionCode: `# E-Commerce Customer Churn Diagnostic & Retention Engine
> **Commercial Impact:** Identified \$1.2M in preventable churn; recommended interventions improved 90-day retention by 14%.

## 1. Executive Summary
- **Business Problem:** An 18% surge in quarterly subscription cancellations was eroding annual recurring revenue.
- **Root Cause:** App sync latency on Android devices drove 62% of dissatisfaction tickets.

## 2. Tech Stack & Architecture
\`\`\`
Raw Clickstream (PostgreSQL) -> DBT / SQL Transformations -> Python (Pandas/Stats) -> Power BI Executive Dashboard
\`\`\`

## 3. Key Findings & Strategic Recommendations
1. **Target VIP At-Risk Cohorts:** Implement automated retention triggers for users with login gaps > 14 days.
2. **Resolve Android Latency:** Eliminates \$420k annual revenue leakage.

## 4. Quick Start (Reproducibility)
\`\`\`bash
pip install -r requirements.txt
python src/run_pipeline.py
\`\`\``,
    stepByStepExplanation: [
      '1. Lead with tangible business outcomes and dollar impact in the first 2 lines.',
      '2. Display architecture pipeline diagram clearly.',
      '3. Detail actionable recommendations followed by exact reproduction steps.'
    ],
    expectedOutputPreview: {
      columns: ['portfolio_element', 'hiring_manager_takeaway'],
      rows: [
        ['Executive Summary First', 'Candidate focuses on business value, not just code'],
        ['One-Line Quickstart', 'Project is verified reproducible and production-ready']
      ]
    },
    interviewRelevance: 'The #1 factor determining whether hiring managers grant you an interview callback.'
  },

  // DAY 12: CAPSTONE PROJECT & EXECUTIVE DEFENSE
  {
    id: 'ex-12-1',
    day: 12,
    exampleNumber: 1,
    title: 'The Minto Pyramid Executive Presentation Outline',
    difficulty: 'Intermediate',
    businessContext: 'Structure a 10-minute C-Suite capstone presentation answering: "What should we do, why, and what is the ROI?"',
    problemStatement: 'Format presentation using Answer First principle (Recommendation -> Arguments -> Data).',
    inputDatasetSchema: {
      tableName: 'presentation_layers',
      columns: ['layer', 'deliverable'],
      sampleRows: [
        { layer: 'Top', deliverable: 'Bottom-Line Recommendation & Financial ROI' },
        { layer: 'Supporting', deliverable: '3 Key Business Pillars with Quantitative Evidence' },
        { layer: 'Appendix', deliverable: 'Deep-dive SQL logic & statistical validation' }
      ]
    },
    language: 'sql',
    solutionCode: `-- Executive Summary Query: Aggregate total commercial impact
SELECT 
  'Implement Automated VIP Retention Triggers' AS primary_recommendation,
  1200000 AS annual_revenue_protected,
  85000 AS implementation_cost,
  ROUND(((1200000 - 85000) * 1.0 / 85000) * 100, 1) AS projected_roi_pct,
  '2.8 months' AS payback_timeline;`,
    stepByStepExplanation: [
      '1. Start with the definitive business recommendation (Answer First).',
      '2. Present projected financial impact ($1.2M protected vs $85k cost = 1,311% ROI).',
      '3. Support with payback timeline (2.8 months).'
    ],
    expectedOutputPreview: {
      columns: ['primary_recommendation', 'annual_revenue_protected', 'projected_roi_pct', 'payback_timeline'],
      rows: [
        ['Implement Automated VIP Retention Triggers', 1200000, 1311.8, '2.8 months']
      ]
    },
    interviewRelevance: 'Tests executive communication and boardroom presence during capstone defense.'
  },
  {
    id: 'ex-12-2',
    day: 12,
    exampleNumber: 2,
    title: 'Defending Data Integrity Under Executive Cross-Examination',
    difficulty: 'Advanced',
    businessContext: 'CFO asks: "How do you know these revenue figures are not distorted by refunded transactions?"',
    problemStatement: 'Write an audit query reconciling gross orders, refunds, and net settled revenue.',
    inputDatasetSchema: {
      tableName: 'reconciliation_audit',
      columns: ['month', 'gross_orders', 'refunded_orders', 'gross_revenue', 'refund_amount'],
      sampleRows: [
        { month: '2024-Q1', gross_orders: 10000, refunded_orders: 450, gross_revenue: 1250000, refund_amount: 52000 }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  month,
  gross_orders,
  refunded_orders,
  ROUND(refunded_orders * 100.0 / gross_orders, 2) AS refund_order_rate_pct,
  gross_revenue,
  refund_amount,
  (gross_revenue - refund_amount) AS net_settled_revenue,
  ROUND((gross_revenue - refund_amount) * 100.0 / gross_revenue, 2) AS net_revenue_realization_pct
FROM reconciliation_audit;`,
    stepByStepExplanation: [
      '1. Explicitly partition gross bookings from settled cash.',
      '2. Quantify refund leakage percentage (4.16% in Q1).',
      '3. Defend net settled revenue ($1,198,000) as the conservative financial baseline.'
    ],
    expectedOutputPreview: {
      columns: ['month', 'gross_revenue', 'refund_amount', 'net_settled_revenue', 'net_revenue_realization_pct'],
      rows: [
        ['2024-Q1', 1250000, 52000, 1198000, 95.84]
      ]
    },
    interviewRelevance: 'Demonstrates professional composure and airtight audit reconciliation under pressure.'
  },
  {
    id: 'ex-12-3',
    day: 12,
    exampleNumber: 3,
    title: 'Sensitivity & Scenario Analysis (Bear, Base, Bull Case)',
    difficulty: 'Intermediate',
    businessContext: 'Provide leadership with conservative, expected, and optimistic ROI projections.',
    problemStatement: 'Compute revenue lift under 5%, 10%, and 15% adoption scenarios.',
    inputDatasetSchema: {
      tableName: 'scenario_modeling',
      columns: ['scenario', 'adoption_rate', 'base_population', 'arpu'],
      sampleRows: [
        { scenario: 'Bear Case (Conservative)', adoption_rate: 0.05, base_population: 50000, arpu: 120 },
        { scenario: 'Base Case (Expected)', adoption_rate: 0.10, base_population: 50000, arpu: 120 },
        { scenario: 'Bull Case (Optimistic)', adoption_rate: 0.15, base_population: 50000, arpu: 120 }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  scenario,
  adoption_rate,
  ROUND(base_population * adoption_rate, 0) AS participating_users,
  ROUND(base_population * adoption_rate * arpu, 2) AS incremental_revenue,
  ROUND((base_population * adoption_rate * arpu) - 75000, 2) AS net_profit_after_costs
FROM scenario_modeling;`,
    stepByStepExplanation: [
      '1. Model user adoption probabilities across conservative (5%), expected (10%), and optimistic (15%) cases.',
      '2. Calculate gross incremental revenue per scenario.',
      '3. Deduct fixed $75,000 project costs to confirm profitability even under the conservative Bear case.'
    ],
    expectedOutputPreview: {
      columns: ['scenario', 'participating_users', 'incremental_revenue', 'net_profit_after_costs'],
      rows: [
        ['Bear Case (Conservative)', 2500, 300000, 225000],
        ['Base Case (Expected)', 5000, 600000, 525000],
        ['Bull Case (Optimistic)', 7500, 900000, 825000]
      ]
    },
    interviewRelevance: 'Shows risk management and commercial realism essential for C-suite buy-in.'
  },
  {
    id: 'ex-12-4',
    day: 12,
    exampleNumber: 4,
    title: 'Operational Implementation Roadmap & RACI Matrix',
    difficulty: 'Beginner',
    businessContext: 'Translate analytical findings into an executable 90-day deployment roadmap with defined owners.',
    problemStatement: 'Structure initiatives by Phase, Owner, Deliverable, and KPI Target.',
    inputDatasetSchema: {
      tableName: 'raci_matrix',
      columns: ['phase', 'initiative', 'owner', 'kpi_target'],
      sampleRows: [
        { phase: 'Days 1-30', initiative: 'Telemetry Instrumentation', owner: 'Data Eng', kpi_target: '100% event tracking' },
        { phase: 'Days 31-60', initiative: 'A/B Retention Trigger Pilot', owner: 'Product', kpi_target: '8% lift in cohort' },
        { phase: 'Days 61-90', initiative: 'Full Scale Enterprise Rollout', owner: 'Executive Sponsor', kpi_target: '$1.2M ARR protected' }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  phase,
  initiative,
  owner,
  kpi_target
FROM raci_matrix
ORDER BY phase;`,
    stepByStepExplanation: [
      '1. Deconstruct deployment into 30-60-90 day milestone phases.',
      '2. Assign unambiguous functional ownership (Data Eng, Product, Operations).',
      '3. Attach concrete measurable KPI criteria to each milestone.'
    ],
    expectedOutputPreview: {
      columns: ['phase', 'initiative', 'owner', 'kpi_target'],
      rows: [
        ['Days 1-30', 'Telemetry Instrumentation', 'Data Eng', '100% event tracking'],
        ['Days 31-60', 'A/B Retention Trigger Pilot', 'Product', '8% lift in cohort'],
        ['Days 61-90', 'Full Scale Enterprise Rollout', 'Executive Sponsor', '$1.2M ARR protected']
      ]
    },
    interviewRelevance: 'Proves you bridge the gap between technical insight and enterprise execution.'
  },
  {
    id: 'ex-12-5',
    day: 12,
    exampleNumber: 5,
    title: 'Executive Capstone Final Defense: C-Suite Q&A Response Matrix',
    difficulty: 'Advanced',
    businessContext: 'Prepare answers for the 5 most common executive objections raised during final capstone defenses.',
    problemStatement: 'Map executive objections to empirical data defenses and mitigation actions.',
    inputDatasetSchema: {
      tableName: 'executive_qa',
      columns: ['stakeholder', 'objection', 'empirical_defense', 'risk_mitigation'],
      sampleRows: [
        { stakeholder: 'Chief Product Officer', objection: 'Will these notifications annoy active users?', empirical_defense: 'Pilot showed 0.2% unsubscribe rate with frequency capping', risk_mitigation: 'Hard limit 1 message / 14 days' },
        { stakeholder: 'VP of Engineering', objection: 'We cannot allocate 4 engineers this sprint', empirical_defense: 'Requires only 1 engineer for 3 days using existing webhook', risk_mitigation: 'Pre-built SQL transformation scripts' }
      ]
    },
    language: 'sql',
    solutionCode: `SELECT 
  stakeholder,
  objection,
  empirical_defense,
  risk_mitigation
FROM executive_qa;`,
    stepByStepExplanation: [
      '1. Identify the stakeholder\'s underlying risk or resource concern.',
      '2. Provide empirical pilot evidence to refute emotional assumptions.',
      '3. Offer proactive guardrails and risk-mitigation measures.'
    ],
    expectedOutputPreview: {
      columns: ['stakeholder', 'objection', 'empirical_defense', 'risk_mitigation'],
      rows: [
        ['CPO', 'Notification spam concern', '0.2% unsubscribe in pilot', 'Frequency cap: max 1/14 days'],
        ['VP Eng', 'Resource constraint', 'Only 3 engineering days needed', 'Pre-built automated SQL views']
      ]
    },
    interviewRelevance: 'The pinnacle of analytics interview preparation: proving commercial empathy and leadership readiness.'
  }
];
