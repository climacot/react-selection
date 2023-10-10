import { useEffect, useState, useRef } from "react";

interface IArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface IProps {
  borderWidth?: number;
  scale?: number;
}

export const useSelection = ({ borderWidth = 2, scale = 1 }: IProps) => {
  const [handling, setHandling] = useState(false);

  const initp = useRef({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement | null>(null);
  const areaRef = useRef<IArea | null>(null);

  useEffect(() => {
    const elementRef = ref.current;

    if (elementRef && !selectionRef.current) {
      const element = document.createElement("div");
      elementRef.appendChild(element);
      selectionRef.current = element;
    }
  }, []);

  useEffect(() => {
    const mousemove = (event: MouseEvent) => {
      const elementRef = scrollRef.current;

      if (handling && elementRef) {
        const rect = elementRef.getBoundingClientRect();

        const scrollSpeed = 5;
        const scrollArea = 100;

        if (event.clientX < rect.left + scrollArea) {
          elementRef.scrollLeft -= scrollSpeed;
        } else if (event.clientX > rect.right - scrollArea) {
          elementRef.scrollLeft += scrollSpeed;
        }
        if (event.clientY < rect.top + scrollArea) {
          elementRef.scrollTop -= scrollSpeed;
        } else if (event.clientY > rect.bottom - scrollArea) {
          elementRef.scrollTop += scrollSpeed;
        }
      }
    };

    window.addEventListener("mousemove", mousemove);

    return () => {
      window.removeEventListener("mousemove", mousemove);
    };
  }, [handling]);

  useEffect(() => {
    const mousedown = (event: MouseEvent) => {
      const elementRef = ref.current;

      if (elementRef && elementRef.contains(event.target as Node)) {
        const rect = elementRef.getBoundingClientRect();

        initp.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };

        setHandling(true);
      }
    };

    const mousemove = (event: MouseEvent) => {
      const elementRef = ref.current;
      const overlayRef = selectionRef.current;

      if (handling && elementRef && overlayRef) {
        const rect = elementRef.getBoundingClientRect();

        const clientX = event.clientX;
        const clientY = event.clientY;
        const leftCondition = clientX < rect.left;
        const rightCondition = clientX > rect.right;
        const topCondition = clientY < rect.top;
        const bottomCondition = clientY > rect.bottom;

        const X = leftCondition
          ? 0
          : rightCondition
          ? rect.width
          : clientX - rect.left;

        const Y = topCondition
          ? 0
          : bottomCondition
          ? rect.height
          : clientY - rect.top;

        const height = Math.abs(Y - initp.current.y);
        const width = Math.abs(X - initp.current.x);
        const left = Math.min(initp.current.x, X);
        const top = Math.min(initp.current.y, Y);

        areaRef.current = {
          x: left / scale,
          y: top / scale,
          width: width / scale,
          height: height / scale,
        };

        elementRef.style.position = "relative";
        elementRef.style.height = "fit-content";
        elementRef.style.width = "fit-content";
        overlayRef.style.position = "absolute";
        overlayRef.style.userSelect = "none";
        overlayRef.style.backgroundColor = "rgba(51, 130, 255, 0.2)";
        overlayRef.style.border = `${borderWidth}px solid #3382ff`;
        overlayRef.style.height = `${height}px`;
        overlayRef.style.width = `${width}px`;
        overlayRef.style.left = `${left - borderWidth}px`;
        overlayRef.style.top = `${top - borderWidth}px`;
      }
    };

    const mouseup = () => {
      setHandling(false);
    };

    const overlayRef = selectionRef.current;
    const m = areaRef.current;

    if (overlayRef && m) {
      overlayRef.style.height = `${m.height * scale}px`;
      overlayRef.style.width = `${m.width * scale}px`;
      overlayRef.style.left = `${m.x * scale - borderWidth}px`;
      overlayRef.style.top = `${m.y * scale - borderWidth}px`;
    }

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mousedown", mousedown);
    window.addEventListener("mouseup", mouseup);

    return () => {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mousedown", mousedown);
      window.removeEventListener("mouseup", mouseup);
    };
  }, [borderWidth, scale, handling]);

  return {
    ref,
    scrollRef,
    area: areaRef.current,
  };
};
