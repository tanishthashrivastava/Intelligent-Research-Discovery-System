import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import {
  Search,
  Upload,
  BarChart3,
  MessageSquare,
  User,
  CreditCard,
  HelpCircle,
  Mail,
  LogOut,
  BookOpen,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './lib/utils';
import { User as UserType } from './types';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SearchPapers from './pages/SearchPapers';
import UploadPapers from './pages/UploadPapers';
import ResultsAnalysis from './pages/ResultsAnalysis';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import HelpSupport from './pages/HelpSupport';
import Contact from './pages/Contact';
import About from "./pages/About"; 

export default function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.clear();
    setUser(null);
    setLoading(false);
  }, []); 
  

  const login = (userData: UserType) => {
    const finalUser = {
      ...userData,
      subscription: userData.subscription || "Free"
    };

    setUser(finalUser);
  
  }; 

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/about" element ={<About />} /> 
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/register" element={<Register onLogin={login} />} />


        <Route
          path="/dashboard/*"
          element={
            user
              ? <DashboardLayout user={user} onLogout={logout} />
              : <Navigate to="/login" />
          }
        >
          <Route index element={<Dashboard user={user} />} />
          <Route path="search" element={<SearchPapers user={user} />} />
          <Route path="upload" element={<UploadPapers user={user} />} />
          <Route path="results" element={<ResultsAnalysis user={user} />} />
          <Route path="assistant" element={<AIAssistant user={user} />} />
          <Route path="profile" element={<Profile user={user} />} />
          <Route path="subscription" element={<Subscription user={user} />} />
          <Route path="help" element={<HelpSupport />} />
          <Route path="contact" element={<Contact user={user} />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

function DashboardLayout({
  user,
  onLogout
}: {
  user: UserType;
  onLogout: () => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Search, label: 'Search Papers', path: '/dashboard/search' },
    { icon: Upload, label: 'Upload Papers', path: '/dashboard/upload' },
    { icon: BarChart3, label: 'Results & Analysis', path: '/dashboard/results' },
    { icon: MessageSquare, label: 'AI Research Assistant', path: '/dashboard/assistant' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
    { icon: CreditCard, label: 'Subscription', path: '/dashboard/subscription' },
    { icon: HelpCircle, label: 'Help & Support', path: '/dashboard/help' },
    { icon: Mail, label: 'Contact Us', path: '/dashboard/contact' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col z-20"
      >
        <div className="p-6 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 overflow-hidden"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="text-white w-5 h-5" />
            </div>

            {isSidebarOpen && (
              <span className="font-bold text-slate-800 whitespace-nowrap">
                ILR System
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-slate-100 rounded"
          >
            <ChevronRight
              className={isSidebarOpen ? "rotate-180" : ""}
            />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  location.pathname === item.path
                    ? "text-blue-600"
                    : "text-slate-400 group-hover:text-slate-600"
                )}
              />

              {isSidebarOpen && (
                <span className="font-medium text-sm">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />

            {isSidebarOpen && (
              <span className="font-medium text-sm">
                Logout
              </span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800">
            {menuItems.find(
              (i) => i.path === location.pathname
            )?.label || 'Dashboard'}
          </h1>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">
                {user.name}
              </p>
              <p className="text-xs text-slate-500">
                {user.subscription} Plan
              </p>
            </div>

            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              {user?.name}
            </div>
          </div>
        </header>

        <div className="p-8">
          <Routes>
            <Route index element={<Dashboard user={user} />} />
            <Route path="search" element={<SearchPapers user={user} />} />
            <Route path="upload" element={<UploadPapers user={user} />} />
            <Route path="results" element={<ResultsAnalysis user={user} />} />
            <Route path="assistant" element={<AIAssistant user={user} />} />
            <Route path="profile" element={<Profile user={user} />} />
            <Route path="subscription" element={<Subscription user={user} />} />
            <Route path="help" element={<HelpSupport />} />
            <Route path="contact" element={<Contact user={user} />} /> 
          </Routes>
        </div>
      </main>
    </div>
  );
} 