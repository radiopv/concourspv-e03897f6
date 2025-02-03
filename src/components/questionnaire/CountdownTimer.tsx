import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Timer } from "lucide-react";

interface CountdownTimerProps {
  countdown: number;
  onCountdownComplete: () => void;
  isDisabled?: boolean;
}

const CountdownTimer = ({ countdown: initialCountdown, onCountdownComplete, isDisabled }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialCountdown);

  useEffect(() => {
    if (isDisabled || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onCountdownComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onCountdownComplete, isDisabled]);

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
        <Timer className="w-12 h-12 text-primary animate-pulse" />
        <h2 className="text-2xl font-bold text-center">
          Temps restant
        </h2>
        <p className="text-4xl font-bold text-primary">
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </p>
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;