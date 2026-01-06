import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import {
  CheckBadgeIcon,
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

  if (!user) return null;

  const handleSave = async () => {
    await updateProfile({ name, bio });
    setEditing(false);
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
              <img
                src={user.avatar || "https://i.pravatar.cc/150?img=1"}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <button
                className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Change avatar"
              >
                <CameraIcon className="h-5 w-5" />
              </button>
            </div>
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
                <div className="flex gap-3">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setName(user.name);
                      setBio(user.bio || "");
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
                <Button variant="outline" size="sm">
                  Verify
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <IdentificationIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 font-medium">Government ID</span>
              </div>
              {user.verification.governmentId === "verified" ? (
                <Badge variant="success">Verified</Badge>
              ) : user.verification.governmentId === "pending" ? (
                <Badge variant="warning">Pending</Badge>
              ) : (
                <Button variant="outline" size="sm">
                  Verify
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
                <Button variant="outline" size="sm">
                  Verify
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">
          Contact Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
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
              {user.location.city}, {user.location.state},{" "}
              {user.location.country}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
