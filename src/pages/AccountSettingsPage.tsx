import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useUIStore } from "@/stores/uiStore";
import {
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  MapPinIcon,
  LockClosedIcon,
  BellIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

export default function AccountSettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const { showToast } = useUIStore();
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!user) return null;

  const handleSaveEmail = async () => {
    await updateProfile({ email });
    showToast("Email updated successfully", "success");
  };

  const handleSavePhone = async () => {
    await updateProfile({ phone });
    showToast("Phone number updated successfully", "success");
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    // In a real app, this would call an API
    showToast("Password changed successfully", "success");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600">
          Manage your account information and preferences
        </p>
      </div>

      {/* Email Settings */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <EnvelopeIcon className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Email Address</h3>
        </div>
        <div className="space-y-4">
          <div>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {user.verification.email && (
              <Badge variant="success" className="mt-2">
                Verified
              </Badge>
            )}
          </div>
          <Button onClick={handleSaveEmail}>Update Email</Button>
        </div>
      </Card>

      {/* Phone Settings */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <PhoneIcon className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Phone Number</h3>
        </div>
        <div className="space-y-4">
          <div>
            <Input
              label="Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
            />
            {user.verification.phone && (
              <Badge variant="success" className="mt-2">
                Verified
              </Badge>
            )}
          </div>
          <Button onClick={handleSavePhone}>Update Phone</Button>
        </div>
      </Card>

      {/* Password Settings */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <LockClosedIcon className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Change Password</h3>
        </div>
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
          <Button onClick={handleChangePassword}>Change Password</Button>
        </div>
      </Card>

      {/* Verification Status */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <IdentificationIcon className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Verification Status</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700 font-medium">
                Email Verification
              </span>
            </div>
            {user.verification.email ? (
              <Badge variant="success">Verified</Badge>
            ) : (
              <Button variant="outline" size="sm">
                Verify Now
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700 font-medium">
                Phone Verification
              </span>
            </div>
            {user.verification.phone ? (
              <Badge variant="success">Verified</Badge>
            ) : (
              <Button variant="outline" size="sm">
                Verify Now
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700 font-medium">
                Address Verification
              </span>
            </div>
            {user.verification.address ? (
              <Badge variant="success">Verified</Badge>
            ) : (
              <Button variant="outline" size="sm">
                Verify Now
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCardIcon className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Payment Methods</h3>
        </div>
        {user.payoutMethod ? (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 mb-2">
              {user.payoutMethod.type === "bank" ? "Bank Account" : "PayPal"}
            </p>
            {user.payoutMethod.last4 && (
              <p className="text-sm text-gray-500">
                •••• {user.payoutMethod.last4}
              </p>
            )}
            {user.payoutMethod.verified && (
              <Badge variant="success" className="mt-2">
                Verified
              </Badge>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No payment method added</p>
            <Button variant="outline">Add Payment Method</Button>
          </div>
        )}
      </Card>

      {/* Notification Preferences */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <BellIcon className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">
            Notification Preferences
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">
                Receive email updates about your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.preferences.emailDigest}
                onChange={(e) =>
                  updateProfile({
                    preferences: {
                      ...user.preferences,
                      emailDigest: e.target.checked,
                    },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-600">
                Receive browser push notifications
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.preferences.pushEnabled}
                onChange={(e) =>
                  updateProfile({
                    preferences: {
                      ...user.preferences,
                      pushEnabled: e.target.checked,
                    },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
}
