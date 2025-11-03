import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export default function StatCard({ title, value, change, changeType = "neutral", icon: Icon }: StatCardProps) {
  const changeColor = {
    positive: "text-chart-2",
    negative: "text-destructive",
    neutral: "text-muted-foreground"
  }[changeType];

  return (
    <Card data-testid={`card-stat-${title.toLowerCase().replace(/\s/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold font-mono tracking-tight" data-testid={`text-value-${title.toLowerCase().replace(/\s/g, '-')}`}>
              {value}
            </p>
            {change && (
              <p className={`text-sm font-semibold mt-1 ${changeColor}`} data-testid={`text-change-${title.toLowerCase().replace(/\s/g, '-')}`}>
                {change}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
