"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  ChevronDown,
  ExternalLink,
  Package,
  Target,
  BarChart3,
  Store,
  Activity,
  Users,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Zap,
  Brain,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ScrollProgress from "../ui/ScrollProgress";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState("2025-07-14 10:24:40");
  const [currentUser, setCurrentUser] = useState("vkhare2909");
  const pathname = usePathname();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const formatted = now.toISOString().replace("T", " ").substring(0, 19);
      setCurrentDateTime(formatted);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "Inventory Intelligence",
      href: "#",
      children: [
        {
          title: "Store Analytics",
          href: "/store-analytics",
          description: "Real-time store performance and health monitoring",
          icon: <Store className="h-5 w-5 text-blue-400" />,
        },
        {
          title: "AI Predictions",
          href: "/predictions",
          description: "Advanced demand forecasting and stockout prevention",
          icon: <Target className="h-5 w-5 text-purple-400" />,
        },
        {
          title: "Crisis Management",
          href: "/crisis-management",
          description: "Automated crisis detection and response system",
          icon: <AlertTriangle className="h-5 w-5 text-red-400" />,
        },
        {
          title: "ROI Calculator",
          href: "/roi-calculator",
          description: "Business impact analysis and investment planning",
          icon: <DollarSign className="h-5 w-5 text-green-400" />,
        },
      ],
    },
    { name: "Network Map", href: "/network-map" },
    { name: "Reports", href: "/reports" },
    {
      name: "Operations",
      href: "#",
      children: [
        {
          title: "Supply Chain",
          href: "/supply-chain",
          description: "End-to-end supply chain visibility and optimization",
          icon: <Package className="h-5 w-5 text-blue-400" />,
        },
        {
          title: "Team Management",
          href: "/team-management",
          description: "Store teams and operational workforce management",
          icon: <Users className="h-5 w-5 text-green-400" />,
        },
        {
          title: "Performance Hub",
          href: "/performance",
          description: "KPI tracking and performance optimization tools",
          icon: <Activity className="h-5 w-5 text-amber-400" />,
        },
        {
          title: "AI Insights",
          href: "/ai-insights",
          description: "Machine learning powered business intelligence",
          icon: <Brain className="h-5 w-5 text-purple-400" />,
        },
      ],
    },
    {
      name: "Settings",
      href: "#",
      children: [
        {
          title: "System Configuration",
          href: "/system-config",
          description: "Platform settings and customization options",
          icon: <Zap className="h-5 w-5 text-blue-400" />,
        },
        {
          title: "Security Center",
          href: "/security",
          description: "Access control and security management",
          icon: <Shield className="h-5 w-5 text-green-400" />,
        },
        {
          title: "Data Management",
          href: "/data-management",
          description: "Data sources, quality, and integration settings",
          icon: <BarChart3 className="h-5 w-5 text-amber-400" />,
        },
      ],
    },
  ];

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const dropdownItemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${
          scrolled
            ? "bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-blue-500/20"
            : "bg-transparent"
        }`}
        style={{
          boxShadow: scrolled ? "0 4px 30px rgba(0, 76, 145, 0.1)" : "none",
        }}
      >
        <ScrollProgress />
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Package className="text-white h-5 w-5" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span
                className="text-xl font-bold leading-tight"
                style={{
                  background:
                    "linear-gradient(to right, #004c91, #0066cc, #ffc220)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                SmartStock Pro
              </span>
              <span className="text-xs text-gray-400 leading-tight">
                Walmart Intelligence
              </span>
            </div>
          </Link>

          {/* Main Navigation */}
          <motion.nav
            className="hidden lg:block"
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.ul className="flex items-center space-x-8">
              {navigation.map((item) => (
                <motion.li key={item.name} variants={itemVariants}>
                  {item.children ? (
                    <div className="relative group">
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        onMouseEnter={() => setActiveDropdown(item.name)}
                        className={`text-sm font-medium flex items-center gap-1 relative transition-colors duration-300 ${
                          activeDropdown === item.name
                            ? "text-blue-400"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            activeDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                        {/* Active indicator */}
                        {activeDropdown === item.name && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-400"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            exit={{ scaleX: 0 }}
                          />
                        )}
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute left-0 mt-3 w-80 rounded-xl border border-blue-700/30 bg-gray-900/90 backdrop-blur-xl shadow-xl overflow-hidden"
                            onMouseLeave={() => setActiveDropdown(null)}
                            style={{
                              boxShadow:
                                "0 15px 25px -5px rgba(0, 76, 145, 0.2), 0 10px 10px -5px rgba(0, 76, 145, 0.1)",
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 z-0"></div>
                            <div className="relative z-10">
                              {/* Dropdown Header */}
                              <div className="px-4 py-3 border-b border-gray-700/30 bg-blue-900/20">
                                <h3 className="text-sm font-semibold text-blue-400">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">
                                  {item.name === "Inventory Intelligence"
                                    ? "AI-powered inventory management tools"
                                    : item.name === "Operations"
                                    ? "Operational excellence and team management"
                                    : "System configuration and security"}
                                </p>
                              </div>

                              <div className="px-1 py-1">
                                {item.children.map((child) => (
                                  <motion.div
                                    key={child.title}
                                    variants={dropdownItemVariants}
                                  >
                                    <Link
                                      href={child.href}
                                      onClick={() => setActiveDropdown(null)}
                                      className="block rounded-lg m-1 p-3 hover:bg-blue-500/10 transition-all duration-200 hover:scale-[1.02] group/item border border-transparent hover:border-blue-500/20"
                                    >
                                      <div className="flex items-start">
                                        <div className="mr-3 mt-0.5 p-1.5 bg-gray-800/50 rounded-md">
                                          {child.icon}
                                        </div>
                                        <div className="flex-1">
                                          <div className="font-medium text-white text-sm flex items-center justify-between">
                                            {child.title}
                                            <ExternalLink className="h-3 w-3 opacity-0 group-hover/item:opacity-100 transition-opacity text-gray-400" />
                                          </div>
                                          {child.description && (
                                            <div className="text-xs text-gray-400 mt-1 group-hover/item:text-gray-300 transition-colors">
                                              {child.description}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </Link>
                                  </motion.div>
                                ))}
                              </div>

                              {/* Dropdown Footer */}
                              <div className="mt-1 px-3 py-3 bg-gray-800/50 border-t border-gray-700/30">
                                <Link
                                  href={`/${item.name
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                  className="text-xs flex items-center justify-between text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                  <span>
                                    View all {item.name.toLowerCase()}
                                  </span>
                                  <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-sm font-medium relative transition-colors duration-300 ${
                        pathname === item.href
                          ? "text-blue-400"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {item.name}
                      {pathname === item.href && (
                        <motion.span
                          layoutId="underline"
                          className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-blue-400"
                        />
                      )}
                    </Link>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Session Info */}
            <div className="hidden lg:block text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">LIVE</span>
              </div>
              <div className="text-right">{currentDateTime}</div>
              <div className="text-right text-blue-400 font-medium">
                {currentUser}
              </div>
            </div>

            {/* System Status */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full border border-green-500/20">
              <Activity className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400 font-medium">99.9%</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/alerts"
                className="hidden sm:flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all duration-300 px-3 py-2 rounded-full text-sm relative"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Alerts</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              </Link>

              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 px-4 py-2 rounded-full text-sm"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative inline-block"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </span>
                  <span className="absolute inset-0 bg-white/20 rounded-full blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </motion.span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white p-2 rounded-full hover:bg-blue-500/10 transition-colors duration-300 border border-blue-500/20"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="lg:hidden fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-lg pt-24"
          >
            <nav className="container mx-auto px-6 py-8">
              <ul className="space-y-6">
                {navigation.map((item) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.children ? (
                      <div className="space-y-3">
                        <button
                          className={`flex items-center text-lg font-medium transition-colors duration-300 ${
                            activeDropdown === item.name
                              ? "text-blue-400"
                              : "text-gray-300 hover:text-white"
                          }`}
                          onClick={() => toggleDropdown(item.name)}
                        >
                          {item.name}
                          <ChevronDown
                            className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                              activeDropdown === item.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {activeDropdown === item.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 flex flex-col gap-4 border-l border-blue-700/30 mt-4">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.title}
                                    href={child.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/60 transition-colors border border-blue-500/10 hover:border-blue-500/30"
                                  >
                                    <div className="flex items-start">
                                      <div className="mr-3 mt-0.5 p-1 bg-blue-500/10 rounded">
                                        {child.icon}
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-white">
                                          {child.title}
                                        </div>
                                        {child.description && (
                                          <div className="text-xs text-gray-400 mt-1">
                                            {child.description}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`text-lg font-medium block py-2 transition-colors duration-300 ${
                          pathname === item.href
                            ? "text-blue-400"
                            : "text-gray-300 hover:text-white"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </motion.li>
                ))}

                {/* Mobile Action Buttons */}
                <div className="pt-6 space-y-4 border-t border-gray-800 mt-6">
                  <Link
                    href="/alerts"
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors duration-300 px-4 py-3 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Critical Alerts
                  </Link>
                  <Link
                    href="/admin"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 px-4 py-3 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                </div>
              </ul>

              {/* Mobile Session Info */}
              <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                <div className="text-xs text-gray-400 space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400">System Online</span>
                  </div>
                  <div>{currentDateTime}</div>
                  <div className="text-blue-400 font-medium">{currentUser}</div>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes hover-effect {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
          100% {
            transform: translateY(0);
          }
        }

        a:hover {
          animation: hover-effect 0.5s ease;
        }

        /* Walmart-themed shimmer effect */
        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* Blue glow effect for dropdowns */
        .dropdown-glow:hover {
          box-shadow: 0 0 15px rgba(0, 76, 145, 0.3);
        }

        /* Pulsing animation for live indicators */
        @keyframes pulse-blue {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .pulse-blue {
          animation: pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}
