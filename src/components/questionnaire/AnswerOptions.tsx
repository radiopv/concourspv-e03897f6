import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnswerOptionsProps {
  options: string[];
  selectedAnswer: string;
  correctAnswer?: string;
  hasAnswered: boolean;
  isDisabled: boolean;
  onAnswerSelect: (answer: string) => void;
}

const AnswerOptions = ({
  options,
  selectedAnswer,
  correctAnswer,
  hasAnswered,
  isDisabled,
  onAnswerSelect
}: AnswerOptionsProps) => {
  const isCorrect = hasAnswered && selectedAnswer === correctAnswer;

  return (
    <RadioGroup
      value={selectedAnswer}
      onValueChange={onAnswerSelect}
      className="space-y-3"
    >
      {options?.map((option: string, index: number) => (
        <div 
          key={index} 
          className={cn(
            "flex items-center space-x-2 p-3 rounded-lg border transition-all",
            isDisabled && "opacity-50 cursor-not-allowed",
            hasAnswered && option === selectedAnswer && (
              isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
            )
          )}
        >
          <RadioGroupItem 
            value={option} 
            id={`option-${index}`}
            disabled={isDisabled || hasAnswered}
          />
          <Label 
            htmlFor={`option-${index}`}
            className={cn(
              "flex-1 cursor-pointer",
              isDisabled && "cursor-not-allowed"
            )}
          >
            {option}
          </Label>
          {hasAnswered && option === selectedAnswer && (
            isCorrect ? 
              <CheckCircle2 className="w-5 h-5 text-green-500" /> :
              <XCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      ))}
    </RadioGroup>
  );
};

export default AnswerOptions;