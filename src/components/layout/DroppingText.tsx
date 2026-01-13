import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const words = ["Lending", "Borrowing", "Sharing", "EVERYTHING!"];

// Define Mid-Tone rainbow colors (Vibrant but legible)
const rainbowColors = [
  "#dc2626", // Red
  "#ea580c", // Orange-Red
  "#d97706", // Deep Orange / Amber
  "#ca8a04", // Mustard Yellow (Readable on white)
  "#65a30d", // Lime Green
  "#16a34a", // Green
  "#0891b2", // Cyan / Teal
  "#2563eb", // Royal Blue
  "#4f46e5", // Indigo
  "#7c3aed", // Violet
  "#db2777", // Magenta / Deep Pink
];

const DroppingTextsGSAP = () => {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1 });

      itemsRef.current.forEach((el, index) => {
        const isLast = index === itemsRef.current.length - 1;

        tl.fromTo(
          el,
          {
            autoAlpha: 0,
            rotate: -25,
            x: -30,
            scale: 0,
          },
          {
            autoAlpha: 1,
            rotate: 0,
            x: 0,
            scale: 1,
            duration: 0.25,
            ease: "power2.out",
          }
        )
          .to(el, {
            autoAlpha: 1,
            duration: isLast ? 1.2 : 0.9,
          })
          .to(el, {
            autoAlpha: 0,
            scale: isLast ? 50 : 0,
            x: isLast ? -1000 : 20,
            y: isLast ? -800 : 100,
            rotate: 15,
            duration: 0.6,
            ease: "power2.in",
          });
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="w-full py-6 flex flex-col md:flex-row justify-center items-center overflow-hidden font-light leading-snug"
    >
      <span className="text-4xl lg:text-6xl font-bold text-primary-800 mr-4">
        A complete solution for
      </span>

      <div className="grid items-center justify-items-start">
        {words.map((word, i) => (
          <div
            key={word}
            ref={(el) => (itemsRef.current[i] = el)}
            className="col-start-1 row-start-1 text-4xl lg:text-6xl font-bold text-gray-900"
            style={{
              opacity: 0,
              whiteSpace: "nowrap",
            }}
          >
            {/* Split the word into characters to color them individually */}
            {word.split("").map((char, charIndex) => (
              <span
                key={charIndex}
                style={{
                  color: rainbowColors[charIndex % rainbowColors.length],
                }}
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroppingTextsGSAP;
