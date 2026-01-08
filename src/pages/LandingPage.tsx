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
import { useAuthStore } from "@/stores/authStore";
import DroppingTextsGSAP from "@/components/layout/DroppingText";
import ServiceCard from "@/components/layout/ServiceCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Interface
export interface ServiceItemData {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();

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

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="hero-titl text-4xl md:text-6xl font-bold text-gray-900 mb-6">
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
          {!isAuthenticated && (
            <div className="hero-cta mt-8 flex gap-4 justify-center">
              <Link to="/signup">
                <Button variant="outline" size="lg">
                  List an Item
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

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
          {/* <div className="grid md:grid-cols-3 gap-8">
            <Card hoverEffect className="text-center h-full">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Request</h3>
              <p className="text-gray-600">
                Search for items in your area and send a borrow request with
                your dates.
              </p>
            </Card>
            <Card hoverEffect className="text-center h-full">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Arrange</h3>
              <p className="text-gray-600">
                Chat with the owner, confirm details, and arrange pickup time.
              </p>
            </Card>
            <Card hoverEffect className="text-center h-full">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Borrow & Return</h3>
              <p className="text-gray-600">
                Pick up the item, use it, and return it on time. Leave a review!
              </p>
            </Card>
          </div> */}
          <ServiceCard data={processSteps} className="mt-12" />
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta-section py-20 px-4 bg-primary-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-primary-50">
              Join thousands of people sharing items in their community.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-primary-50"
                >
                  Sign Up Free
                </Button>
              </Link>
              <Link to="/browse">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white border-white hover:bg-primary-700"
                >
                  Browse Items
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
