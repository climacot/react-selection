import { useEffect, useState, useRef } from "react";

interface IArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const useSelection = () => {
  // States
  const [handling, setHandling] = useState(false);

  // Refs
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
          x: left,
          y: left,
          width: width,
          height: height,
        };

        elementRef.style.position = "relative";
        overlayRef.style.userSelect = "none";
        overlayRef.style.position = "absolute";
        overlayRef.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
        overlayRef.style.height = `${height}px`;
        overlayRef.style.width = `${width}px`;
        overlayRef.style.left = `${left}px`;
        overlayRef.style.top = `${top}px`;
      }
    };

    const mouseup = () => {
      setHandling(false);
    };

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mousedown", mousedown);
    window.addEventListener("mouseup", mouseup);

    return () => {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mousedown", mousedown);
      window.removeEventListener("mouseup", mouseup);
    };
  }, [handling]);

  return {
    ref,
    scrollRef,
    area: areaRef.current,
  };
};
