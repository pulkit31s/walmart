"use client";
import { useRef, useEffect, useState, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

import Layout from "../components/layout/Layout";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import HowItWorks from "../components/sections/HowItWorks";
import CareerVisualization from "../components/sections/CareerVisualisation";
import BlockchainCredentials from "../components/sections/BlockchainCredentials";
import Testimonials from "../components/sections/Testimonials";
import CTA from "../components/sections/CTA";
import FloatingElements from "../components/effects/FloatingElements";
import LoadingSpinner from "../components/ui/LoadingScreen";
import CanvasLoader from "../components/3d/Loading";
import Girl from "../components/3d/Girl";
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const [loading, setLoading] = useState(true);

  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.97]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-in", {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".fade-in",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.utils.toArray(".section").forEach((section: any, i) => {
        gsap.from(section, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <Layout>
      <div ref={containerRef} className="relative overflow-hidden">
        <motion.div
          style={{ opacity, scale }}
          className="fixed inset-0 pointer-events-none z-0"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 30%, rgba(79, 70, 229, 0.2) 0%, rgba(17, 24, 39, 0.95) 50%, rgba(10, 15, 30, 1) 100%)",
              mixBlendMode: "normal",
            }}
          />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        </motion.div>

        <div className="section">
          <Hero />
        </div>

        <div className="section">
          <Features />
        </div>
        <div className="section">
          <HowItWorks />
        </div>
        <div className="section">
          <CareerVisualization />
        </div>
        <div className="section">
          <BlockchainCredentials />
        </div>
        <div className="section">
          <Testimonials />
        </div>
        <div className="section">
          <CTA />
        </div>
      </div>{" "}
    </Layout>
  );
}
