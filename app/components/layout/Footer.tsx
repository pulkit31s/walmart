import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";
import {
  Package,
  Store,
  Target,
  Shield,
  Activity,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const currentDateTime = "2025-07-14 10:27:40";
  const currentUser = "vkhare2909";

  return (
    <footer className="relative z-10 mt-20">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent -z-10" />

      {/* Walmart-themed decorative elements */}
      <div className="absolute left-0 bottom-0 h-32 w-32 opacity-10 -z-5">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <path
            d="M20,80 Q40,60 30,40 Q20,20 40,10"
            stroke="#004c91"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M30,40 Q40,35 50,40"
            stroke="#004c91"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M35,30 Q45,35 55,30"
            stroke="#ffc220"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
      <div className="absolute right-0 bottom-0 h-32 w-32 opacity-10 -z-5">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <path
            d="M80,80 Q60,60 70,40 Q80,20 60,10"
            stroke="#004c91"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M70,40 Q60,35 50,40"
            stroke="#004c91"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M65,30 Q55,35 45,30"
            stroke="#ffc220"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 pt-16 pb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
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
            <p className="text-gray-400 text-sm">
              AI-powered inventory intelligence platform preventing ₹45+ Crores
              in losses through predictive analytics and automated crisis
              management across 500+ Walmart stores in India.
            </p>
            <div className="flex items-center space-x-4">
              <motion.a
                whileHover={{ y: -4 }}
                href="#"
                className="text-gray-400 hover:text-[#1DA1F2] transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -4 }}
                href="#"
                className="text-gray-400 hover:text-[#0A66C2] transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -4 }}
                href="#"
                className="text-gray-400 hover:text-[#4267B2] transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -4 }}
                href="#"
                className="text-gray-400 hover:text-[#E1306C] transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -4 }}
                href="#"
                className="text-gray-400 hover:text-[#004c91] transition-colors duration-300"
                aria-label="Email"
              >
                <FaEnvelope size={20} />
              </motion.a>
            </div>
          </div>

          {/* Inventory Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Inventory Intelligence
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/store-analytics"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <Store className="w-4 h-4" />
                  Store Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-predictions"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  AI Predictions
                </Link>
              </li>
              <li>
                <Link
                  href="/crisis-management"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Crisis Management
                </Link>
              </li>
              <li>
                <Link
                  href="/network-map"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Network Mapping
                </Link>
              </li>
              <li>
                <Link
                  href="/roi-calculator"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  ROI Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  About SmartStock Pro
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Success Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/technology"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  AI Technology
                </Link>
              </li>
              <li>
                <Link
                  href="/integrations"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  System Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="/enterprise"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Enterprise Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Support & Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/documentation"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/api-reference"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Technical Support
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Security & Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  System Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regional Coverage */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Link
            href="/regions/north-india"
            className="flex items-center justify-center py-3 px-4 bg-gray-800/50 rounded-lg text-sm text-gray-300 hover:bg-blue-900/20 hover:text-white transition-colors border border-transparent hover:border-blue-500/30"
          >
            <span className="mr-2">🏪</span> North India
            <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
              125 stores
            </span>
          </Link>
          <Link
            href="/regions/south-india"
            className="flex items-center justify-center py-3 px-4 bg-gray-800/50 rounded-lg text-sm text-gray-300 hover:bg-blue-900/20 hover:text-white transition-colors border border-transparent hover:border-blue-500/30"
          >
            <span className="mr-2">🏪</span> South India
            <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
              140 stores
            </span>
          </Link>
          <Link
            href="/regions/west-india"
            className="flex items-center justify-center py-3 px-4 bg-gray-800/50 rounded-lg text-sm text-gray-300 hover:bg-blue-900/20 hover:text-white transition-colors border border-transparent hover:border-blue-500/30"
          >
            <span className="mr-2">🏪</span> West India
            <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
              160 stores
            </span>
          </Link>
          <Link
            href="/regions/east-india"
            className="flex items-center justify-center py-3 px-4 bg-gray-800/50 rounded-lg text-sm text-gray-300 hover:bg-blue-900/20 hover:text-white transition-colors border border-transparent hover:border-blue-500/30"
          >
            <span className="mr-2">🏪</span> East India
            <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
              75 stores
            </span>
          </Link>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">87.6%</div>
            <div className="text-sm text-gray-400">AI Accuracy</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">₹45+ Cr</div>
            <div className="text-sm text-gray-400">Revenue Protected</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-400">500+</div>
            <div className="text-sm text-gray-400">Active Stores</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-amber-500/20">
            <div className="text-2xl font-bold text-amber-400">99.9%</div>
            <div className="text-sm text-gray-400">System Uptime</div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm"
          >
            <div className="flex items-center gap-4">
              <p>&copy; {currentYear} SmartStock Pro. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">LIVE</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center mt-4 md:mt-0 gap-2">
              <span className="px-3 py-1.5 bg-gray-800/50 rounded-md flex items-center gap-2">
                <Users className="w-3 h-3 text-blue-400" />
                <span className="font-medium text-blue-400">User:</span>
                <span className="text-white">{currentUser}</span>
              </span>
              <span className="px-3 py-1.5 bg-gray-800/50 rounded-md flex items-center gap-2">
                <Activity className="w-3 h-3 text-green-400" />
                <span className="font-medium text-green-400">UTC:</span>
                <span className="text-white">{currentDateTime}</span>
              </span>
              <span className="px-3 py-1.5 bg-gray-800/50 rounded-md flex items-center gap-2">
                <Target className="w-3 h-3 text-purple-400" />
                <span className="font-medium text-purple-400">v2.1.4</span>
              </span>
            </div>
          </motion.div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center mt-6 gap-4 text-xs text-gray-500">
            <Link
              href="/privacy"
              className="hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/terms"
              className="hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              href="/security"
              className="hover:text-blue-400 transition-colors"
            >
              Security Policy
            </Link>
            <span>•</span>
            <Link
              href="/compliance"
              className="hover:text-blue-400 transition-colors"
            >
              Compliance
            </Link>
            <span>•</span>
            <Link
              href="/cookies"
              className="hover:text-blue-400 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center mt-8"
          >
            <Link
              href="/emergency-support"
              className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-red-600/20 to-orange-600/20 hover:from-red-600/30 hover:to-orange-600/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 group"
            >
              <AlertTriangle className="h-4 w-4 text-red-400 mr-2 group-hover:animate-pulse" />
              <span className="text-sm text-red-300 group-hover:text-red-200">
                24/7 Crisis Support
              </span>
              <Zap className="h-4 w-4 text-red-400 ml-2" />
            </Link>
          </motion.div>

          {/* Powered by Section */}
          <div className="text-center mt-8 pt-6 border-t border-gray-800/50">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>Powered by</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
                <span className="text-blue-400 font-medium">Gemini AI</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-blue-500 rounded"></div>
                <span className="text-green-400 font-medium">
                  Real-time Analytics
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-amber-500 to-red-500 rounded"></div>
                <span className="text-amber-400 font-medium">
                  Predictive Intelligence
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
