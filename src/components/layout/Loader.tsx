// ShareSphereGSAP.jsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const ShareSphereGSAP = () => {
  const lettersRef = useRef([]);

  const letters = [
    "S",
    "H",
    "A",
    "R",
    "E",
    "S",
    "P",
    "H",
    "E",
    "R",
    "E",
    ".",
    ".",
    ".",
  ];

  useGSAP(() => {
    lettersRef.current = lettersRef.current.slice(0, letters.length);

    return gsap.fromTo(
      lettersRef.current,
      {
        rotationY: -90,
        opacity: 0,
        y: 8,
      },
      {
        rotationY: 0,
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      }
    );
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-primary-50">
      <div className="flex items-center gap-1 perspective-[800px]">
        {letters.map((letter, index) => (
          <span
            key={index}
            ref={(el) => (lettersRef.current[index] = el)}
            className="
              inline-block
              text-3xl md:text-4xl
              font-extrabold
              tracking-wider
              text-primary-600
              drop-shadow-[0_6px_12px_rgba(219,133,131,0.35)]
              transition-colors
              duration-300
            "
          >
            {letter}
          </span>
        ))}
      </div>
    </section>
  );
};

export default ShareSphereGSAP;
