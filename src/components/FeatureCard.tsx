import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
}

const FeatureCard = ({ title, description, icon: Icon, onClick, className = "" }: FeatureCardProps) => {
  return (
    <Card className={`hover:shadow-warm transition-smooth cursor-pointer group ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-smooth">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          onClick={onClick}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg transition-smooth"
        >
          शुरू करें (Start)
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;