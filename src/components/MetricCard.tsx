import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MetricCardProps {
  title: string;
  subtitle?: string;
  value: string;
  description?: string;
  badge?: {
    text: string;
    variant?: "default" | "warning" | "success";
  };
}

export const MetricCard = ({ title, subtitle, value, description, badge }: MetricCardProps) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          <div className="flex items-end justify-between">
            <p className="text-4xl font-bold text-foreground">{value}</p>
          </div>
          {badge && (
            <Badge 
              variant={badge.variant === "warning" ? "outline" : "default"}
              className={
                badge.variant === "warning" 
                  ? "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20" 
                  : ""
              }
            >
              {badge.text}
            </Badge>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
