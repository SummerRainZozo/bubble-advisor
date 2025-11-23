import { Card } from "@/components/ui/card";
import { Category } from "@/types/bubble";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

interface ScenarioAnalysisProps {
  categories: Category[];
  userScore: number;
  marketScore: number;
}

export const ScenarioAnalysis = ({ categories, userScore, marketScore }: ScenarioAnalysisProps) => {
  const scoreDiff = userScore - marketScore;
  const isOptimistic = scoreDiff < -5;
  const isPessimistic = scoreDiff > 5;
  
  // Analyze which categories the user adjusted significantly
  const significantAdjustments = categories.map(category => {
    const marketCategoryScore = category.indexes.reduce((sum, idx) => sum + idx.value, 0) / category.indexes.length;
    const userCategoryScore = category.userCategoryScore ?? marketCategoryScore;
    const diff = userCategoryScore - marketCategoryScore;
    
    return {
      category: category.name,
      categoryId: category.id,
      diff,
      userScore: userCategoryScore,
      marketScore: marketCategoryScore,
      isSignificant: Math.abs(diff) > 10
    };
  }).filter(adj => adj.isSignificant);

  const generateAnalysis = () => {
    const parts: string[] = [];
    
    if (isOptimistic) {
      parts.push("You're taking a more optimistic stance than the market consensus. ");
    } else if (isPessimistic) {
      parts.push("You're taking a more cautious view than the market consensus. ");
    } else {
      parts.push("Your analysis aligns closely with market consensus. ");
    }

    if (significantAdjustments.length > 0) {
      const adjustmentTexts = significantAdjustments.map(adj => {
        if (adj.categoryId === "valuation" && adj.diff < 0) {
          return `You believe AI valuations are more justified than the market thinks (your score: ${adj.userScore.toFixed(0)} vs market: ${adj.marketScore.toFixed(0)}), suggesting you see stronger fundamentals supporting current prices.`;
        } else if (adj.categoryId === "valuation" && adj.diff > 0) {
          return `You see AI valuations as more stretched than the market consensus (your score: ${adj.userScore.toFixed(0)} vs market: ${adj.marketScore.toFixed(0)}), implying you believe P/E ratios and revenue multiples are unsustainably high.`;
        } else if (adj.categoryId === "sentiment" && adj.diff < 0) {
          return `You're less concerned about sentiment and hype levels (your score: ${adj.userScore.toFixed(0)} vs market: ${adj.marketScore.toFixed(0)}), suggesting you think the enthusiasm is warranted by AI's transformative potential.`;
        } else if (adj.categoryId === "sentiment" && adj.diff > 0) {
          return `You see sentiment and hype as more excessive than the market (your score: ${adj.userScore.toFixed(0)} vs market: ${adj.marketScore.toFixed(0)}), indicating you believe media coverage and social buzz have reached unsustainable levels.`;
        } else if (adj.categoryId === "macro" && adj.diff > 0) {
          return `You're more worried about macro conditions and liquidity (your score: ${adj.userScore.toFixed(0)} vs market: ${adj.marketScore.toFixed(0)}), suggesting concerns about interest rates or tightening financial conditions.`;
        } else if (adj.categoryId === "fundamentals" && adj.diff < 0) {
          return `You're more confident in AI infrastructure and profitability (your score: ${adj.userScore.toFixed(0)} vs market: ${adj.marketScore.toFixed(0)}), implying you believe revenue growth and enterprise adoption will accelerate further.`;
        } else if (adj.categoryId === "fundamentals" && adj.diff > 0) {
          return `You're skeptical about AI fundamentals and profitability trends (your score: ${adj.userScore.toFixed(0)} vs market: ${adj.marketScore.toFixed(0)}), suggesting concerns about CapEx sustainability or margin compression.`;
        } else if (adj.diff < 0) {
          return `You rated ${adj.category} lower (${adj.userScore.toFixed(0)}) than market consensus (${adj.marketScore.toFixed(0)}), suggesting reduced concerns in this area.`;
        } else {
          return `You rated ${adj.category} higher (${adj.userScore.toFixed(0)}) than market consensus (${adj.marketScore.toFixed(0)}), indicating heightened concerns.`;
        }
      });
      
      parts.push(...adjustmentTexts);
    }

    return parts.join(" ");
  };

  const generatePlausibility = () => {
    if (isOptimistic) {
      return {
        likelihood: "Moderate-to-High",
        reasoning: "Your optimistic view could materialize if: (1) AI companies continue beating revenue expectations, (2) enterprise adoption accelerates faster than anticipated, (3) productivity gains from AI start showing up in GDP data, or (4) breakthrough applications emerge that justify current valuations. Historical precedent shows that transformative technologies often exceed initial expectations, though the path is rarely smooth.",
        icon: CheckCircle,
        color: "text-bubble-safe"
      };
    } else if (isPessimistic) {
      return {
        likelihood: "Moderate",
        reasoning: "Your cautious stance has historical support. Past tech bubbles have shown that excessive valuations, elevated sentiment, and crowded positioning often precede corrections. Your scenario could unfold if: (1) AI revenue growth disappoints expectations, (2) interest rates remain elevated longer than expected, (3) a major AI company reports weak guidance, or (4) alternative technologies emerge that threaten current leaders.",
        icon: AlertCircle,
        color: "text-bubble-warning"
      };
    } else {
      return {
        likelihood: "High",
        reasoning: "Your balanced view aligns with market consensus, which reflects the collective wisdom of investors analyzing similar data. This scenario is currently being priced in by the market, making it the baseline expectation. The key risk is that consensus views can shift rapidly when new information emerges.",
        icon: CheckCircle,
        color: "text-primary"
      };
    }
  };

  const plausibility = generatePlausibility();
  const PlausibilityIcon = plausibility.icon;

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Scenario Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Real-time analysis of your bubble scenario and its plausibility
          </p>
        </div>

        {/* Score Comparison */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary/30 rounded-lg border border-border">
            <div className="text-xs text-muted-foreground mb-1">Your Bubble Index</div>
            <div className="text-3xl font-bold text-primary">{userScore.toFixed(0)}</div>
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg border border-border">
            <div className="text-xs text-muted-foreground mb-1">Market Consensus</div>
            <div className="text-3xl font-bold text-foreground">{marketScore.toFixed(0)}</div>
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg border border-border">
            <div className="text-xs text-muted-foreground mb-1">Difference</div>
            <div className={`text-3xl font-bold flex items-center gap-2 ${
              isOptimistic ? 'text-bubble-safe' : isPessimistic ? 'text-bubble-danger' : 'text-foreground'
            }`}>
              {isOptimistic && <TrendingDown className="w-6 h-6" />}
              {isPessimistic && <TrendingUp className="w-6 h-6" />}
              {scoreDiff > 0 ? '+' : ''}{scoreDiff.toFixed(0)}
            </div>
          </div>
        </div>

        {/* Analysis */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="text-sm font-semibold text-foreground mb-2">Your Market View</h3>
          <p className="text-sm text-foreground leading-relaxed">
            {generateAnalysis()}
          </p>
        </div>

        {/* Plausibility Assessment */}
        <div className="p-4 bg-secondary/30 rounded-lg border border-border">
          <div className="flex items-start gap-3 mb-3">
            <PlausibilityIcon className={`w-5 h-5 ${plausibility.color} mt-0.5`} />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Scenario Likelihood: <span className={plausibility.color}>{plausibility.likelihood}</span>
              </h3>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {plausibility.reasoning}
          </p>
        </div>

        {/* Key Assumptions */}
        {significantAdjustments.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Key Assumptions in Your Scenario</h3>
            <div className="space-y-2">
              {significantAdjustments.map((adj, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 ${
                    adj.diff < 0 ? 'bg-bubble-safe' : 'bg-bubble-warning'
                  }`} />
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{adj.category}</span>: 
                    {adj.diff < 0 ? ' Lower risk than market perceives' : ' Higher risk than market perceives'} 
                    (you: {adj.userScore.toFixed(0)}, market: {adj.marketScore.toFixed(0)})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
