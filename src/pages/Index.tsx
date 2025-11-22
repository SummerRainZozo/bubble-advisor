import { useState, useEffect } from "react";
import { BubbleVisualization } from "@/components/BubbleVisualization";
import { CategoryControls } from "@/components/CategoryControls";
import { BubbleTrendChart } from "@/components/BubbleTrendChart";
import { CATEGORIES, Category } from "@/types/bubble";
import { Card } from "@/components/ui/card";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";

const Index = () => {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [marketScore, setMarketScore] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const { isListening, isProcessing, startRecording, stopRecording } = useVoiceAgent();

  const calculateScore = (cats: Category[], useUserWeights: boolean = false) => {
    let totalScore = 0;
    let totalWeight = 0;
    
    cats.forEach(category => {
      // Calculate category score as average of its indexes (0-100)
      const categoryScore = category.indexes.reduce((sum, index) => {
        const indexValue = useUserWeights && index.userValue !== undefined ? index.userValue : index.value;
        return sum + indexValue;
      }, 0) / category.indexes.length;
      
      // Apply category weight (0-100 means 0-100% influence)
      const weight = useUserWeights ? category.userWeight : category.marketWeight;
      totalScore += categoryScore * weight;
      totalWeight += weight;
    });
    
    // Normalize to 0-100 scale
    return totalWeight > 0 ? Math.min(100, totalScore / totalWeight) : 0;
  };

  useEffect(() => {
    setMarketScore(calculateScore(categories, false));
    setUserScore(calculateScore(categories, true));
  }, [categories]);

  const handleCategoryWeightChange = (categoryId: string, weight: number) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            userWeight: weight,
          };
        }
        return cat;
      })
    );
  };

  const handleIndexValueChange = (categoryId: string, indexId: string, value: number) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            indexes: cat.indexes.map(idx =>
              idx.id === indexId ? { ...idx, userValue: value } : idx
            ),
          };
        }
        return cat;
      })
    );
  };

  const handleReset = () => {
    setCategories(
      CATEGORIES.map((cat) => ({
        ...cat,
        userWeight: cat.marketWeight,
        indexes: cat.indexes.map(idx => ({ ...idx, userValue: undefined }))
      }))
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
              onVoiceStart={startRecording}
              onVoiceStop={stopRecording}
              isListening={isListening}
            />
          </Card>
        </div>

        {/* Trend Chart */}
        <div className="mb-12">
          <BubbleTrendChart currentScore={userScore} />
        </div>

        {/* Category Controls */}
        <div>
          <CategoryControls
            categories={categories}
            onCategoryWeightChange={handleCategoryWeightChange}
            onIndexValueChange={handleIndexValueChange}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;