import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDownIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  searchable?: boolean;
}

export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  searchable = false,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update dropdown position on scroll and close if trigger is out of view
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();

        // Check if trigger element is still visible in viewport
        const isInViewport =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.right <= window.innerWidth;

        if (!isInViewport) {
          // Close dropdown if trigger scrolled out of view
          setIsOpen(false);
        } else {
          // Update position to follow the trigger
          setDropdownPosition({
            top: rect.bottom,
            left: rect.left,
            width: rect.width,
          });
        }
      }
    };

    // Listen to scroll events on window and all scrollable parents
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isOpen]);

  // Close dropdown when window is resized
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Animate dropdown open/close with enhanced GSAP animations
  useEffect(() => {
    if (menuRef.current) {
      if (isOpen) {
        // Animate menu container with spring-like effect
        gsap.fromTo(
          menuRef.current,
          {
            opacity: 0,
            y: -15,
            scale: 0.92,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.35,
            ease: "back.out(1.4)",
          }
        );

        // Animate options with stagger for cascading effect
        const options = menuRef.current.querySelectorAll(".option-item");
        if (options.length > 0) {
          // Only animate the first 12 items to prevent performance issues with large lists (like countries)
          const itemsToAnimate = Array.from(options).slice(0, 12);
          gsap.fromTo(
            itemsToAnimate,
            {
              opacity: 0,
              x: -15,
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.25,
              stagger: 0.03,
              ease: "power2.out",
              delay: 0.1,
            }
          );
        }

        // Focus search input if searchable
        if (searchable && searchInputRef.current) {
          setTimeout(() => searchInputRef.current?.focus(), 150);
        }
      } else {
        // Animate out when closing
        gsap.to(menuRef.current, {
          opacity: 0,
          y: -10,
          scale: 0.95,
          duration: 0.2,
          ease: "power2.in",
        });
        setSearchQuery("");
      }
    }
  }, [isOpen, searchable]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div
      ref={dropdownRef}
      className={cn("relative w-full", className, "font-playfair")}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 pr-10 rounded-full border border-gray-300 bg-white",
          "focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20",
          "outline-none transition-all cursor-pointer text-left",
          "hover:border-gray-400 hover:shadow-sm",
          isOpen && "border-primary-500 ring-2 ring-primary-500 ring-opacity-20"
        )}
      >
        <span className="block truncate text-gray-900">
          {selectedOption?.label || placeholder}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDownIcon
            className={cn(
              "h-5 w-5 text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </span>
      </button>

      {/* Dropdown Menu - Rendered via Portal */}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[9999] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            style={{
              opacity: 0,
              top: `${dropdownPosition.top + 8}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-3 border-b border-gray-100 bg-gray-50">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 outline-none text-sm"
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div
              className="max-h-60 overflow-y-auto py-2 overscroll-contain"
              onWheel={(e) => e.stopPropagation()}
            >
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "option-item w-full px-4 py-2.5 text-left flex items-center justify-between gap-2",
                        "transition-colors duration-150",
                        isSelected
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : "text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <span className="flex items-center gap-2 flex-1 truncate">
                        {option.icon && (
                          <span className="flex-shrink-0">{option.icon}</span>
                        )}
                        <span className="truncate">{option.label}</span>
                      </span>
                      {isSelected && (
                        <CheckIcon className="h-5 w-5 text-primary-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
