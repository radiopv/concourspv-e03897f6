import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PrizeDescriptionProps {
  description: string;
  onChange: (value: string) => void;
}

export const PrizeDescription = ({ description, onChange }: PrizeDescriptionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <div className="space-y-4">
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[200px]"
        />
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
};