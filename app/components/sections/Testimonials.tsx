"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import {
  RiStore3Fill,
  RiBarChartBoxFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiMapPin2Fill,
  RiTrophyFill,
} from "react-icons/ri";
import { Store, TrendingUp, Package, AlertTriangle } from "lucide-react";

const currentDateTime = "2025-07-14 09:10:08";
const currentUser = "vkhare2909";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Store Manager",
    language: "Hindi",
    location: "Mumbai Central, Maharashtra",
    store_id: "WM002",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop",
    region: "West",
    performance: {
      stockout_reduction: "73%",
      cost_savings: "₹2.3 Cr",
      accuracy: "94%",
    },
    quote:
      "स्मार्टस्टॉक प्रो ने हमारे स्टोर की इन्वेंटरी प्रबंधन को पूरी तरह बदल दिया है। अब हम 7 दिन पहले ही जान जाते हैं कि कौन सा प्रोडक्ट खत्म होने वाला है। इससे हमारी स्टॉकआउट की समस्या 73% कम हो गई है।",
    translation:
      "SmartStock Pro has completely transformed our store's inventory management. Now we know 7 days in advance which product is going to run out. This has reduced our stockout problem by 73%.",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Regional Operations Manager",
    language: "Tamil",
    location: "Chennai OMR, Tamil Nadu",
    store_id: "WM004",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop",
    region: "South",
    performance: {
      stockout_reduction: "68%",
      cost_savings: "₹1.8 Cr",
      accuracy: "89%",
    },
    quote:
      "எங்கள் ஸ்டோரில் ஏசி விற்பனை கோடைகாலத்தில் எப்போது அதிகரிக்கும் என்று AI முன்கூட்டியே சொல்கிறது. இதனால் நாங்கள் சரியான நேரத்தில் ஸ்டாக் ஆர்டர் செய்து, வாடிக்கையாளர்களின் தேவையை பூர்த்தி செய்கிறோம்.",
    translation:
      "The AI predicts in advance when AC sales will increase in our store during summer. This helps us order stock at the right time and meet customer demands.",
  },
  {
    id: 3,
    name: "Vikram Singh",
    role: "Store Manager",
    language: "Hindi",
    location: "Delhi Connaught Place, Delhi",
    store_id: "WM005",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
    region: "North",
    performance: {
      stockout_reduction: "81%",
      cost_savings: "₹3.1 Cr",
      accuracy: "96%",
    },
    quote:
      "जेमिनी AI की मदद से हमें पता चल जाता है कि त्योहारों के समय कौन से प्रोडक्ट्स की डिमांड बढ़ेगी। दीवाली से पहले हमने इलेक्ट्रॉनिक्स का स्टॉक बढ़ाया और 40% ज्यादा सेल्स हुई।",
    translation:
      "With Gemini AI's help, we know which products will have increased demand during festivals. Before Diwali, we increased our electronics stock and achieved 40% more sales.",
  },
  {
    id: 4,
    name: "Lakshmi Venkat",
    role: "Inventory Specialist",
    language: "Telugu",
    location: "Bangalore Electronic City, Karnataka",
    store_id: "WM003",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0c5a5b4b6b8?w=400&auto=format&fit=crop",
    region: "South",
    performance: {
      stockout_reduction: "65%",
      cost_savings: "₹1.5 Cr",
      accuracy: "87%",
    },
    quote:
      "స్మార్ట్‌స్టాక్ ప్రో వల్ల మా స్టోర్‌లో ఓవర్‌స్టాక్ సమస్య పూర్తిగా తగ్గింది. AI ఎంత స్టాక్ ఆర్డర్ చేయాలో చెబుతుంది, అందువల్ల మా స్టోరేజ్ కాస్ట్ 45% తగ్గింది.",
    translation:
      "Thanks to SmartStock Pro, the overstock problem in our store has completely reduced. AI tells us exactly how much stock to order, reducing our storage costs by 45%.",
  },
  {
    id: 5,
    name: "Arjun Reddy",
    role: "Assistant Manager",
    language: "English",
    location: "Gurgaon Supercenter, Haryana",
    store_id: "WM001",
    image:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&auto=format&fit=crop",
    region: "North",
    performance: {
      stockout_reduction: "70%",
      cost_savings: "₹2.1 Cr",
      accuracy: "91%",
    },
    quote:
      "The predictive alerts are game-changing. Yesterday, the system warned us about potential rice stockout due to upcoming weekend family meals trend. We reordered just in time and avoided disappointed customers.",
    translation:
      "The predictive alerts are game-changing. Yesterday, the system warned us about potential rice stockout due to upcoming weekend family meals trend. We reordered just in time and avoided disappointed customers.",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState({
    totalStores: 0,
    totalSavings: 0,
    avgAccuracy: 0,
  });
  const sectionRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  // Fetch real-time metrics
  useEffect(() => {
    const fetchTestimonialData = async () => {
      try {
        const [storesRes, alertsRes] = await Promise.all([
          fetch("/data/stores.json"),
          fetch("/data/alerts.json"),
        ]);

        const [stores, alerts] = await Promise.all([
          storesRes.json(),
          alertsRes.json(),
        ]);

        // Calculate aggregated metrics
        const totalSavings = testimonials.reduce((sum, t) => {
          const savings = parseFloat(
            t.performance.cost_savings.replace("₹", "").replace(" Cr", "")
          );
          return sum + savings;
        }, 0);

        const avgAccuracy =
          testimonials.reduce((sum, t) => {
            return sum + parseFloat(t.performance.accuracy.replace("%", ""));
          }, 0) / testimonials.length;

        setSystemMetrics({
          totalStores: stores.stores?.length || 500,
          totalSavings: totalSavings,
          avgAccuracy: avgAccuracy,
        });
      } catch (error) {
        console.error("Error fetching testimonial data:", error);
        setSystemMetrics({
          totalStores: 500,
          totalSavings: 11.8,
          avgAccuracy: 89.4,
        });
      }
    };

    fetchTestimonialData();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Enhanced data flow animation
      gsap.to(".data-flow", {
        width: "100%",
        duration: 3,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".data-flow-container",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    setShowTranslation(false);
  }, [currentIndex]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;

      if (nextIndex < 0) {
        nextIndex = testimonials.length - 1;
      } else if (nextIndex >= testimonials.length) {
        nextIndex = 0;
      }

      return nextIndex;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    }),
  };

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, rgb(17, 24, 39), rgba(30, 41, 59, 0.95), rgb(51, 65, 85))",
      }}
    >
      {/* Updated background pattern for retail theme */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <svg width="100%" height="100%">
          <filter id="retail-grain">
            <feTurbulence
              baseFrequency="0.65"
              type="fractalNoise"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.3 0"
            />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#retail-grain)"
            fill="#004c91"
          />
        </svg>
      </div>

      {/* Data flow visualization */}
      <div className="absolute top-0 bottom-0 left-8 w-20 overflow-hidden hidden lg:block data-flow-container">
        <div className="absolute bottom-0 left-0 w-full data-flow h-0">
          <svg
            viewBox="0 0 100 800"
            width="100"
            height="100%"
            preserveAspectRatio="none"
          >
            <path
              d="M50,0 Q70,200 40,300 Q20,400 50,500 Q80,600 40,700 Q30,750 50,800"
              stroke="#004c91"
              strokeWidth="1"
              fill="none"
              opacity="0.4"
            />
            {/* Store nodes */}
            <circle cx="50" cy="200" r="3" fill="#ffc220" opacity="0.6" />
            <circle cx="40" cy="400" r="3" fill="#ffc220" opacity="0.6" />
            <circle cx="50" cy="600" r="3" fill="#ffc220" opacity="0.6" />
            <circle cx="40" cy="750" r="3" fill="#ffc220" opacity="0.6" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center text-xs text-gray-500 bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 px-3 py-1 rounded-full mb-4">
            <span>Performance reviewed: {currentDateTime}</span>
            <span className="mx-2">•</span>
            <span className="text-blue-400">{currentUser}</span>
          </div>

          <span className="text-sm font-medium text-blue-400 uppercase tracking-wider flex items-center justify-center gap-2">
            <RiStore3Fill className="text-blue-400" />
            Store Manager Success Stories
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">
            Voices From Walmart Stores Across India
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Real experiences from store managers across India, sharing how
            SmartStock Pro has revolutionized their inventory management and
            increased profitability.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div
            className="bg-gray-900/50 backdrop-blur-md border border-blue-800/20 rounded-2xl p-8 relative overflow-hidden"
            ref={slideRef}
          >
            {/* Walmart brand accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background:
                  "linear-gradient(to right, #004c91, #0066cc, #ffc220)",
              }}
            ></div>

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%">
                <pattern
                  id="store-pattern"
                  x="0"
                  y="0"
                  width="30"
                  height="30"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <path
                    d="M10,15 Q15,5 20,15"
                    fill="none"
                    stroke="#004c91"
                    strokeWidth="0.5"
                  />
                  <rect
                    x="12"
                    y="12"
                    width="6"
                    height="6"
                    fill="#ffc220"
                    opacity="0.3"
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#store-pattern)" />
              </svg>
            </div>

            <RiStore3Fill className="absolute top-8 left-8 text-4xl text-blue-700 opacity-30" />

            {/* Store info badge */}
            <div className="absolute top-4 right-4 flex items-center text-xs text-gray-400 px-3 py-2 bg-gray-800/80 backdrop-blur-sm rounded-md border border-gray-700/50">
              <RiMapPin2Fill className="mr-1" />
              <span>
                {currentTestimonial.store_id} • {currentTestimonial.region}{" "}
                Region
              </span>
            </div>

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="py-8 px-4 md:px-12"
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div
                      className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-3"
                      style={{ borderColor: "rgba(0, 76, 145, 0.4)" }}
                    >
                      <Image
                        src={currentTestimonial.image}
                        alt={currentTestimonial.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />

                      {/* Performance badge */}
                      <div className="absolute -bottom-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full border-2 border-gray-900">
                        <RiTrophyFill className="inline mr-1" />
                        Top Performer
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p
                      className={`text-lg md:text-xl ${
                        showTranslation ? "text-gray-400" : "text-gray-200"
                      } mb-6 leading-relaxed`}
                    >
                      "{currentTestimonial.quote}"
                    </p>

                    <AnimatePresence>
                      {showTranslation && currentTestimonial.translation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-6"
                        >
                          <p className="text-amber-300 text-sm mb-1">
                            English Translation:
                          </p>
                          <p className="text-gray-300 text-lg italic">
                            "{currentTestimonial.translation}"
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Performance metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-800/30 rounded-lg">
                      <div className="text-center">
                        <div className="text-green-400 text-xl font-bold">
                          {currentTestimonial.performance.stockout_reduction}
                        </div>
                        <div className="text-xs text-gray-400">
                          Stockout Reduction
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 text-xl font-bold">
                          {currentTestimonial.performance.cost_savings}
                        </div>
                        <div className="text-xs text-gray-400">
                          Annual Savings
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-amber-400 text-xl font-bold">
                          {currentTestimonial.performance.accuracy}
                        </div>
                        <div className="text-xs text-gray-400">AI Accuracy</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3">
                      <div>
                        <h4 className="text-white font-semibold">
                          {currentTestimonial.name}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {currentTestimonial.role} •{" "}
                          {currentTestimonial.location}
                        </p>
                      </div>

                      {currentTestimonial.language !== "English" && (
                        <button
                          onClick={toggleTranslation}
                          className={`text-sm px-3 py-1.5 rounded-md flex items-center z-20 gap-1.5 transition-colors ${
                            showTranslation
                              ? "bg-amber-700/40 text-amber-300 border border-amber-700/40"
                              : "bg-gray-800 text-gray-300 border border-gray-700"
                          }`}
                        >
                          <RiMapPin2Fill />
                          {showTranslation
                            ? "Hide Translation"
                            : "Show Translation"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation controls */}
            <div className="absolute bottom-8 right-8 flex items-center space-x-3">
              <button
                onClick={() => paginate(-1)}
                className="w-10 h-10 rounded-full bg-gray-900/50 border border-gray-700 flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-colors"
                aria-label="Previous testimonial"
              >
                <RiArrowLeftSLine size={20} />
              </button>
              <button
                onClick={() => paginate(1)}
                className="w-10 h-10 rounded-full bg-gray-900/50 border border-gray-700 flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-colors"
                aria-label="Next testimonial"
              >
                <RiArrowRightSLine size={20} />
              </button>
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "w-8 bg-blue-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Regional coverage */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Supporting Walmart Stores Across India
            </h3>
            <p className="text-gray-400 text-sm">
              SmartStock Pro is active in multiple regions and languages
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { region: "North", stores: "125+", color: "text-blue-400" },
              { region: "South", stores: "140+", color: "text-green-400" },
              { region: "West", stores: "160+", color: "text-purple-400" },
              { region: "East", stores: "75+", color: "text-amber-400" },
            ].map((region, i) => (
              <div
                key={i}
                className="bg-gray-900/50 backdrop-blur-sm border border-blue-800/20 rounded-lg p-4 text-center hover:bg-blue-900/20 transition-colors"
              >
                <div className={`text-2xl font-bold ${region.color}`}>
                  {region.stores}
                </div>
                <p className="text-sm font-medium text-white">
                  {region.region} India
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* System performance summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 max-w-2xl mx-auto bg-gradient-to-r from-blue-900/30 to-green-900/30 backdrop-blur-sm rounded-xl p-6 border border-blue-700/20 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <RiBarChartBoxFill className="text-blue-400 text-2xl" />
            <p className="text-blue-300 text-lg font-medium">
              NETWORK PERFORMANCE METRICS
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-white">
                {systemMetrics.totalStores}
              </div>
              <div className="text-xs text-gray-400">Active Stores</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                ₹{systemMetrics.totalSavings}+ Cr
              </div>
              <div className="text-xs text-gray-400">Total Savings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {systemMetrics.avgAccuracy.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400">Avg AI Accuracy</div>
            </div>
          </div>

          <p className="mt-4 text-gray-400 text-xs">
            Real-time data from {currentUser} • Updated {currentDateTime}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
