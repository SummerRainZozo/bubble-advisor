import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BubbleVisualization } from "@/components/BubbleVisualization";
import { CATEGORIES, Category } from "@/types/bubble";
import { Card } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const [categories] = useState<Category[]>(CATEGORIES);
  const [marketScore, setMarketScore] = useState(0);
  const [userScore, setUserScore] = useState(0);

  const calculateScore = (cats: Category[], useUserWeights: boolean = false) => {
    if (useUserWeights) {
      // User score calculation - matches UserAnalysis.tsx
      const savedMode = localStorage.getItem('isAdvancedMode');
      const isAdvancedMode = savedMode ? JSON.parse(savedMode) : false;
      
      let totalScore = 0;
      let totalWeight = 0;
      
      cats.forEach(category => {
        let categoryScore;
        
        if (isAdvancedMode) {
          // Advanced mode: calculate from individual factor values
          categoryScore = category.indexes.reduce((sum, index) => {
            const indexValue = index.userValue !== undefined ? index.userValue : index.value;
            return sum + indexValue;
          }, 0) / category.indexes.length;
        } else {
          // Normal mode: use direct category score if set, otherwise use market values
          if (category.userCategoryScore !== undefined) {
            categoryScore = category.userCategoryScore;
          } else {
            categoryScore = category.indexes.reduce((sum, index) => sum + index.value, 0) / category.indexes.length;
          }
        }
        
        totalScore += categoryScore * category.userWeight;
        totalWeight += category.userWeight;
      });
      
      return totalWeight > 0 ? Math.min(100, totalScore / totalWeight) : 0;
    } else {
      // Market score calculation
      let totalScore = 0;
      let totalWeight = 0;

      cats.forEach((category) => {
        const categoryScore =
          category.indexes.reduce((sum, index) => sum + index.value, 0) / category.indexes.length;

        totalScore += categoryScore * category.marketWeight;
        totalWeight += category.marketWeight;
      });

      return totalWeight > 0 ? Math.min(100, totalScore / totalWeight) : 0;
    }
  };

  useEffect(() => {
    // Calculate market score
    setMarketScore(calculateScore(categories, false));

    // Load user categories from localStorage and calculate user score
    const loadUserScore = () => {
      const savedUserCategories = localStorage.getItem("userCategories");
      if (savedUserCategories) {
        try {
          const parsed = JSON.parse(savedUserCategories);
          setUserScore(calculateScore(parsed, true));
        } catch (e) {
          setUserScore(calculateScore(categories, true));
        }
      } else {
        setUserScore(calculateScore(categories, true));
      }
    };

    loadUserScore();
  }, [categories]);

  // Reload user score when window regains focus (user returns to page)
  useEffect(() => {
    const handleFocus = () => {
      const savedUserCategories = localStorage.getItem("userCategories");
      if (savedUserCategories) {
        try {
          const parsed = JSON.parse(savedUserCategories);
          setUserScore(calculateScore(parsed, true));
        } catch (e) {
          console.error('Failed to load user score on focus');
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const generateInsight = () => {
    const savedUserCategories = localStorage.getItem("userCategories");
    if (!savedUserCategories) {
      return "Customize your analysis to see how your view differs from market consensus.";
    }

    try {
      const userCategories: Category[] = JSON.parse(savedUserCategories);
      const savedMode = localStorage.getItem('isAdvancedMode');
      const isAdvancedMode = savedMode ? JSON.parse(savedMode) : false;
      
      // Compare categories and find significant differences
      const differences: { name: string; direction: string; magnitude: number }[] = [];
      
      userCategories.forEach(userCat => {
        const marketCat = categories.find(c => c.id === userCat.id);
        if (!marketCat) return;
        
        let userCategoryScore: number;
        let marketCategoryScore: number;
        
        if (isAdvancedMode) {
          userCategoryScore = userCat.indexes.reduce((sum, index) => {
            const indexValue = index.userValue !== undefined ? index.userValue : index.value;
            return sum + indexValue;
          }, 0) / userCat.indexes.length;
          marketCategoryScore = marketCat.indexes.reduce((sum, index) => sum + index.value, 0) / marketCat.indexes.length;
        } else {
          userCategoryScore = userCat.userCategoryScore !== undefined ? userCat.userCategoryScore : 
            (marketCat.indexes.reduce((sum, index) => sum + index.value, 0) / marketCat.indexes.length);
          marketCategoryScore = marketCat.indexes.reduce((sum, index) => sum + index.value, 0) / marketCat.indexes.length;
        }
        
        const diff = userCategoryScore - marketCategoryScore;
        const magnitude = Math.abs(diff);
        
        if (magnitude > 10) {
          differences.push({
            name: userCat.name,
            direction: diff > 0 ? 'higher' : 'lower',
            magnitude
          });
        }
      });
      
      if (differences.length === 0) {
        return "Your analysis closely aligns with market consensus across all categories.";
      }
      
      // Sort by magnitude and take top differences
      differences.sort((a, b) => b.magnitude - a.magnitude);
      const topDifferences = differences.slice(0, 2);
      
      const sentiment = userScore > marketScore ? 'more optimistic' : 'more cautious';
      const comparison = userScore > marketScore ? 'higher' : 'lower';
      
      let insight = `You are ${sentiment} about the AI market (${comparison} bubble index than consensus). `;
      
      if (topDifferences.length === 1) {
        insight += `You view ${topDifferences[0].name} as ${topDifferences[0].direction} than the market consensus.`;
      } else {
        insight += `You view ${topDifferences[0].name} as ${topDifferences[0].direction} and ${topDifferences[1].name} as ${topDifferences[1].direction} compared to market consensus.`;
      }
      
      return insight;
    } catch (e) {
      return "Customize your analysis to see how your view differs from market consensus.";
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-primary">AI Bubble Visualizer</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Analyze the AI market bubble using key economic indicators. Click on each bubble to explore detailed
              analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Two Bubbles */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:grid-rows-1 lg:auto-rows-fr">
          {/* Market Consensus Bubble */}
          <Card
            className="p-8 bg-card border-border hover:border-primary/50 transition-colors overflow-hidden flex flex-col"
          >
            <div onClick={() => navigate("/market-consensus")} className="cursor-pointer flex-1 flex flex-col">
              <BubbleVisualization
                score={marketScore}
                title="Market Consensus"
                subtitle="Algorithm reflecting real-time market factors"
              />
            </div>
            <div className="mt-6 pt-6 border-t border-border/50 flex-shrink-0 min-h-[120px]">
              <p className="text-sm text-muted-foreground/90 leading-relaxed">
                Market consensus reflects elevated valuations and strong sentiment across AI stocks. High scores in Sentiment & Hype (85%+) and Market Valuation (78%+) indicate significant bubble risk.
              </p>
            </div>
          </Card>

          {/* User Analysis Bubble */}
          <Card
            className="p-8 bg-card border-border hover:border-primary/50 transition-colors overflow-hidden flex flex-col"
          >
            <div onClick={() => navigate("/user-analysis")} className="cursor-pointer flex-1 flex flex-col">
              <BubbleVisualization
                score={userScore}
                title="Your Analysis"
                subtitle="Assign your own weights in factors in estimating AI bubble"
              />
            </div>
            <div className="mt-6 pt-6 border-t border-border/50 flex-shrink-0 min-h-[120px]">
              <p className="text-sm text-muted-foreground/90 leading-relaxed">
                {generateInsight()}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
