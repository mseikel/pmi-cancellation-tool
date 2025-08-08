import { Info } from "lucide-react";
import { useState, useRef } from "react";

interface InfoTooltipProps {
  children: React.ReactNode;
  size?: number;
  className?: string;
}

export default function InfoTooltip({ children, size = 18, className = "" }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(timeoutRef.current);
    setVisible(true);
  };

  const hide = () => {
    timeoutRef.current = window.setTimeout(() => setVisible(false), 200);
  };

  const toggle = () => setVisible((v) => !v);

  return (
    <span
      className={`relative ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <Info
        size={size}
        className="text-green-800 hover:text-green-900 cursor-pointer"
        onClick={toggle}
      />
      <div
        className={`absolute left-1/2 bottom-full z-50 -translate-x-1/2 mb-2 px-4 py-3 bg-white text-sm text-black rounded-xl shadow-lg transition-opacity duration-300 ${
          visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ maxWidth: "min(24rem, 90vw)" }}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {children}
      </div>
    </span>
  );
}
