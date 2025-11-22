import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BubbleVisualization } from "@/components/BubbleVisualization";
import { CategoryControls } from "@/components/CategoryControls";
import { CATEGORIES, Category } from "@/types/bubble";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";

const UserAnalysis = () => {
  const navigate = useNavigate();
  
  // Initialize from localStorage if available
  const getInitialCategories = () => {
    const savedCategories = localStorage.getItem('userCategories');
    if (savedCategories) {
      try {
        return JSON.parse(savedCategories);
      } catch (e) {
        console.error('Failed to load saved categories');
      }
    }
    return CATEGORIES;
  };
  
  const [categories, setCategories] = useState<Category[]>(getInitialCategories);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const { isListening, isProcessing, startRecording, stopRecording } = useVoiceAgent();

  const calculateScore = (cats: Category[], useAdvancedValues: boolean = false) => {
    let totalScore = 0;
    let totalWeight = 0;
    
    cats.forEach(category => {
      let categoryScore;
      
      if (useAdvancedValues) {
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
      
      // Weight contribution: category score multiplied by weight
      totalScore += categoryScore * category.userWeight;
      totalWeight += category.userWeight;
    });
    
    // Weighted average to get final score (0-100)
    return totalWeight > 0 ? Math.min(100, totalScore / totalWeight) : 0;
  };

  useEffect(() => {
    setUserScore(calculateScore(categories, isAdvancedMode));
    // Autosave to localStorage
    localStorage.setItem('userCategories', JSON.stringify(categories));
    localStorage.setItem('isAdvancedMode', JSON.stringify(isAdvancedMode));
  }, [categories, isAdvancedMode]);

  // Load mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('isAdvancedMode');
    if (savedMode) {
      try {
        setIsAdvancedMode(JSON.parse(savedMode));
      } catch (e) {
        console.error('Failed to load saved mode');
      }
    }
  }, []);

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

  const handleCategoryScoreChange = (categoryId: string, score: number) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            userCategoryScore: score,
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
        userCategoryScore: undefined,
        indexes: cat.indexes.map(idx => ({ ...idx, userValue: undefined }))
      }))
    );
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="relative container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-white hover:text-white/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-primary">
              Your Analysis
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Customize factor weights to create your own bubble analysis
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Bubble Visualization */}
        <div className="mb-12">
          <Card className="p-8 bg-card border-border">
            <div className="mb-4 text-center">
              <div className="text-sm text-muted-foreground">
                Market Consensus: <span className="font-semibold text-primary">{(() => {
                  // Calculate market consensus score using same formula as Index.tsx
                  let totalScore = 0;
                  let totalWeight = 0;

                  CATEGORIES.forEach((category) => {
                    const categoryScore =
                      category.indexes.reduce((sum, index) => sum + index.value, 0) / category.indexes.length;

                    totalScore += categoryScore * category.marketWeight;
                    totalWeight += category.marketWeight;
                  });

                  return totalWeight > 0 ? Math.min(100, totalScore / totalWeight).toFixed(1) : '0.0';
                })()}</span>
              </div>
            </div>
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

        {/* User Controls - Fully Editable */}
        <div>
          <CategoryControls
            categories={categories}
            onCategoryWeightChange={handleCategoryWeightChange}
            onCategoryScoreChange={handleCategoryScoreChange}
            onIndexValueChange={handleIndexValueChange}
            onReset={handleReset}
            isAdvancedMode={isAdvancedMode}
            onModeChange={setIsAdvancedMode}
          />
        </div>
      </div>
    </div>
  );
};

export default UserAnalysis;
