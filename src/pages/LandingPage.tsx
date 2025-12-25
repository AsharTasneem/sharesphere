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
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/stores/authStore";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
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
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="hero-title text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Borrow What You Need,
            <br />
            <span className="text-primary-600">Share What You Have</span>
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
      <section className="benefits-section py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why ShareSphere?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card hoverEffect className="text-center h-full">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Money</h3>
              <p className="text-gray-600">
                Borrow items instead of buying. Only pay for what you need, when
                you need it.
              </p>
            </Card>
            <Card hoverEffect className="text-center h-full">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Income</h3>
              <p className="text-gray-600">
                Make money from items you already own. Turn unused items into
                income.
              </p>
            </Card>
            <Card hoverEffect className="text-center h-full">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Build Community</h3>
              <p className="text-gray-600">
                Connect with neighbors and build meaningful relationships in
                your area.
              </p>
            </Card>
            <Card hoverEffect className="text-center h-full">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainable Living</h3>
              <p className="text-gray-600">
                Reduce waste and environmental impact by sharing resources.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="steps-section py-20 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
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
          </div>
          <div className="text-center mt-12">
            <Link to="/how-it-works">
              <Button variant="outline">Learn More</Button>
            </Link>
          </div>
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
