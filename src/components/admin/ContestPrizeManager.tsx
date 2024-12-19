import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import PrizeList from "./prize/PrizeList";

interface ContestPrizeManagerProps {
  contestId: string;
}

const ContestPrizeManager = ({ contestId }: ContestPrizeManagerProps) => {
  const { toast } = useToast();
  const [isAddingPrize, setIsAddingPrize] = useState(false);

  const handleAddPrize = () => {
    setIsAddingPrize(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contest Prizes</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleAddPrize} className="mb-4">
          Add Prize
        </Button>
        <PrizeList contestId={contestId} />
      </CardContent>
    </Card>
  );
};

export default ContestPrizeManager;