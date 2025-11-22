export interface Index {
  id: string;
  name: string;
  description: string;
  value: number; // 0-100
  marketWeight: number; // 0-100
}

export interface Category {
  id: string;
  name: string;
  description: string;
  indexes: Index[];
  userWeight: number; // 0-200, default 100 (market consensus)
}

export const CATEGORIES: Category[] = [
  {
    id: "valuation",
    name: "Market Valuation",
    description: "Price metrics vs historical norms",
    userWeight: 100,
    indexes: [
      {
        id: "pe-ratio",
        name: "AI Stock P/E Ratio",
        description: "Price-to-earnings ratio vs historical average",
        value: 85,
        marketWeight: 12.5,
      },
      {
        id: "revenue-multiple",
        name: "Revenue Multiples",
        description: "Price-to-sales ratios for AI companies",
        value: 78,
        marketWeight: 12.5,
      },
      {
        id: "market-cap",
        name: "Market Cap / GDP",
        description: "AI sector size relative to economy",
        value: 68,
        marketWeight: 12.5,
      },
      {
        id: "growth-premium",
        name: "Growth Premium",
        description: "Valuation premium for growth expectations",
        value: 82,
        marketWeight: 12.5,
      },
    ],
  },
  {
    id: "sentiment",
    name: "Sentiment & Hype",
    description: "Market excitement and media coverage",
    userWeight: 100,
    indexes: [
      {
        id: "media-mentions",
        name: "Media Mentions",
        description: "AI coverage in major publications",
        value: 92,
        marketWeight: 10,
      },
      {
        id: "social-sentiment",
        name: "Social Sentiment",
        description: "Social media discussion volume",
        value: 88,
        marketWeight: 10,
      },
      {
        id: "search-trends",
        name: "Search Trends",
        description: "Google search interest in AI stocks",
        value: 75,
        marketWeight: 10,
      },
      {
        id: "analyst-ratings",
        name: "Analyst Ratings",
        description: "Buy/sell recommendations ratio",
        value: 80,
        marketWeight: 10,
      },
      {
        id: "ipo-activity",
        name: "IPO Activity",
        description: "New AI company listings",
        value: 70,
        marketWeight: 10,
      },
    ],
  },
  {
    id: "positioning",
    name: "Positioning & Flows",
    description: "Investor positioning and capital flows",
    userWeight: 100,
    indexes: [
      {
        id: "fund-flows",
        name: "Fund Flows",
        description: "Money flowing into AI ETFs",
        value: 72,
        marketWeight: 10,
      },
      {
        id: "institutional",
        name: "Institutional Holdings",
        description: "Big money allocation to AI",
        value: 68,
        marketWeight: 10,
      },
      {
        id: "retail-interest",
        name: "Retail Interest",
        description: "Individual investor participation",
        value: 85,
        marketWeight: 10,
      },
      {
        id: "options-volume",
        name: "Options Volume",
        description: "Derivatives market activity",
        value: 76,
        marketWeight: 10,
      },
    ],
  },
  {
    id: "macro",
    name: "Macro & Liquidity",
    description: "Economic environment and capital availability",
    userWeight: 100,
    indexes: [
      {
        id: "interest-rates",
        name: "Interest Rates",
        description: "Fed policy and rate expectations",
        value: 55,
        marketWeight: 10,
      },
      {
        id: "liquidity",
        name: "Market Liquidity",
        description: "M2 money supply and credit conditions",
        value: 65,
        marketWeight: 10,
      },
      {
        id: "vix",
        name: "VIX Fear Index",
        description: "Market volatility and fear indicator",
        value: 68,
        marketWeight: 12.5,
      },
      {
        id: "put-call",
        name: "Put/Call Ratio",
        description: "Options market sentiment",
        value: 72,
        marketWeight: 12.5,
      },
    ],
  },
  {
    id: "fundamentals",
    name: "AI Infra Cycles & Profitability",
    description: "Business fundamentals and infrastructure",
    userWeight: 100,
    indexes: [
      {
        id: "revenue-growth",
        name: "Revenue Growth",
        description: "YoY revenue acceleration",
        value: 88,
        marketWeight: 10,
      },
      {
        id: "profit-margins",
        name: "Profit Margins",
        description: "Operating and net margins",
        value: 62,
        marketWeight: 10,
      },
      {
        id: "capex-cycle",
        name: "CapEx Cycle",
        description: "Infrastructure investment phase",
        value: 78,
        marketWeight: 10,
      },
      {
        id: "adoption-rate",
        name: "Enterprise Adoption",
        description: "Corporate AI implementation rate",
        value: 70,
        marketWeight: 10,
      },
      {
        id: "competition",
        name: "Competitive Intensity",
        description: "Market saturation and rivalry",
        value: 75,
        marketWeight: 5,
      },
    ],
  },
];