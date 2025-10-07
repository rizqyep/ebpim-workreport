import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const ChartCard = ({ title, subtitle, children }: ChartCardProps) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {subtitle && (
          <CardDescription className="text-sm text-muted-foreground">{subtitle}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-6">
        {children}
      </CardContent>
    </Card>
  );
};
