"use client";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/ui";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import LogoutModal from "@/components/LogoutModal";

export default function SettingsPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useUI();
  const router = useRouter();
  const [email, setEmail] = useState("student@offlineacad.com");
  const [language, setLanguage] = useState("english");
  const [offlineMode, setOfflineMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    toast.loading("Logging out...");

    setTimeout(() => {
      toast.dismiss();
      toast.success("Logged out successfully");
      logout();
      router.push("/");
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account and preferences
              </p>
            </div>

            {/* Profile Settings */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-2xl text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{user?.name || "User"}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Student Account</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    Change Avatar
                  </Button>
                </div>

                <div className="border-t dark:border-gray-700 pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      defaultValue={user?.name || ""}
                      readOnly
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      defaultValue={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                      label="Student ID"
                      defaultValue="STU-2024-001"
                      readOnly
                    />
                    <Input
                      label="School"
                      defaultValue="Central Academy"
                      readOnly
                    />
                  </div>
                  <Button className="mt-4">Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Display & Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current: {theme.toUpperCase()}
                    </p>
                  </div>
                  <Button variant="outline" onClick={toggleTheme}>
                    Toggle Theme
                  </Button>
                </div>

                <div>
                  <label className="block font-semibold text-gray-900 dark:text-white mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="hindi">Hindi</option>
                    <option value="arabic">Arabic</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Offline Settings */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Offline Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Offline Mode</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Allow app to work without internet connection
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={offlineMode}
                      onChange={(e) => setOfflineMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-checked:bg-indigo-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">📡 Offline Storage</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
                    Cache content locally for offline access
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-300">Storage Used:</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-200">2.4 GB / 10 GB</span>
                    </p>
                    <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden dark:bg-blue-900">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: "24%" }}></div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Clear Offline Cache
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Enable Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get updates about courses and achievements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-checked:bg-indigo-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                    These actions are permanent and cannot be undone.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="danger"
                    onClick={handleLogoutClick}
                  >
                    Logout
                  </Button>
                  <Button variant="outline" className="border-red-500 text-red-600 dark:text-red-400">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
}
