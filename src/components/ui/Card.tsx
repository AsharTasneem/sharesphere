import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export function Card({
  children,
  className = "",
  onClick,
  hoverEffect = false,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: cardRef });

  const onMouseEnter = contextSafe(() => {
    if (!hoverEffect) return;
    gsap.to(cardRef.current, {
      y: -8,
      boxShadow:
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      borderColor: "#e0e7ff", // primary-100
      duration: 0.3,
      ease: "power2.out",
    });
  });

  const onMouseLeave = contextSafe(() => {
    if (!hoverEffect) return;
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)", // shadow-sm
      borderColor: "#e5e7eb", // gray-200
      duration: 0.3,
      ease: "power2.out",
    });
  });

  return (
    <div
      ref={cardRef}
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-sm p-6",
        onClick && "cursor-pointer hover:border-primary-200",
        className
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
