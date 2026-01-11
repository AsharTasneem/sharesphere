import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuthStore();
  const { showToast } = useUIStore();
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".auth-header", {
        y: 20,
        opacity: 0,
        duration: 0.8,
      }).from(
        ".auth-form-item",
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
        },
        "-=0.4"
      );
    },
    { scope: containerRef }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    setLoading(true);
    try {
      await signUp({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      console.log("Signup successful, navigating to dashboard");
      showToast("Account created successfully!", "success");
      navigate("/dashboard");
    } catch (error) {
      showToast("Failed to create account", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8 auth-header">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join ShareSphere and start sharing today
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="auth-form-item">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
              error={errors.name?.message}
              required
            />
          </div>

          <div className="auth-form-item">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
              required
            />
          </div>

          <div className="auth-form-item">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
              required
            />
          </div>

          <div className="auth-form-item">
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              required
            />
          </div>

          <div className="flex items-start auth-form-item">
            <input
              type="checkbox"
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              required
            />
            <label className="ml-2 text-sm text-gray-600">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-primary-600 hover:text-primary-700"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-primary-600 hover:text-primary-700"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <div className="auth-form-item">
            <Button type="submit" className="w-full" loading={loading}>
              Create Account
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 auth-form-item">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
