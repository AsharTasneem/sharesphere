import { useState, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { supabaseAuthService } from "@/services/supabase/auth.service";
import { supabaseStorageService } from "@/services/supabase/storage.service";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import {
  StarIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  MapPinIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import {
  StarIcon as StarOutlineIcon,
  PencilIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.location?.address || "");
  const [city, setCity] = useState(user?.location?.city || "");
  const [state, setState] = useState(user?.location?.state || "");
  const [country, setCountry] = useState(user?.location?.country || "");

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleSave = async () => {
    await updateProfile({
      name,
      bio,
      phone,
      location: {
        ...user.location,
        address,
        city,
        state,
        country,
      },
    });
    setEditing(false);
  };

  const handleUpdateEmail = async () => {
    try {
      await supabaseAuthService.updateEmail(newEmail);
      setShowEmailModal(false);
      // Toast or notification here would be good
    } catch (error) {
      console.error("Failed to update email", error);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    setUploading(true);

    try {
      // 1. Upload to Storage
      const publicUrl = await supabaseStorageService.uploadAvatar(
        file,
        user.id
      );

      // 2. Update Profile in DB
      await updateProfile({ avatar: publicUrl });
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      if (
        error.message?.includes("bucket not found") ||
        error.statusCode === "404"
      ) {
        alert(
          "Error: Storage bucket 'avatars' not found.\n\nPlease go to your Supabase Dashboard -> Storage and create a public bucket named 'avatars'."
        );
      } else {
        alert(error.message || "Failed to upload avatar");
      }
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">
          Manage your profile information and settings
        </p>
      </div>

      {/* Profile Header Card */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative group">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-primary-100 flex items-center justify-center text-primary-600 text-4xl font-bold">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "U"}
                </div>
              )}
              <button
                className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors opacity-100 disabled:opacity-50"
                aria-label="Change avatar"
                onClick={handleAvatarClick}
                disabled={uploading}
              >
                {uploading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CameraIcon className="h-5 w-5" />
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            {/* Added helper text */}
            <p className="text-xs text-center text-gray-500 mt-2">
              Click icon to change
            </p>
          </div>
          <div className="flex-1 w-full">
            {editing ? (
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Textarea
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Tell others about yourself..."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                  <Input
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St"
                  />
                  <Input
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Input
                    label="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                  <Input
                    label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setName(user.name);
                      setBio(user.bio || "");
                      setPhone(user.phone || "");
                      setAddress(user.location.address || "");
                      setCity(user.location.city || "");
                      setState(user.location.state || "");
                      setCountry(user.location.country || "");
                      setEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {user.name}
                  </h2>
                </div>
                {user.bio ? (
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {user.bio}
                  </p>
                ) : (
                  <p className="text-gray-400 italic mb-4">
                    No bio yet. Add one to help others get to know you!
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>
                      {user.location.city}, {user.location.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      Member since {formatDate(user.stats.memberSince)}
                    </span>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setEditing(true)}>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Stats and Verification Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Statistics Card */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <ChartBarIcon className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Statistics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-gray-600 flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-yellow-400" />
                Overall Rating
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) =>
                    i < Math.floor(user.stats.rating) ? (
                      <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <StarOutlineIcon
                        key={i}
                        className="h-4 w-4 text-gray-300"
                      />
                    )
                  )}
                </div>
                <span className="font-semibold text-gray-900">
                  {user.stats.rating.toFixed(1)}
                </span>
                <span className="text-gray-500 text-sm">
                  ({user.stats.reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">
                  {user.stats.totalBorrowed}
                </p>
                <p className="text-sm text-gray-600">Items Borrowed</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">
                  {user.stats.totalLent}
                </p>
                <p className="text-sm text-gray-600">Items Lent</p>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Response Rate</span>
                <span className="font-semibold text-gray-900">
                  {user.stats.responseRate}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Response Time</span>
                <span className="font-semibold text-gray-900">
                  {user.stats.responseTime || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold text-gray-900">
                  {user.stats.completionRate}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Verification Card */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <IdentificationIcon className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Verification</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 font-medium">Email</span>
              </div>
              {user.verification.email ? (
                <Badge variant="success">Verified</Badge>
              ) : (
                <Button variant="outline" size="sm">
                  Verify
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 font-medium">Phone</span>
              </div>
              {user.verification.phone ? (
                <Badge variant="success">Verified</Badge>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 font-medium">Address</span>
              </div>
              {user.verification.address ? (
                <Badge variant="success">Verified</Badge>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Contact Information</h3>
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <button
                onClick={() => setShowEmailModal(true)}
                className="text-primary-600 hover:text-primary-700 text-xs font-medium"
              >
                Change Email
              </button>
            </div>
            <p className="text-gray-900">{user.email}</p>
          </div>
          {user.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <p className="text-gray-900">{user.phone}</p>
            </div>
          )}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <p className="text-gray-900">
              {user.location.address ? `${user.location.address}, ` : ""}
              {user.location.city}, {user.location.state},{" "}
              {user.location.country}
            </p>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Update Email"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter your new email address. We will send a verification link to
            the new address.
          </p>
          <Input
            label="New Email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowEmailModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEmail}>Update Email</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
