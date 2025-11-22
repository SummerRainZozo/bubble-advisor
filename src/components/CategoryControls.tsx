import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RotateCcw, Info } from "lucide-react";
import { Category } from "@/types/bubble";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryControlsProps {
  categories: Category[];
  onCategoryWeightChange: (categoryId: string, weight: number) => void;
  onReset: () => void;
}

export const CategoryControls = ({
  categories,
  onCategoryWeightChange,
  onReset,
}: CategoryControlsProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategoryScore = (category: Category) => {
    return category.indexes.reduce((sum, index) => {
      return sum + (index.value * index.marketWeight / 100);
    }, 0);
  };

  const getContribution = (category: Category) => {
    const baseScore = getCategoryScore(category);
    return (baseScore * category.userWeight) / 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Market Factors</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Adjust weights and values to customize your analysis
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      <Button
        variant="ghost"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full justify-start text-primary hover:text-primary/80"
      >
        {showAdvanced ? "Hide" : "Show"} Advanced Controls
        {showAdvanced ? (
          <ChevronUp className="w-4 h-4 ml-2" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-2" />
        )}
      </Button>

      <div className="space-y-4">
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const contribution = getContribution(category);

          return (
            <Card
              key={category.id}
              className="p-6 bg-card border-border hover:border-primary/50 transition-colors"
            >
              <div
                className="cursor-pointer"
                onClick={() => showAdvanced && toggleCategory(category.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {category.name}
                      </h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{category.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {category.userWeight.toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Market: {100}%
                    </div>
                  </div>
                  {showAdvanced && (
                    <Button variant="ghost" size="sm" className="ml-2">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">
                        Weight Slider: {category.userWeight}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-3 h-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Relative importance (0 = Ignore, 100 = Market, 200 = Critical)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <Slider
                        value={[category.userWeight]}
                        onValueChange={([value]) =>
                          onCategoryWeightChange(category.id, value)
                        }
                        min={0}
                        max={200}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0 (Ignore)</span>
                        <span className="text-primary">100 (Market)</span>
                        <span>200 (Critical)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Contribution to Bubble Score</span>
                      <span className="text-lg font-bold text-primary">
                        {contribution.toFixed(1)}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(contribution * 5, 100)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showAdvanced && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 pt-6 border-t border-border space-y-4 overflow-hidden"
                  >
                    {category.indexes.map((index) => (
                      <div key={index.id} className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-foreground">
                                {index.name}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                Value: {index.value}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {index.description}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm font-semibold text-primary">
                              {index.marketWeight}%
                            </div>
                            <div className="text-xs text-muted-foreground">weight</div>
                          </div>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary/60"
                            style={{ width: `${index.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );
};