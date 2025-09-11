import { useEffect, useState } from "react";

const CustomCursorAuroraStar = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* Main star */}
      <div
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
          fontSize: 22,
          color: "#3BAAFF", // aurora blue
          textShadow: `
            0 0 6px #3BAAFF,
            0 0 12px #6EC6FF,
            0 0 20px #A1E3FF,
            0 0 30px #E0F7FF
          `,
          animation: "pulseAurora 2s infinite ease-in-out",
        }}
      >
        ✦
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulseAurora {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.7;
              text-shadow: 0 0 6px #3BAAFF,
                           0 0 12px #6EC6FF,
                           0 0 20px #A1E3FF;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.4);
              opacity: 1;
              text-shadow: 0 0 10px #3BAAFF,
                           0 0 20px #6EC6FF,
                           0 0 30px #A1E3FF,
                           0 0 40px #E0F7FF;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.7;
              text-shadow: 0 0 6px #3BAAFF,
                           0 0 12px #6EC6FF,
                           0 0 20px #A1E3FF;
            }
          }
        `}
      </style>
    </>
  );
};

export default CustomCursorAuroraStar;
