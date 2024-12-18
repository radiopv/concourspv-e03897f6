import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { XCircle } from "lucide-react";
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
  hasAnswered,
  isDisabled,
  onAnswerSelect
}: AnswerOptionsProps) => {
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
            hasAnswered && option === selectedAnswer && "border-red-500 bg-red-50"
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
            <XCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      ))}
    </RadioGroup>
  );
};

export default AnswerOptions;