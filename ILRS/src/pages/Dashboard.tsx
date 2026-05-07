import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { motion } from 'motion/react';
import { FileText, Search as SearchIcon, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { User } from '../types';

export default function Dashboard({ user }: { user: User }) {

  //  SAFE USER
  const safeName = user?.name ? user.name.split(' ')[0] : "User";
  const navigate = useNavigate(); 
  //  STATS STATE
  const [stats, setStats] = useState({
    papers: 0,
    similar: 0,
    gaps: "No",
    score: "0%"
  });

  //  GRAPH STATE
  const [activityData, setActivityData] = useState<any[]>([]);

  //  NEW: SUGGESTED TOPICS STATE
  const [topics, setTopics] = useState<string[]>([]);

  // =========================
  //  FETCH DASHBOARD STATS
  // =========================
  useEffect(() => {
    fetch("http://localhost:8000/dashboard")
      .then(res => res.json())
      .then(data => {
        setStats({
          papers: data.total_papers || 0,
          similar: data.total_searches || 0,
          gaps: data.gaps || "No",
          score: data.score || "0%"
        });
      })
      .catch(err => console.error("Stats error:", err));
  }, []);

  // =========================
  //  FETCH GRAPH DATA
  // =========================
  useEffect(() => {
    fetch("http://localhost:8000/dashboard-activity")
      .then(res => res.json())
      .then(data => {
        setActivityData(data);
      })
      .catch(err => console.error("Graph error:", err));
  }, []);

  // =========================
  // FETCH SUGGESTIONS
  // =========================
  useEffect(() => {
    fetch("http://localhost:8000/suggestions")
      .then(res => res.json())
      .then(data => {
        setTopics(data);
      })
      .catch(err => console.error("Suggestions error:", err));
  }, []);

  const statCards = [
    { label: 'Papers Processed', value: stats.papers, icon: FileText, color: 'blue' },
    { label: 'Similar Papers Found', value: stats.similar, icon: SearchIcon, color: 'indigo' },
    { label: 'Research Gaps Identified', value: stats.gaps, icon: AlertTriangle, color: 'amber' },
    { label: 'Result Score', value: stats.score, icon: TrendingUp, color: 'emerald' },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, {safeName}!
        </h2>
        <p className="text-slate-500">
          Here's what's happening with your research today.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className={`w-12 h-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`text-${stat.color}-600 w-6 h-6`} />
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* GRAPH */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Research Activity</h3>
            <select className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SUGGESTED TOPICS (DYNAMIC) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="text-amber-500 w-5 h-5" />
            <h3 className="font-bold text-slate-900">Suggested Topics</h3>
          </div>

          <div className="space-y-4">
            {topics.length === 0 ? (
              <p className="text-sm text-slate-400">No suggestions yet</p>
            ) : (
              topics.map((topic, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border hover:border-blue-200 cursor-pointer">
                  <p className="text-sm text-slate-700 hover:text-blue-600">{topic}</p>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => navigate("/dashboard/search")}
            className="w-full mt-6 py-2.5 text-blue-600 text-sm font-semibold hover:bg-blue-50 rounded-lg"
          >
            View All Suggestions
          </button>
        </div> 

      </div>
    </div>
  );
} 