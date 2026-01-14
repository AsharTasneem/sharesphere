import { InputHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full font-playfair">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className={cn(
              "w-full px-4 py-3 rounded-full border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 outline-none transition-colors placeholder:text-gray-400",
              "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&[type=number]]:[-moz-appearance:textfield]",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              isPassword && "pr-12", // Extra padding for the eye icon
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-800 hover:text-primary-900 focus:outline-none w-5 h-5 flex items-center justify-center p-0"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <div className="relative w-5 h-5">
                <EyeIcon
                  className={cn(
                    "absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out",
                    showPassword
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-0"
                  )}
                />
                <EyeSlashIcon
                  className={cn(
                    "absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out",
                    !showPassword
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 rotate-90 scale-0"
                  )}
                />
              </div>
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
