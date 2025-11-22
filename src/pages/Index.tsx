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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Market Consensus Bubble */}
          <Card
            className="p-8 bg-card border-border cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate("/market-consensus")}
          >
            <BubbleVisualization
              score={marketScore}
              title="Market Consensus"
              subtitle="Algorithm reflecting real-time market factors"
            />
          </Card>

          {/* User Analysis Bubble */}
          <Card
            className="p-8 bg-card border-border cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate("/user-analysis")}
          >
            <BubbleVisualization
              score={userScore}
              title="Your Analysis"
              subtitle="Assign your own weights in factors in estimating AI bubble"
            />
            {(() => {
              // Generate contextual insight comparing user vs market
              const savedUserCategories = localStorage.getItem("userCategories");
              if (!savedUserCategories) return null;
              
              try {
                const userCategories = JSON.parse(savedUserCategories);
                const marketCategories = CATEGORIES;
                
                // Compare user scores with market scores
                const differences = userCategories.map((userCat: Category) => {
                  const marketCat = marketCategories.find(m => m.id === userCat.id);
                  if (!marketCat) return null;
                  
                  // Get user category score (from Normal or Advanced mode)
                  const savedMode = localStorage.getItem('isAdvancedMode');
                  const isAdvancedMode = savedMode ? JSON.parse(savedMode) : false;
                  
                  let userCategoryScore;
                  if (isAdvancedMode) {
                    userCategoryScore = userCat.indexes.reduce((sum: number, index: any) => {
                      const indexValue = index.userValue !== undefined ? index.userValue : index.value;
                      return sum + indexValue;
                    }, 0) / userCat.indexes.length;
                  } else {
                    userCategoryScore = userCat.userCategoryScore ?? 
                      (userCat.indexes.reduce((sum: number, index: any) => sum + index.value, 0) / userCat.indexes.length);
                  }
                  
                  const marketCategoryScore = marketCat.indexes.reduce((sum, index) => sum + index.value, 0) / marketCat.indexes.length;
                  
                  return {
                    name: userCat.name,
                    diff: userCategoryScore - marketCategoryScore,
                    userScore: userCategoryScore
                  };
                }).filter(Boolean);
                
                // Find most significant differences
                const sortedDiffs = differences.sort((a: any, b: any) => Math.abs(b.diff) - Math.abs(a.diff));
                const topDiff = sortedDiffs[0];
                
                if (!topDiff || Math.abs(topDiff.diff) < 5) {
                  return (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Your analysis is closely aligned with market consensus across all categories.
                      </p>
                    </div>
                  );
                }
                
                const sentiment = userScore > marketScore ? "more optimistic" : "more pessimistic";
                const direction = topDiff.diff > 0 ? "higher" : "lower";
                const opposite = topDiff.diff > 0 ? "overvalued" : "undervalued";
                
                return (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You are <strong className="text-foreground">{sentiment}</strong> about the AI market bubble. 
                      You think <strong className="text-foreground">{topDiff.name}</strong> indicators are <strong className="text-foreground">{direction}</strong> than 
                      market consensus suggests, implying the market may be <strong className="text-foreground">{opposite}</strong> in this area.
                    </p>
                  </div>
                );
              } catch (e) {
                return null;
              }
            })()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
