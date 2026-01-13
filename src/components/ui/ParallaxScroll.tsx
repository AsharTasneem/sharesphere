"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export const ParallaxScroll = ({
  images,
  className,
}: {
  images?: string[];
  className?: string;
}) => {
  const defaultImages = [
    "/images/coin-in-jar-pink-bg.webp",
    "/images/coin-rotating.jpg",
    "/images/coins-poping-out-from-box.jpg",
    "/images/container-and-cash-flow.jpg",
    "/images/exchanging-goods-for-money.jpg",
    "/images/laptop-and-coin.avif",
    "/images/man-taking-gold-coin.jpg",
    "/images/shopping-bag-and coins.jpg",
  ];

  const baseImages = images || defaultImages;
  const imagesToUse = [
    ...baseImages,
    ...baseImages,
    ...baseImages,
    ...baseImages,
  ];

  const gridRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);

  const third = Math.ceil(imagesToUse.length / 3);
  const firstPart = imagesToUse.slice(0, third);
  const secondPart = imagesToUse.slice(third, 2 * third);
  const thirdPart = imagesToUse.slice(2 * third);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1, // Increased from true/0.2 to 1 for significant smoothing (user requested smooth)
        },
      });

      tl.fromTo(col1Ref.current, { y: -500 }, { y: -1000, ease: "none" }, 0);
      tl.fromTo(col2Ref.current, { y: -500 }, { y: 200, ease: "none" }, 0);
      tl.fromTo(col3Ref.current, { y: -500 }, { y: -1000, ease: "none" }, 0);
    },
    { scope: gridRef }
  );

  return (
    <div
      className={cn("w-full py-40 overflow-hidden h-[300vh] my-20", className)}
      ref={gridRef}
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent, white 8%, white 95%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, white 8%, white 95%, transparent)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 px-10">
        <div className="grid gap-10" ref={col1Ref}>
          {firstPart.map((el, idx) => (
            <div key={"grid-1" + idx}>
              <img
                src={el}
                className="h-auto w-full object-left-top rounded-lg gap-10 !m-0 !p-0"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </div>
          ))}
        </div>
        <div className="grid gap-10" ref={col2Ref}>
          {secondPart.map((el, idx) => (
            <div key={"grid-2" + idx}>
              <img
                src={el}
                className="h-auto w-full object-left-top rounded-lg gap-10 !m-0 !p-0"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </div>
          ))}
        </div>
        <div className="grid gap-10" ref={col3Ref}>
          {thirdPart.map((el, idx) => (
            <div key={"grid-3" + idx}>
              <img
                src={el}
                className="h-auto w-full object-left-top rounded-lg gap-10 !m-0 !p-0"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
