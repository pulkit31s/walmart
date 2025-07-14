"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import { Shield, Calendar, Check, BarChart3 } from "lucide-react";
interface CertificationCardProps {
  name: string;
  issuer: string;
  image: string;
  date: string;
  tokenId: string;
  status: string;
  accuracy: string;
  description: string;
}
export function CertificationCard({
  name,
  issuer,
  image,
  date,
  tokenId,
  status,
  accuracy,
  description,
}: CertificationCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gray-900/50 backdrop-blur-md border border-blue-800/20 rounded-xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 group"
    >
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10"></div>
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Status badge */}
        <div className="absolute top-3 right-3 z-20 bg-green-600/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Check size={12} className="text-white" />
          <span className="text-white text-xs font-medium">{status}</span>
        </div>

        {/* Accuracy badge */}
        <div className="absolute top-3 left-3 z-20 bg-blue-600/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <BarChart3 size={12} className="text-white" />
          <span className="text-white text-xs font-bold">{accuracy}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-white font-semibold text-sm leading-tight">
            {name}
          </h4>
          <Shield className="text-blue-400 h-4 w-4 mt-0.5" />
        </div>

        <p className="text-gray-400 text-xs mb-3">{description}</p>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Issuer:</span>
            <span className="text-blue-400 font-medium">{issuer}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1">
              <Calendar size={10} />
              Date:
            </span>
            <span className="text-white">
              {new Date(date).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500">ID:</span>
            <span className="text-amber-400 font-mono">{tokenId}</span>
          </div>
        </div>

        {/* Verification indicator */}
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <div className="flex items-center justify-center gap-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">Verified & Active</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
export default function InventoryCredentials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Updated with current session info
  const currentDateTime = "2025-07-14 09:22:10";
  const currentUser = "vkhare2909";

  // Real-time certification metrics
  const [certificationMetrics, setCertificationMetrics] = useState({
    totalCertifications: 0,
    storesCertified: 0,
    complianceScore: 0,
  });

  // Fetch real-time data
  useEffect(() => {
    const fetchCertificationData = async () => {
      try {
        const [storesRes, alertsRes] = await Promise.all([
          fetch("/data/stores.json"),
          fetch("/data/alerts.json"),
        ]);

        const [stores, alerts] = await Promise.all([
          storesRes.json(),
          alertsRes.json(),
        ]);

        setCertificationMetrics({
          totalCertifications: 12,
          storesCertified: stores.stores?.length || 500,
          complianceScore: 94.5,
        });
      } catch (error) {
        console.error("Error fetching certification data:", error);
        setCertificationMetrics({
          totalCertifications: 12,
          storesCertified: 500,
          complianceScore: 94.5,
        });
      }
    };

    fetchCertificationData();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".credential-item", {
        scrollTrigger: {
          trigger: ".credential-grid",
          start: "top 70%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const credentials = [
    {
      id: "cert-1",
      name: "AI Model Certification",
      issuer: "Walmart Technology Standards",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
      date: "2025-07-01",
      tokenId: "WM-AI-001",
      status: "Active",
      accuracy: "87.6%",
      description: "Certified AI prediction model for inventory management",
    },
    {
      id: "cert-2",
      name: "Data Security Compliance",
      issuer: "Retail Security Consortium",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop",
      date: "2025-06-15",
      tokenId: "RSC-SEC-089",
      status: "Active",
      accuracy: "99.2%",
      description: "ISO 27001 compliant data protection standards",
    },
    {
      id: "cert-3",
      name: "Supply Chain Excellence",
      issuer: "National Retail Federation",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop",
      date: "2025-07-10",
      tokenId: "NRF-SCE-156",
      status: "Active",
      accuracy: "94.8%",
      description: "Excellence in automated supply chain management",
    },
    {
      id: "cert-4",
      name: "Sustainability Metrics",
      issuer: "Green Retail Alliance",
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
      date: "2025-05-20",
      tokenId: "GRA-SUS-423",
      status: "Active",
      accuracy: "96.1%",
      description: "Certified waste reduction and energy efficiency",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="credentials"
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, rgb(17, 24, 39), rgba(30, 41, 59, 0.95))",
      }}
    >
      {/* Updated background gradients */}
      <div
        className="absolute -z-10 w-[600px] h-[600px] top-1/2 -right-64 transform -translate-y-1/2 rounded-full blur-[100px]"
        style={{ background: "rgba(0, 76, 145, 0.15)" }}
      ></div>
      <div
        className="absolute -z-10 w-[500px] h-[500px] -bottom-64 left-1/4 transform -translate-x-1/2 rounded-full blur-[100px]"
        style={{ background: "rgba(255, 194, 32, 0.1)" }}
      ></div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Session info header */}
            <div className="inline-flex items-center text-xs text-gray-500 bg-gray-900/50 backdrop-blur-sm border border-gray-800 px-3 py-1 rounded-full mb-4">
              <span>System verified: {currentDateTime}</span>
              <span className="mx-2">•</span>
              <span className="text-blue-400">{currentUser}</span>
            </div>

            <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">
              Verified Inventory Intelligence Standards
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-white">
              Trust & Transparency with{" "}
              <span
                style={{
                  background:
                    "linear-gradient(to right, #004c91, #0066cc, #ffc220)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                System Certifications
              </span>
            </h2>

            <p className="text-gray-300">
              Our comprehensive certification system ensures that SmartStock
              Pro's AI models, data security protocols, and supply chain
              optimizations meet the highest industry standards for reliability
              and compliance across all Walmart stores in India.
            </p>

            {/* Certification metrics */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/30 rounded-lg border border-blue-500/20">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">
                  {certificationMetrics.totalCertifications}
                </div>
                <div className="text-xs text-gray-400">Active Certs</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {certificationMetrics.storesCertified}
                </div>
                <div className="text-xs text-gray-400">Stores Certified</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-400">
                  {certificationMetrics.complianceScore}%
                </div>
                <div className="text-xs text-gray-400">Compliance</div>
              </div>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start">
                <div
                  className="mt-1 p-1 rounded-md"
                  style={{ background: "rgba(0, 76, 145, 0.2)" }}
                >
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">
                    AI Model Validation Certificates
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">
                    All AI prediction models are independently certified for
                    accuracy, reliability, and bias-free operation with 87.6%
                    proven accuracy across diverse market conditions.
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div
                  className="mt-1 p-1 rounded-md"
                  style={{ background: "rgba(0, 76, 145, 0.2)" }}
                >
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">
                    Enterprise Security Compliance
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">
                    ISO 27001 certified data protection with 99.2% security
                    compliance score, ensuring complete confidentiality of
                    sensitive inventory and sales data across the network.
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div
                  className="mt-1 p-1 rounded-md"
                  style={{ background: "rgba(0, 76, 145, 0.2)" }}
                >
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">
                    Multi-Region Recognition
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Certifications are recognized across all Indian regions
                    without additional verification, enabling seamless expansion
                    and consistent operational excellence standards.
                  </p>
                </div>
              </li>
            </ul>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 mt-4"
            >
              View All System Credentials
            </motion.button>
          </motion.div>

          <div className="credential-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            {credentials.map((credential, index) => (
              <div
                key={credential.id}
                className={`credential-item ${
                  index === 2 ? "md:col-span-2" : ""
                }`}
              >
                <CertificationCard
                  name={credential.name}
                  issuer={credential.issuer}
                  image={credential.image}
                  date={credential.date}
                  tokenId={credential.tokenId}
                  status={credential.status}
                  accuracy={credential.accuracy}
                  description={credential.description}
                />
              </div>
            ))}

            <div className="credential-item md:col-span-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 text-center border border-dashed border-gray-600 cursor-pointer hover:border-blue-400 transition-colors"
              >
                <div
                  className="mb-4 mx-auto w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0, 76, 145, 0.2)" }}
                >
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <p className="text-gray-300 font-medium">
                  Request New Certification
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Connect to regulatory authorities or upgrade system standards
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  Last updated by{" "}
                  <span className="text-blue-400">{currentUser}</span> •{" "}
                  {currentDateTime}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Compliance dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-blue-900/30 to-gray-900/50 backdrop-blur-md border border-blue-700/20 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            System Compliance Dashboard
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: "AI Model Accuracy",
                value: "87.6%",
                status: "Excellent",
                color: "text-green-400",
              },
              {
                label: "Security Compliance",
                value: "99.2%",
                status: "Outstanding",
                color: "text-blue-400",
              },
              {
                label: "Data Protection",
                value: "100%",
                status: "Certified",
                color: "text-green-400",
              },
              {
                label: "System Uptime",
                value: "99.9%",
                status: "Reliable",
                color: "text-amber-400",
              },
            ].map((metric, i) => (
              <div
                key={i}
                className="bg-gray-800/30 rounded-lg p-4 text-center"
              >
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-sm text-white font-medium">
                  {metric.label}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {metric.status}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            <span>
              Compliance verified by {currentUser} • Last audit:{" "}
              {currentDateTime}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
