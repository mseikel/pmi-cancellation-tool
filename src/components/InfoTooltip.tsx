import { Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface InfoTooltipProps {
  children: React.ReactNode;
  size?: number;
  className?: string;
}

export default function InfoTooltip({ children, size = 18, className = "" }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");

  const iconRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(timeoutRef.current);
    setVisible(true);
  };

  const hide = () => {
    timeoutRef.current = window.setTimeout(() => setVisible(false), 200);
  };

  const toggle = () => setVisible((v) => !v);

  useEffect(() => {
    if (visible && iconRef.current && tooltipRef.current) {
      const iconRect = iconRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      const spaceAbove = iconRect.top;
      const spaceBelow = window.innerHeight - iconRect.bottom;

      if (spaceAbove < tooltipRect.height + 12 && spaceBelow > spaceAbove) {
        setPosition("bottom");
      } else {
        setPosition("top");
      }
    }
  }, [visible]);

  return (
    <span
      className={`relative ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      ref={iconRef}
    >
      <Info
        size={size}
        className="text-green-800 hover:text-green-900 cursor-pointer"
        onClick={toggle}
      />
      <div
        ref={tooltipRef}
  className={`absolute left-1/2 z-50 -translate-x-1/2 px-4 py-3 bg-white text-sm text-black font-normal rounded-xl shadow-lg transition-opacity duration-300
    ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"}
    ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
    max-w-[80vw] sm:max-w-[40rem] min-w-[12rem] sm:min-w-[20rem]
  `}
  style={{
    width: "fit-content",
    maxHeight: "50vh",
    overflowY: "auto"
  }}
  onMouseEnter={show}
  onMouseLeave={hide}
>
  {children}
      </div>
    </span>
  );
}
