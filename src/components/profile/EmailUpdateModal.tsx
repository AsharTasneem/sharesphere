import { useState } from "react";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { supabaseAuthService } from "@/services/supabase/auth.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

interface EmailUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
}

export function EmailUpdateModal({
  isOpen,
  onClose,
  currentEmail,
}: EmailUpdateModalProps) {
  const [step, setStep] = useState<"input" | "confirm" | "success">("input");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    setError(null);
    const trimmedEmail = newEmail.trim();

    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (trimmedEmail.toLowerCase() === currentEmail.toLowerCase()) {
      setError("New email must be different from current email");
      return;
    }

    setStep("confirm");
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create a timeout promise to prevent infinite hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () =>
            reject(
              new Error(
                "Request timed out. Please check your network or try again."
              )
            ),
          120000
        );
      });

      // Race the update against the timeout
      await Promise.race([
        supabaseAuthService.updateEmail(newEmail.trim()),
        timeoutPromise,
      ]);

      setStep("success");
    } catch (err: any) {
      console.error("Failed to update email:", err);
      // Even if it times out, sometimes the request actually went through.
      // But safest is to show error.
      setError(err.message || "Failed to update email. Please try again.");
      setStep("input");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setStep("input");
    setNewEmail("");
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Update Email Address">
      <div className="mt-2">
        {step === "input" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Enter your new email address below. We'll send a verification link
              to the new address to confirm the change.
            </p>
            <Input
              label="New Email"
              type="email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setError(null);
              }}
              placeholder="you@example.com"
              error={error || undefined}
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!newEmail}>
                Next
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon
                    className="h-5 w-5 text-yellow-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Warning: Changing your email will require you to verify the
                    new address before you can sign in with it.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to change your email from{" "}
              <strong className="text-gray-900">{currentEmail}</strong> to{" "}
              <strong className="text-gray-900">{newEmail}</strong>?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setStep("input")}
                disabled={loading}
              >
                Back
              </Button>
              <Button onClick={handleConfirm} loading={loading}>
                Confirm Update
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon
                className="h-6 w-6 text-green-600"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Check your inbox!
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              We've sent a verification link to <strong>{newEmail}</strong>.
              Please click the link in that email to finalize the update.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
