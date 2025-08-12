import { Info } from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

interface InfoTooltipProps {
  children: React.ReactNode;
  size?: number;
  className?: string;
}

export default function InfoTooltip({ children, size = 18, className = "" }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const iconRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(timeoutRef.current);
    setVisible(true);
  };

  const hide = () => {
    timeoutRef.current = window.setTimeout(() => setVisible(false), 200);
  };

  const toggle = () => setVisible((v) => !v);

  // Decide top vs bottom when opening
  useEffect(() => {
    if (visible && iconRef.current && panelRef.current) {
      const iconRect = iconRef.current.getBoundingClientRect();
      const panelRect = panelRef.current.getBoundingClientRect();

      const spaceAbove = iconRect.top;
      const spaceBelow = window.innerHeight - iconRect.bottom;

      if (spaceAbove < panelRect.height + 12 && spaceBelow > spaceAbove) {
        setPosition("bottom");
      } else {
        setPosition("top");
      }
    }
  }, [visible]);

  // Compute viewport coords for the portal panel
  const updateCoords = () => {
    if (!iconRef.current) return;
    const r = iconRef.current.getBoundingClientRect();
    const gap = 8; // 0.5rem like before
    const centerX = r.left + r.width / 2;
    const top = position === "top" ? r.top - gap : r.bottom + gap;
    setCoords({ top, left: centerX });
  };

  useLayoutEffect(() => {
    if (!visible) return;
    updateCoords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, position]);

  // Keep position synced on scroll/resize (including inside scrollable parents)
  useEffect(() => {
    if (!visible) return;
    const handler = () => updateCoords();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [visible]);

  return (
    <>
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
      </span>

      {visible && coords &&
        createPortal(
          <div
            // Outer fixed placer (no visual styles here)
            className="fixed z-[1000] pointer-events-none"
            style={{
              top: coords.top,
              left: coords.left,
              // center horizontally; for top we pull up by its own height
              transform:
                position === "top"
                  ? "translate(-50%, -100%)"
                  : "translate(-50%, 0)",
            }}
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            {/* Your actual tooltip panel */}
            <div
              ref={panelRef}
              className={`pointer-events-auto px-4 py-3 bg-white text-sm text-black font-normal rounded-xl shadow-lg transition-opacity duration-300
                ${visible ? "opacity-100" : "opacity-0"}
                max-w-[80vw] sm:max-w-[40rem] min-w-[12rem] sm:min-w-[20rem] border border-neutral-200
              `}
              style={{
                width: "fit-content",
                maxHeight: "50vh",
                overflowY: "auto",
              }}
            >
              {children}
            </div>
          </div>,
          document.body
        )
      }
    </>
  );
}
