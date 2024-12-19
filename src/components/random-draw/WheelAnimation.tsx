import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

interface WheelAnimationProps {
  participants: Array<{ nom: string; prenom: string; id: string }>;
  onWinnerSelected: (winner: { nom: string; prenom: string; id: string }) => void;
  isSpinning: boolean;
}

export const WheelAnimation = ({ participants, onWinnerSelected, isSpinning }: WheelAnimationProps) => {
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<any>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (isSpinning && !animationRef.current) {
      const spinDuration = 5000; // 5 seconds
      const totalRotations = 10; // Number of full rotations
      startTimeRef.current = Date.now();

      // Calculate final rotation to ensure it stops at the winner
      const winnerIndex = Math.floor(Math.random() * participants.length);
      const segmentAngle = 360 / participants.length;
      const winnerAngle = 360 - (winnerIndex * segmentAngle); // Reverse angle for correct selection
      const finalRotation = (totalRotations * 360) + winnerAngle;

      const animate = () => {
        const elapsed = Date.now() - (startTimeRef.current || 0);
        const progress = Math.min(elapsed / spinDuration, 1);
        
        // Easing function for smooth deceleration
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
        
        const currentRotation = finalRotation * easeOut(progress);
        setRotation(currentRotation);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Animation complete
          const selectedWinner = participants[winnerIndex];
          setWinner(selectedWinner);
          onWinnerSelected(selectedWinner);
          
          // Trigger confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });

          // Reset animation ref
          animationRef.current = undefined;
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      // Cleanup
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = undefined;
        }
      };
    }
  }, [isSpinning, participants, onWinnerSelected]);

  const segmentAngle = 360 / participants.length;

  return (
    <div className="relative w-[400px] h-[400px] mx-auto">
      <div 
        className="absolute top-0 left-1/2 w-0 h-0 z-10"
        style={{
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderTop: '40px solid #ef4444',
          transform: 'translateX(-50%)',
        }}
      />
      <div 
        className="w-full h-full rounded-full border-8 border-gray-800 relative overflow-hidden"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {participants.map((participant, index) => (
          <div
            key={participant.id}
            className="absolute w-full h-full origin-center"
            style={{
              transform: `rotate(${index * segmentAngle}deg)`,
            }}
          >
            <div
              className="absolute w-1/2 h-full origin-right flex items-center justify-center"
              style={{
                backgroundColor: index % 2 === 0 ? '#3b82f6' : '#60a5fa',
                transform: 'rotate(0deg)',
              }}
            >
              <span
                className="absolute left-4 text-white font-bold text-sm whitespace-nowrap"
                style={{
                  transform: `rotate(-${90 + (index * segmentAngle)}deg)`,
                  transformOrigin: 'left center',
                }}
              >
                {`${participant.prenom} ${participant.nom}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};