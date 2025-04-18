"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Facebook,
  Home,
  Instagram,
  Linkedin,
  Menu,
  MessageSquare,
  Shield,
  Twitter,
  Wrench,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ACINSTALL from "./img/acinstallation.jpg";

// Loader Component with new SVG
const Loader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 z-50 flex items-center justify-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className="w-24 h-24"
    >
      <circle
        fill="#C05AFF"
        stroke="#C05AFF"
        strokeWidth="15"
        r="15"
        cx="40"
        cy="65"
      >
        <animate
          attributeName="cy"
          calcMode="spline"
          dur="1.9"
          values="65;135;65;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.4"
        />
      </circle>
      <circle
        fill="#C05AFF"
        stroke="#C05AFF"
        strokeWidth="15"
        r="15"
        cx="100"
        cy="65"
      >
        <animate
          attributeName="cy"
          calcMode="spline"
          dur="1.9"
          values="65;135;65;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.2"
        />
      </circle>
      <circle
        fill="#C05AFF"
        stroke="#C05AFF"
        strokeWidth="15"
        r="15"
        cx="160"
        cy="65"
      >
        <animate
          attributeName="cy"
          calcMode="spline"
          dur="1.9"
          values="65;135;65;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="0"
        />
      </circle>
    </svg>
  </motion.div>
);

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentServicePage, setCurrentServicePage] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      title: "Home Repairs",
      icon: <Wrench className="h-10 w-10 text-gray-700" />,
      description: "Professional repair services for all your household needs",
    },
    {
      title: "Waste Management",
      icon: <Clock className="h-10 w-10 text-gray-700" />,
      description: "Efficient waste collection and disposal services",
    },
    {
      title: "Security Services",
      icon: <Shield className="h-10 w-10 text-gray-700" />,
      description:
        "Keep your home and neighborhood safe with our security solutions",
    },
    {
      title: "Utility Support",
      icon: <MessageSquare className="h-10 w-10 text-gray-700" />,
      description: "Assistance with all your utility needs and concerns",
    },
    {
      title: "Home Cleaning",
      icon: <Home className="h-10 w-10 text-gray-700" />,
      description: "Professional cleaning services for a spotless home",
    },
    {
      title: "Maintenance",
      icon: <Wrench className="h-10 w-10 text-gray-700" />,
      description: "Regular maintenance to keep your home in perfect condition",
    },
  ];

  const servicesPerPage = 3;
  const totalPages = Math.ceil(services.length / servicesPerPage);
  const displayedServices = services.slice(
    currentServicePage * servicesPerPage,
    (currentServicePage + 1) * servicesPerPage
  );

  const nextPage = () =>
    setCurrentServicePage((prev) => (prev + 1) % totalPages);
  const prevPage = () =>
    setCurrentServicePage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <AnimatePresence>{isLoading && <Loader />}</AnimatePresence>

      {/* Navbar */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        viewport={{ once: true }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div>
              <Link to="/home">
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#000000] to-[#434343] text-transparent bg-clip-text">
                  Urban Connect
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {["Home", "Services", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Services" ? "#services" : "#"}
                  className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link to="/authpage">
                <Button
                  variant="outline"
                  className="hidden md:flex border-gray-300 bg-white text-gray-900 hover:bg-slate-900 hover:text-purple-500"
                >
                  Login
                </Button>
              </Link>
              <Link to="/authpage">
                <Button className="hidden md:flex bg-gray-900 text-white hover:bg-gray-800">
                  Sign Up
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 z-50 bg-white md:hidden"
            >
              <div className="flex h-16 items-center justify-between px-4">
                <span className="text-xl font-bold bg-gradient-to-r from-[#000000] to-[#434343] text-transparent bg-clip-text">
                  Urban Connect
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="flex flex-col gap-4 p-4">
                {["Home", "Services", "About", "Contact"].map((item) => (
                  <Link
                    key={item}
                    to={item === "Services" ? "#services" : "#"}
                    className="flex h-12 items-center border-b border-gray-100 text-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-4">
                  <Button variant="outline" className="w-full justify-center">
                    Login
                  </Button>
                  <Button className="w-full justify-center bg-gray-900 text-white hover:bg-gray-800">
                    Sign Up
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gray-50 py-20 sm:py-32"
        >
          <div className="absolute inset-0 overflow-hidden">
            <svg
              className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="grid"
                  width="200"
                  height="200"
                  x="50%"
                  y="-1"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M100 200V.5M.5 .5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y="-1" className="overflow-visible fill-gray-50">
                <path
                  d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                  strokeWidth="0"
                />
              </svg>
              <rect
                width="100%"
                height="100%"
                strokeWidth="0"
                fill="url(#grid)"
              />
            </svg>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] text-transparent bg-clip-text">
                  Seamless Urban Services at Your Fingertips
                </h1>
                <p className="mt-6 text-lg text-gray-600">
                  Urban Connect brings essential city services to your doorstep.
                  From waste management to home repairs, we make urban living
                  simpler and more efficient.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gray-900 text-white hover:bg-gray-800 gap-2"
                  >
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 bg-white text-gray-900 hover:bg-gray-300"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block relative h-[400px] w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-transparent z-10 rounded-xl"></div>
                <img
                  src={ACINSTALL}
                  alt="Urban Services Illustration"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Why Choose Urban Connect
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                We're revolutionizing how urban services are delivered with our
                innovative platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Instant Booking",
                  description:
                    "Book any service instantly with just a few clicks, no waiting or phone calls needed.",
                  icon: (
                    <svg
                      className="h-10 w-10 text-gray-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Verified Professionals",
                  description:
                    "All our service providers are thoroughly vetted and highly skilled professionals.",
                  icon: (
                    <svg
                      className="h-10 w-10 text-gray-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Transparent Pricing",
                  description:
                    "No hidden fees or surprises. Know exactly what you're paying for upfront.",
                  icon: (
                    <svg
                      className="h-10 w-10 text-gray-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Real-time Tracking",
                  description:
                    "Track your service provider's arrival in real-time for better planning.",
                  icon: (
                    <svg
                      className="h-10 w-10 text-gray-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Secure Payments",
                  description:
                    "Pay securely through our platform with multiple payment options.",
                  icon: (
                    <svg
                      className="h-10 w-10 text-gray-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "24/7 Support",
                  description:
                    "Our customer support team is available round the clock to assist you.",
                  icon: (
                    <svg
                      className="h-10 w-10 text-gray-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01"
                      />
                    </svg>
                  ),
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="mb-4 rounded-full bg-gray-100 p-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
          id="services"
          className="py-20 bg-gray-50"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Our Services
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the wide range of services available through our
                platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayedServices.map((service, index) => (
                <div key={index}>
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl bg-white border-0">
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <img
                        src={`/placeholder.svg?height=200&width=300&text=${service.title}`}
                        alt={service.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="rounded-full bg-gray-100 p-2">
                          {service.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {service.description}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full justify-center bg-white border-gray-300 text-gray-900 hover:bg-gray-300"
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-12 gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                className="border-gray-300 text-gray-900 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index}
                  variant={currentServicePage === index ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentServicePage(index)}
                  className={
                    currentServicePage === index
                      ? "bg-gray-900 text-white"
                      : "border-gray-300 text-gray-900 hover:bg-gray-100"
                  }
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                className="border-gray-300 text-gray-900 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="py-20 bg-gray-900 text-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6 bg-gradient-to-r from-[#aaffa9] to-[#11ffbd] text-transparent bg-clip-text">
                Ready to Transform Your Urban Living Experience?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied users who have simplified their
                urban life with Urban Connect. Get started today and experience
                the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 gap-2"
                >
                  Get Started Now <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-gray-800"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="bg-gray-100 py-12"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-gray-900">
                  Urban Connect
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Connecting urban residents with essential services for a better
                city life.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-[#3b5998] hover:text-[#2d4373] transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="text-[#00acee] hover:text-[#0087ba] transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="text-[#c13584] hover:text-[#9b2c6a] transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="text-[#0077b5] hover:text-[#005e8d] transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
            {["Services", "Company", "Legal"].map((section) => (
              <div key={section}>
                <h3 className="font-semibold text-gray-900 mb-4">{section}</h3>
                <ul className="space-y-2">
                  {(section === "Services"
                    ? [
                        "Home Repairs",
                        "Waste Management",
                        "Utility Services",
                        "City Maintenance",
                      ]
                    : section === "Company"
                    ? ["About Us", "Careers", "Blog", "Press"]
                    : ["Terms of Service", "Privacy Policy", "Cookie Policy"]
                  ).map((item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>
              © {new Date().getFullYear()} Urban Connect. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
