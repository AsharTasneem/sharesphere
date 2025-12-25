import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6',
        onClick && 'cursor-pointer hover:border-primary-200',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}



