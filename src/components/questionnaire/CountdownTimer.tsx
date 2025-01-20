import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Timer } from "lucide-react";

interface CountdownTimerProps {
  countdown: number;
  onCountdownComplete: () => void;
  isDisabled?: boolean;
}

const CountdownTimer = ({ countdown, onCountdownComplete, isDisabled }: CountdownTimerProps) => {
  useEffect(() => {
    if (isDisabled) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        onCountdownComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, onCountdownComplete, isDisabled]);

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
        <Timer className="w-12 h-12 text-primary animate-pulse" />
        <h2 className="text-2xl font-bold text-center">
          Le questionnaire commence dans
        </h2>
        <p className="text-4xl font-bold text-primary">
          {countdown}
        </p>
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;