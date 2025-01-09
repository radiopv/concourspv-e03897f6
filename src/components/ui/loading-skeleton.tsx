import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  count?: number;
  height?: string;
  className?: string;
}

const LoadingSkeleton = ({ count = 3, height = "h-64", className = "" }: LoadingSkeletonProps) => {
  return (
    <div className={`grid gap-4 ${className}`} role="status" aria-label="Chargement">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className={height} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;