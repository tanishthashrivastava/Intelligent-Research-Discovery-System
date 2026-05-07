import { useState, useEffect } from "react";
import {
  Shield,
  Clock,
  FileText,
  Edit2,
  Save,
} from "lucide-react";
import { User } from "../types";

export default function Profile({
  user,
}: {
  user?: User;
}) {
  const safeUser = user || {
    name: "User",
    email: "user@email.com",
    subscription: "Free",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(safeUser.name);
  const [email] = useState(safeUser.email);

  const [papersUploaded, setPapersUploaded] = useState(0);
  const [searchCount, setSearchCount] = useState(0);
  const [recentSearches, setRecentSearches] =
    useState<any[]>([]);

  useEffect(() => {
    setName(safeUser.name);
    loadProfileStats();
  }, [safeUser.email]);

  const loadProfileStats = async () => {
    try {
      const res = await fetch(
        `https://intelligent-research-discovery-system-production.up.railway.app/profile/${safeUser.email}`
      );

      const data = await res.json();

      setPapersUploaded(data.papers_uploaded || 0);
      setSearchCount(data.search_count || 0);
      setRecentSearches(data.recent || []);
    } catch (err) {
      console.error(err);
    }
  };

  const saveProfile = async () => {
    try {
      const res = await fetch(
        "https://intelligent-research-discovery-system-production.up.railway.app/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            name,
          }),
        }
      );

      const data = await res.json();

      alert(data.message);

      const updatedUser = {
        ...safeUser,
        name,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setIsEditing(false);

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Profile update failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
          {(name || "U")[0]}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-900">
            {name}
          </h2>

          <p className="text-slate-500">
            {email}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
              {safeUser.subscription} Plan
            </span>

            <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
              Researcher
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              saveProfile();
            } else {
              setIsEditing(true);
            }
          }}
          className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          {isEditing ? (
            <Save className="w-4 h-4" />
          ) : (
            <Edit2 className="w-4 h-4" />
          )}

          {isEditing
            ? "Save Profile"
            : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-400" />
              Account Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>

                <input
                  type="text"
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>

                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg opacity-60 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* RECENT SEARCH */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Recent Search History
            </h3>

            <div className="space-y-3">
              {recentSearches.length > 0 ? (
                recentSearches.map(
                  (item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg"
                    >
                      <span className="text-sm text-slate-600">
                        {item.query}
                      </span>

                      <span className="text-xs text-slate-400">
                        {item.date}
                      </span>
                    </div>
                  )
                )
              ) : (
                <p className="text-sm text-slate-400">
                  No searches yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">
              Your Activity
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FileText className="w-4 h-4" />
                  Papers Uploaded
                </div>

                <span className="font-bold text-slate-900">
                  {papersUploaded}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  Search Count
                </div>

                <span className="font-bold text-slate-900">
                  {searchCount}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
            <h3 className="font-bold mb-2">
              Current Plan:{" "}
              {safeUser.subscription}
            </h3>

            <p className="text-blue-100 text-sm mb-6">
              Upgrade to Student or Institutional plan for unlimited AI analysis.
            </p>

            <button className="w-full py-2.5 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all">
              Manage Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 