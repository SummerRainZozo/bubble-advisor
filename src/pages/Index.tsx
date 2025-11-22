import { useState, useEffect } from "react";
import { BubbleVisualization } from "@/components/BubbleVisualization";
import { CategoryControls } from "@/components/CategoryControls";
import { CATEGORIES, Category } from "@/types/bubble";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [marketScore, setMarketScore] = useState(0);
  const [userScore, setUserScore] = useState(0);

  const calculateScore = (cats: Category[], useUserWeights: boolean = false) => {
    return cats.reduce((total, category) => {
      const categoryScore = category.indexes.reduce((sum, index) => {
        return sum + (index.value * index.marketWeight / 100);
      }, 0);
      
      const weight = useUserWeights ? category.userWeight / 100 : 1;
      return total + (categoryScore * weight);
    }, 0);
  };

  useEffect(() => {
    setMarketScore(calculateScore(categories, false));
    setUserScore(calculateScore(categories, true));
  }, [categories]);

  const handleCategoryWeightChange = (categoryId: string, weight: number) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, userWeight: weight } : cat
      )
    );
  };

  const handleReset = () => {
    setCategories(
      CATEGORIES.map((cat) => ({ ...cat, userWeight: 100 }))
    );
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-primary">
              AI Bubble Visualizer
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Analyze the AI market bubble using key economic indicators. Adjust factor weights to see
              how your perspective changes the bubble size and burst risk.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Market Consensus Bubble */}
          <Card className="p-8 bg-card border-border">
            <BubbleVisualization
              score={marketScore}
              title="Market Consensus"
              subtitle="Equal weight to all factors"
            />
          </Card>

          {/* User Analysis Bubble */}
          <Card className="p-8 bg-card border-border">
            <BubbleVisualization
              score={userScore}
              title="Your Analysis"
              subtitle="Custom factor weights"
              isUserBubble
            />
          </Card>
        </div>

        {/* Category Controls */}
        <div>
          <CategoryControls
            categories={categories}
            onCategoryWeightChange={handleCategoryWeightChange}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;