"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

type FloatingElementsProps = {
  count?: number;
  minSize?: number;
  maxSize?: number;
  minOpacity?: number;
  maxOpacity?: number;
  colors?: string[];
};

const FloatingElements = ({
  count = 15,
  minSize = 10,
  maxSize = 60,
  minOpacity = 0.01,
  maxOpacity = 0.05,
  colors = ["255, 255, 255"],
}: FloatingElementsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements: HTMLDivElement[] = [];

    for (let i = 0; i < count; i++) {
      const element = document.createElement("div");
      const size = Math.random() * (maxSize - minSize) + minSize;
      const colorIndex = Math.floor(Math.random() * colors.length);
      const opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;

      element.className = "absolute rounded-full";
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.background = `rgba(${colors[colorIndex]}, ${opacity})`;
      element.style.top = `${Math.random() * 100}vh`;
      element.style.left = `${Math.random() * 100}vw`;

      container.appendChild(element);
      elements.push(element);
    }

    elements.forEach((element, index) => {
      gsap.to(element, {
        x: `random(-100, 100)`,
        y: `random(-100, 100)`,
        duration: gsap.utils.random(20, 40),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(element, {
        opacity: gsap.utils.random(minOpacity, maxOpacity * 2),
        duration: gsap.utils.random(5, 10),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.1,
      });
    });

    setIsInitialized(true);

    return () => {
      elements.forEach((element) => {
        gsap.killTweensOf(element);
        if (element.parentNode === container) {
          container.removeChild(element);
        }
      });
    };
  }, [count, minSize, maxSize, minOpacity, maxOpacity, colors]);

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      />
    </>
  );
};

export default FloatingElements;
