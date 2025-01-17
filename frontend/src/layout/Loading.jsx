import ReactDOM from "react-dom";
import { useEffect } from "react";

export default function Loading({ isVisible }) {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden"; // Deshabilita scroll
    } else {
      document.body.style.overflow = ""; // Habilita scroll
    }
    return () => {
      document.body.style.overflow = ""; // Limpieza
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-white">Cargando</h2>
        <p className="mb-4 text-gray-300">
          Por favor espere mientras procesamos su solicitud...
        </p>
        <div className="flex justify-center items-center">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-8 bg-gray-200 rounded-full animate-wave`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes wave {
          0%, 100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1);
          }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>,
    document.body
  );
}
