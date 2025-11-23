import { useParams, useNavigate } from "react-router-dom";
import { CATEGORIES } from "@/types/bubble";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const category = CATEGORIES.find(cat => cat.id === categoryId);

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Category Not Found</h1>
          <Button onClick={() => navigate('/market-consensus')}>
            Back to Market Consensus
          </Button>
        </div>
      </div>
    );
  }

  const avgValue = category.indexes.reduce((sum, index) => sum + index.value, 0) / category.indexes.length;

  const getValueIndicator = (value: number) => {
    if (value >= 70) return { icon: TrendingUp, color: "text-bubble-danger", bgColor: "bg-bubble-danger/10", label: "High Risk" };
    if (value >= 50) return { icon: Minus, color: "text-bubble-warning", bgColor: "bg-bubble-warning/10", label: "Elevated" };
    return { icon: TrendingDown, color: "text-bubble-safe", bgColor: "bg-bubble-safe/10", label: "Moderate" };
  };

  // Generate sample historical data for visualization
  const generateHistoricalData = (currentValue: number) => {
    const months = ['6mo ago', '5mo ago', '4mo ago', '3mo ago', '2mo ago', '1mo ago', 'Now'];
    return months.map((month, idx) => ({
      month,
      value: Math.max(20, Math.min(100, currentValue - (6 - idx) * (Math.random() * 8 - 2)))
    }));
  };

  const indicator = getValueIndicator(avgValue);
  const Icon = indicator.icon;

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="relative container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/market-consensus')}
            className="mb-4 text-white hover:text-white/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Market Consensus
          </Button>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-primary">
                {category.name}
              </h1>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${indicator.bgColor}`}>
                <Icon className={`w-5 h-5 ${indicator.color}`} />
                <span className={`text-sm font-medium ${indicator.color}`}>{indicator.label}</span>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {category.description}
            </p>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-5xl font-bold text-primary">{avgValue.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">Current Level</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* Category Summary */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">Category Overview</h2>
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-foreground leading-relaxed">
              {category.explanation}
            </p>
          </div>
        </Card>

        {/* Contributing Factors Analysis */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Contributing Factors</h2>
          
          {category.indexes.map((index, idx) => {
            const indexIndicator = getValueIndicator(index.value);
            const IndexIcon = indexIndicator.icon;
            const historicalData = generateHistoricalData(index.value);

            return (
              <motion.div
                key={index.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <Card className="p-6 bg-card border-border">
                  <div className="space-y-6">
                    {/* Factor Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {index.name}
                          </h3>
                          <div className={`flex items-center gap-1 ${indexIndicator.color}`}>
                            <IndexIcon className="w-4 h-4" />
                            <span className="text-xs font-medium">{indexIndicator.label}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {index.description}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-4xl font-bold text-primary">
                          {index.value.toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Current Value
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Why This Matters</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {index.explanation}
                        </p>
                      </div>
                      <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Current Level Analysis</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {index.value >= 70 
                            ? "This factor indicates elevated bubble risk. Historical patterns suggest heightened vulnerability to market corrections. Consider monitoring closely for signs of excess."
                            : index.value >= 50
                            ? "This factor shows moderate concerns. Worth monitoring but not at critical levels yet. The reading suggests caution is warranted but no immediate red flags."
                            : "This factor remains within healthy ranges. No immediate concerns for bubble formation in this area. Current levels suggest sustainable market conditions."}
                        </p>
                      </div>
                    </div>

                    {/* Visual Analysis - Historical Trend */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">6-Month Trend</h4>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={historicalData}>
                            <defs>
                              <linearGradient id={`gradient-${index.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="month" 
                              stroke="hsl(var(--muted-foreground))"
                              fontSize={12}
                            />
                            <YAxis 
                              stroke="hsl(var(--muted-foreground))"
                              fontSize={12}
                              domain={[0, 100]}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                color: 'hsl(var(--foreground))'
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="hsl(var(--primary))" 
                              fill={`url(#gradient-${index.id})`}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Risk Level Indicator */}
                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Risk Level Progress
                        </div>
                        <div className="h-3 bg-secondary/50 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${
                              index.value >= 70 ? 'bg-bubble-danger' :
                              index.value >= 50 ? 'bg-bubble-warning' :
                              'bg-bubble-safe'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${index.value}%` }}
                            transition={{ duration: 1, delay: idx * 0.2 }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{index.value}%</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
