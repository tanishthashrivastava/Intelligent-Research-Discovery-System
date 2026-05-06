import { useState, useEffect } from "react";
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Contact({ user }: any) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [history, setHistory] = useState<any[]>([]);

  const loadHistory = async () => {
    if (!email) return;

    try {
      const res = await fetch(
        `http://localhost:8000/contact/${email}`
      );

      const data = await res.json();

      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.email) {
      setEmail(user.email);

      fetch(`http://localhost:8000/contact/${user.email}`)
        .then((res) => res.json())
        .then((data) =>
          setHistory(Array.isArray(data) ? data : [])
        )
        .catch(console.error);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8000/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
          }),
        }
      );

      const data = await res.json();

      if (data.message) {
        setSubmitted(true);

        setSubject("");
        setMessage("");

        await loadHistory();
      }
    } catch (err) {
      console.error(err);
      alert("Message failed");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          Contact Us
        </h2>

        <p className="text-slate-500 mt-4">
          Have questions or feedback? We'd love to hear
          from you.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name
                  </label>

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Subject
                </label>

                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) =>
                    setSubject(e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Enter subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Message
                </label>

                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="bg-emerald-50 p-12 rounded-3xl border border-emerald-100 text-center"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-emerald-600 w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-emerald-900">
              Message Sent!
            </h3>

            <p className="text-emerald-700 mt-2">
              Thank you for reaching out. Our team will
              get back to you shortly.
            </p>

            <button
              onClick={() => setSubmitted(false)}
              className="mt-8 px-8 py-3 bg-white text-emerald-600 border border-emerald-200 rounded-xl font-bold hover:bg-emerald-100 transition-all"
            >
              Send Another Message
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {history.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold mb-4">
            My Messages
          </h3>

          <div className="space-y-3">
            {history.map((msg, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-50 border"
              >
                <div className="font-semibold">
                  {msg.subject}
                </div>

                <div className="text-sm text-slate-600 mt-1">
                  {msg.message}
                </div>

                <div className="text-xs text-slate-400 mt-2">
                  {msg.created_at}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Mail className="text-blue-600 w-5 h-5" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Email Us
            </p>

            <p className="text-sm font-bold text-slate-700">
              support@ilrsystem.com
            </p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
            <MessageSquare className="text-indigo-600 w-5 h-5" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Live Chat
            </p>

            <p className="text-sm font-bold text-slate-700">
              Available 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 