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
  return (
    <RadioGroup
      value={selectedAnswer}
      onValueChange={onAnswerSelect}
      className="space-y-3"
    >
      {options?.map((option: string, index: number) => {
        const isSelected = option === selectedAnswer;
        const isCorrect = hasAnswered && option === correctAnswer;
        const isWrong = hasAnswered && isSelected && !isCorrect;

        return (
          <div 
            key={index} 
            className={cn(
              "flex items-center space-x-2 p-4 rounded-lg border transition-all duration-300",
              "hover:shadow-md hover:border-primary/50",
              isDisabled && "opacity-50 cursor-not-allowed",
              isSelected && !hasAnswered && "border-primary/50 bg-primary/5",
              hasAnswered && isCorrect && "border-green-500 bg-green-50",
              isWrong && "border-red-500 bg-red-50",
              "transform hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            <RadioGroupItem 
              value={option} 
              id={`option-${index}`}
              disabled={isDisabled || hasAnswered}
              className={cn(
                "transition-all duration-300",
                isSelected && "ring-primary"
              )}
            />
            <Label 
              htmlFor={`option-${index}`}
              className={cn(
                "flex-1 cursor-pointer select-none",
                isDisabled && "cursor-not-allowed"
              )}
            >
              {option}
            </Label>
            {hasAnswered && isSelected && (
              <div className={cn(
                "ml-2 transition-all duration-300",
                isCorrect ? "text-green-500" : "text-red-500"
              )}>
                {isCorrect ? 
                  <CheckCircle2 className="w-5 h-5 animate-bounce-once" /> :
                  <XCircle className="w-5 h-5 animate-shake" />
                }
              </div>
            )}
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default AnswerOptions;