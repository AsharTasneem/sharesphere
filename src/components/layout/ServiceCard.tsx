import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface ServiceItemData {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCardItem = ({ service }: { service: ServiceItemData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      // Create a timeline that handles all hover states
      tl.current = gsap.timeline({
        paused: true,
        defaults: { duration: 0.4, ease: "power2.out", force3D: true },
      });

      tl.current
        // Animate Overlay (Sweep in)
        .to(overlayRef.current, {
          top: "0%",
          borderRadius: "0",
        })
        // Animate Icon (Pop, Transparent BG)
        .to(
          iconRef.current,
          {
            scale: 1.2,
            backgroundColor: "rgba(255, 255, 255, 0)", // Transparent to show gradient
            boxShadow: "none",
          },
          "<"
        )
        // Animate Text Colors
        .to(titleRef.current, { color: "#5b21b6" }, "<"); // Deep Purple to match lavender
    },
    { scope: containerRef }
  );

  return (
    <div className="p-4 text-center service-card opacity-0">
      <div
        ref={containerRef}
        className="relative z-10 overflow-hidden rounded-lg bg-white p-8 shadow-lg cursor-pointer h-full"
        style={{
          backfaceVisibility: "hidden",
          transform: "translate3d(0,0,0)",
        }}
        onMouseEnter={() => tl.current?.play()}
        onMouseLeave={() => tl.current?.reverse()}
      >
        {/* Gradient Overlay - Start positioned above */}
        <div
          ref={overlayRef}
          className="absolute left-0 top-[-100%] h-full w-full z-0 bg-gradient-to-br from-white to-[#d5cdf3]"
        ></div>

        {/* Content Wrapper to ensure it sits on top of overlay */}
        <div className="relative z-10 pointer-events-none">
          {/* Icon */}
          <div
            ref={iconRef}
            className="mb-4 mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-50 text-pink-600 shadow-sm transition-colors"
          >
            {service.icon}
          </div>

          {/* Title */}
          <h3
            ref={titleRef}
            className="mb-4 text-lg font-semibold text-gray-900"
          >
            {service.title}
          </h3>

          {/* Description */}
          <p ref={descRef} className="text-sm text-gray-600">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
};

interface ServiceCardProps {
  data?: ServiceItemData[];
  className?: string; // Add className prop
}

const ServiceCard = ({ data, className }: ServiceCardProps) => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".service-card");
      gsap.fromTo(
        cards,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div className={className} ref={containerRef}>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {data &&
          data.map((item, idx) => <ServiceCardItem key={idx} service={item} />)}
      </div>
    </div>
  );
};

export default ServiceCard;
