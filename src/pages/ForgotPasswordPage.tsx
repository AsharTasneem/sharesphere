import { useState } from "react";
import { Link } from "react-router-dom";
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

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const { requestPasswordReset } = useAuthStore();
    const { showToast } = useUIStore();
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

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
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        setLoading(true);
        try {
            await requestPasswordReset(data.email);
            setEmailSent(true);
            showToast(
                "Password reset email sent! Please check your inbox.",
                "success"
            );
        } catch (error: any) {
            console.error("Password reset request error:", error);
            showToast(
                error.message || "Failed to send password reset email",
                "error"
            );
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
                        Forgot Password?
                    </h1>
                    <p className="text-gray-600">
                        Enter your email and we'll send you a reset link
                    </p>
                </div>

                {emailSent ? (
                    <div className="auth-form-item">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                            <div className="text-green-600 mb-4">
                                <svg
                                    className="w-16 h-16 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Check your email
                            </h3>
                            <p className="text-gray-600 mb-6">
                                We've sent you a password reset link. Please check your inbox
                                and follow the instructions.
                            </p>
                            <Link
                                to="/signin"
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                            <Button type="submit" className="w-full" loading={loading}>
                                Send Reset Link
                            </Button>
                        </div>

                        <div className="text-center auth-form-item">
                            <Link
                                to="/signin"
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                ← Back to Sign In
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
