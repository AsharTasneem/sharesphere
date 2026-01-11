import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { cn } from "@/lib/utils";

interface RotatingCardProps {
  children: ReactNode;
  backContent?: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const RotatingCard = ({
  children,
  backContent,
  className,
  onClick,
  hoverEffect = true,
}: RotatingCardProps) => {
  return (
    <StyledWrapper
      $hoverEffect={hoverEffect}
      className={cn(className)}
      onClick={onClick}
    >
      <div className="card">
        <div className="content">
          {/* Front Face (Visible Default 0deg) */}
          <div className="face face-front">
            <div className="face-content">{children}</div>
          </div>

          {/* Back Face (Hidden Default 180deg) */}
          <div className="face face-back">
            <div className="face-bg-animation"></div>
            <div className="face-content centered">{backContent}</div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $hoverEffect: boolean }>`
  perspective: 1000px;

  .card {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .content {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 1000ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  .face {
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 12px;
    overflow: hidden;
    background-color: #151515;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  /* Front Face: Relative to prop open dimensions */
  .face-front {
    position: relative;
    transform: rotateY(0deg);
    z-index: 2;
  }

  /* Back Face: Absolute to overlay */
  .face-back {
    position: absolute;
    top: 0;
    left: 0;
    transform: rotateY(180deg);
  }

  .face-content {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 10;
  }

  .face-content.centered {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }

  /* Back Face Background Animation */
  .face-bg-animation {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      transparent,
      rgba(255, 153, 102, 0.1),
      rgba(255, 34, 51, 0.1),
      transparent
    );
    animation: rotation 6000ms infinite linear;
    z-index: 1;
    pointer-events: none;
  }

  ${(props) =>
    props.$hoverEffect &&
    css`
      .card:hover .content {
        transform: rotateY(180deg);
      }
      .card:hover .face-back {
        z-index: 5;
      }
    `}

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default RotatingCard;
