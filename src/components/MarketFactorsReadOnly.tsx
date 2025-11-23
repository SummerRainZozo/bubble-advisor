import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/bubble";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MarketFactorsReadOnlyProps {
  categories: Category[];
}

export const MarketFactorsReadOnly = ({ categories }: MarketFactorsReadOnlyProps) => {
  const navigate = useNavigate();
  
  const getValueIndicator = (value: number) => {
    if (value >= 70) return { icon: TrendingUp, color: "text-bubble-danger", label: "High Risk" };
    if (value >= 50) return { icon: Minus, color: "text-bubble-warning", label: "Elevated" };
    return { icon: TrendingDown, color: "text-bubble-safe", label: "Moderate" };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Market Consensus Factors</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Current market conditions based on real-time data and analysis
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((category, idx) => {
          const avgValue = category.indexes.reduce((sum, index) => sum + index.value, 0) / category.indexes.length;
          const indicator = getValueIndicator(avgValue);
          const Icon = indicator.icon;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="p-6 bg-card border-border hover:border-primary/30 transition-all">
                <div className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {category.name}
                        </h3>
                        <div className={`flex items-center gap-1 ${indicator.color}`}>
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-medium">{indicator.label}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-3xl font-bold text-primary">
                        {avgValue.toFixed(0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Current Level
                      </div>
                    </div>
                  </div>

                  {/* Contributing Factors - Simple List */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Contributing Factors
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {category.indexes.map((index) => {
                        const indexIndicator = getValueIndicator(index.value);
                        const IndexIcon = indexIndicator.icon;

                        return (
                          <div key={index.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                            <div className="flex items-center gap-2">
                              <IndexIcon className={`w-3 h-3 ${indexIndicator.color}`} />
                              <span className="text-xs font-medium text-foreground">
                                {index.name}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-primary">
                              {index.value.toFixed(0)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Learn More Button */}
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => navigate(`/category/${category.id}`)}
                  >
                    Learn More About {category.name}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
