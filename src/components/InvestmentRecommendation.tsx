import { Card } from "@/components/ui/card";
import { Category } from "@/types/bubble";
import { Shield, TrendingUp, DollarSign, AlertTriangle, Target, Layers } from "lucide-react";

interface InvestmentRecommendationProps {
  categories: Category[];
  userScore: number;
  marketScore: number;
}

export const InvestmentRecommendation = ({ categories, userScore, marketScore }: InvestmentRecommendationProps) => {
  const scoreDiff = userScore - marketScore;
  const isOptimistic = scoreDiff < -5;
  const isPessimistic = scoreDiff > 5;

  const generatePositioningSuggestion = () => {
    if (isOptimistic && userScore < 60) {
      return {
        title: "Aggressive Growth Positioning",
        icon: TrendingUp,
        color: "text-bubble-safe",
        suggestions: [
          "Consider overweight positions in AI leaders with strong revenue growth trajectories",
          "Look at cloud infrastructure providers benefiting from AI compute demand",
          "Explore semiconductor companies supplying AI chips and accelerators",
          "Consider AI software platforms with high gross margins and recurring revenue"
        ]
      };
    } else if (isOptimistic && userScore >= 60) {
      return {
        title: "Selective Growth Positioning",
        icon: Target,
        color: "text-primary",
        suggestions: [
          "Focus on AI companies with proven profitability and reasonable valuations",
          "Consider enterprise AI companies with long-term contracts and sticky customers",
          "Look at AI infrastructure plays with pricing power and expanding margins",
          "Balance growth exposure with companies showing path to sustainable cash flow"
        ]
      };
    } else if (isPessimistic && userScore > 75) {
      return {
        title: "Defensive/Hedged Positioning",
        icon: Shield,
        color: "text-bubble-danger",
        suggestions: [
          "Reduce exposure to high-valuation AI names with no clear path to profitability",
          "Consider taking profits on positions with excessive gains and stretched multiples",
          "Look at portfolio hedges using put options on AI-heavy indices",
          "Rotate into AI beneficiaries with lower valuations and defensive characteristics"
        ]
      };
    } else if (isPessimistic) {
      return {
        title: "Cautious Positioning",
        icon: AlertTriangle,
        color: "text-bubble-warning",
        suggestions: [
          "Trim positions in companies trading at peak valuations without earnings support",
          "Focus on AI companies with strong balance sheets and positive free cash flow",
          "Consider quality over growth - look for profitable AI businesses with moats",
          "Maintain diversification beyond pure-play AI names to reduce concentration risk"
        ]
      };
    } else {
      return {
        title: "Balanced Positioning",
        icon: Layers,
        color: "text-primary",
        suggestions: [
          "Maintain market-weight exposure to AI sector aligned with benchmark indices",
          "Balance between growth leaders and value opportunities within AI ecosystem",
          "Consider both direct AI plays and indirect beneficiaries across the value chain",
          "Regular rebalancing to maintain target allocations as market moves"
        ]
      };
    }
  };

  const generateRiskManagement = () => {
    const risks = [];
    
    if (userScore > 70) {
      risks.push({
        risk: "High Bubble Risk Environment",
        action: "Set tight stop-losses and consider trimming positions that have exceeded targets. Monitor sentiment indicators closely."
      });
    }

    const valuationCategory = categories.find(c => c.id === "valuation");
    if (valuationCategory && (valuationCategory.userCategoryScore ?? 0) > 75) {
      risks.push({
        risk: "Valuation Concerns",
        action: "Avoid adding to positions with P/E ratios above industry averages. Focus on companies with revenue visibility and margin expansion potential."
      });
    }

    const sentimentCategory = categories.find(c => c.id === "sentiment");
    if (sentimentCategory && (sentimentCategory.userCategoryScore ?? 0) > 80) {
      risks.push({
        risk: "Extreme Sentiment",
        action: "Be contrarian when retail participation peaks. Consider fading extreme moves and taking profits on momentum-driven rallies."
      });
    }

    if (risks.length === 0) {
      risks.push({
        risk: "Market Volatility",
        action: "Maintain disciplined position sizing and avoid overconcentration. Use options for downside protection if concerned."
      });
    }

    return risks;
  };

  const generateAllocationGuidance = () => {
    if (isOptimistic && userScore < 50) {
      return {
        aiExposure: "25-35%",
        reasoning: "Your optimistic view supports higher AI allocation. Consider overweighting relative to market cap weights."
      };
    } else if (isOptimistic) {
      return {
        aiExposure: "15-25%",
        reasoning: "Moderate optimism supports market-weight to slight overweight in AI. Balance conviction with valuation discipline."
      };
    } else if (isPessimistic && userScore > 80) {
      return {
        aiExposure: "5-10%",
        reasoning: "Significant bubble concerns suggest minimal AI exposure. Focus on quality names and maintain tight risk controls."
      };
    } else if (isPessimistic) {
      return {
        aiExposure: "10-15%",
        reasoning: "Elevated caution suggests underweight positioning. Emphasize defensive characteristics and profitability."
      };
    } else {
      return {
        aiExposure: "15-20%",
        reasoning: "Neutral view aligns with market-weight exposure. Diversify across AI value chain to manage single-stock risk."
      };
    }
  };

  const positioning = generatePositioningSuggestion();
  const riskManagement = generateRiskManagement();
  const allocation = generateAllocationGuidance();
  const PositioningIcon = positioning.icon;

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Investment & Portfolio Recommendations</h2>
          <p className="text-sm text-muted-foreground">
            Personalized investment guidance based on your bubble analysis and market view
          </p>
        </div>

        {/* Recommended Positioning */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <PositioningIcon className={`w-6 h-6 ${positioning.color}`} />
            <h3 className="text-lg font-semibold text-foreground">{positioning.title}</h3>
          </div>
          <div className="space-y-2">
            {positioning.suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 ${positioning.color.replace('text-', 'bg-')}`} />
                <p className="text-sm text-foreground">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Allocation Guidance */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-secondary/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Suggested AI Exposure</h3>
            </div>
            <div className="text-3xl font-bold text-primary mb-2">{allocation.aiExposure}</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {allocation.reasoning}
            </p>
          </div>

          <div className="p-4 bg-secondary/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Portfolio Context</h3>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>• Your bubble index: <span className="font-semibold text-foreground">{userScore.toFixed(0)}</span></p>
              <p>• Market consensus: <span className="font-semibold text-foreground">{marketScore.toFixed(0)}</span></p>
              <p>• View: <span className="font-semibold text-foreground">
                {isOptimistic ? "More Optimistic" : isPessimistic ? "More Cautious" : "Aligned"}
              </span></p>
            </div>
          </div>
        </div>

        {/* Risk Management */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-bubble-warning" />
            Key Risk Management Actions
          </h3>
          <div className="space-y-3">
            {riskManagement.map((item, idx) => (
              <div key={idx} className="p-3 bg-secondary/30 rounded-lg border border-border">
                <div className="font-medium text-sm text-foreground mb-1">{item.risk}</div>
                <p className="text-xs text-muted-foreground">{item.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-muted/30 rounded border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> These recommendations are based on your custom bubble inputs and are for educational purposes only. 
            Not financial advice. Always conduct your own research, consider your risk tolerance, time horizon, and consult with a qualified 
            financial advisor before making investment decisions. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </Card>
  );
};
