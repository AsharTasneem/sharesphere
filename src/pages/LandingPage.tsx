import { Link } from "react-router-dom";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  SparklesIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import DroppingTextsGSAP from "@/components/layout/DroppingText";
import ServiceCard from "@/components/layout/ServiceCard";
import { ParallaxScroll } from "@/components/ui/ParallaxScroll";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Interface
export interface ServiceItemData {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function LandingPage() {

  const defaultServices: ServiceItemData[] = [
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      title: "Community-Driven Sharing",
      description:
        "ShareSphere connects people within trusted communities, making it easy to share everyday items without unnecessary purchases.",
    },
    {
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
      title: "Save Money, Earn More",
      description:
        "Borrow what you need at a fraction of the cost or lend your unused items to earn extra income effortlessly.",
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: "Smart Lending & Borrowing",
      description:
        "Our platform simplifies lending and borrowing with clear terms, tracking, and transparency for both parties.",
    },
    {
      icon: <GlobeAltIcon className="w-6 h-6" />,
      title: "Access Anywhere, Anytime",
      description:
        "Find and share items locally or beyond your neighborhood using a seamless, location-aware platform.",
    },
    {
      icon: <SparklesIcon className="w-6 h-6" />,
      title: "Sustainable by Design",
      description:
        "By encouraging reuse and sharing, ShareSphere helps reduce waste and promotes a more sustainable lifestyle.",
    },
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      title: "Trust & Safety First",
      description:
        "Built-in user profiles, reviews, and secure interactions ensure safe and reliable sharing experiences.",
    },
  ];

  const processSteps: ServiceItemData[] = [
    {
      icon: <MagnifyingGlassIcon className="w-6 h-6" />,
      title: "Browse & Request",
      description:
        "Search for items in your area and send a borrow request with your dates.",
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      title: "Connect & Arrange",
      description:
        "Chat with the owner, confirm details, and arrange pickup time.",
    },
    {
      icon: <ArrowPathIcon className="w-6 h-6" />,
      title: "Borrow & Return",
      description:
        "Pick up the item, use it, and return it on time. Leave a review!",
    },
  ];

  const containerRef = useRef(null);

  useGSAP(
    () => {
      // Hero section animations - sequential timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-title", {
        y: 60,
        opacity: 0,
        duration: 1,
      })
        .from(
          ".hero-subtitle",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        .from(
          ".hero-search",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          ".hero-cta",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4"
        );

      // CTA section - fade up
      if (document.querySelector(".cta-section")) {
        gsap.from(".cta-section", {
          scrollTrigger: {
            trigger: ".cta-section",
            start: "top 80%",
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      }
    },
    { scope: containerRef }
  );

  useGSAP(
    () => {
      // Parallax effect for Hero Content
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1, // Smooth scrubbing
        },
        y: 200,
        opacity: 0,
        ease: "none",
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 px-4 pb-20">
        <div className="hero-content max-w-7xl mx-auto text-center relative z-10">
          <h1 className="hero-title text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {/* Borrow What You Need,
            <br />
            <span className="text-primary-600">Share What You Have</span> */}
            <DroppingTextsGSAP />
          </h1>
          <p className="hero-subtitle text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with your community to borrow and lend items. Save money,
            reduce waste, and build connections.
          </p>
          <div className="hero-search flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="w-full sm:w-auto sm:max-w-md flex-1">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 outline-none text-lg"
              />
            </div>
            <Link to="/browse">
              <Button size="lg">Browse Items</Button>
            </Link>
          </div>
        </div>
      </section>
      <ParallaxScroll />

      {/* Benefits Section */}
      <section className="benefits-section pt-12 pb-2 md:pt-20 md:pb-4 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-0">
            Why ShareSphere?
          </h2>
        </div>
      </section>
      <section className="pb-4 pt-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ServiceCard data={defaultServices} />
        </div>
      </section>

      {/* How It Works */}
      <section className="steps-section py-12 md:py-20 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            How It Works
          </h2>
          <ServiceCard data={processSteps} className="mt-12" />
        </div>
      </section>
    </div>
  );
}
