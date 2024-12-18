import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface Prize {
  id: number;
  name: string;
  image_url?: string;
}

interface ContestPrizesProps {
  prizes: Prize[];
}

const ContestPrizes = ({ prizes }: ContestPrizesProps) => {
  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader className="text-center">
        <Trophy className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
        <CardTitle>Prix à gagner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prizes?.map((prize) => (
            <div key={prize.id} className="text-center">
              {prize.image_url && (
                <img
                  src={prize.image_url}
                  alt={prize.name}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
              )}
              <p className="font-medium">{prize.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContestPrizes;