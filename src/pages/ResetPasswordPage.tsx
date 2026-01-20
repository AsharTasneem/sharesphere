import { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabaseClient";

const resetPasswordSchema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const { resetPassword } = useAuthStore();
    const { showToast } = useUIStore();
    const [loading, setLoading] = useState(false);
    const [validSession, setValidSession] = useState<boolean | null>(null);

    const containerRef = useRef(null);

    // Check if user has a valid recovery session
    useEffect(() => {
        const checkSession = async () => {
            try {
                // First check if there's a recovery token in the URL hash
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');
                const type = hashParams.get('type');

                // If no recovery token in URL, check if user came from email link
                if (!accessToken || type !== 'recovery') {
                    // Check if there's an existing session that might be from a recovery
                    const { data: { session }, error } = await supabase.auth.getSession();

                    if (error || !session) {
                        setValidSession(false);
                        showToast(
                            "Please use the password reset link from your email.",
                            "error"
                        );
                        return;
                    }

                    // Even if there's a session, if we didn't come from a recovery link, reject it
                    setValidSession(false);
                    showToast(
                        "Please use the password reset link from your email.",
                        "error"
                    );
                    return;
                }

                // Valid recovery token found
                setValidSession(true);
            } catch (error) {
                console.error("Error checking session:", error);
                setValidSession(false);
                showToast(
                    "An error occurred. Please try again.",
                    "error"
                );
            }
        };

        checkSession();
    }, [showToast]);

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
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordForm) => {
        setLoading(true);
        try {
            await resetPassword(data.password);
            showToast("Password reset successfully!", "success");
            // Wait a moment before redirecting
            setTimeout(() => {
                navigate("/signin");
            }, 1500);
        } catch (error: any) {
            console.error("Password reset error:", error);
            showToast(
                error.message || "Failed to reset password. The link may have expired.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while checking session
    if (validSession === null) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    // Show error state if no valid session
    if (validSession === false) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <div className="text-red-600 mb-4">
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
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Invalid Reset Link
                        </h3>
                        <p className="text-gray-600 mb-6">
                            This password reset link is invalid or has expired. Please request a new one.
                        </p>
                        <Link
                            to="/forgot-password"
                            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Request New Link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="min-h-screen flex items-center justify-center px-4 py-12"
        >
            <div className="w-full max-w-md">
                <div className="text-center mb-8 auth-header">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Reset Password
                    </h1>
                    <p className="text-gray-600">Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="auth-form-item">
                        <Input
                            label="New Password"
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

                    <div className="auth-form-item">
                        <Button type="submit" className="w-full" loading={loading}>
                            Reset Password
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
            </div>
        </div>
    );
}
