import {
  HelpCircle,
  Book,
  MessageCircle,
  Mail,
  ChevronDown,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function HelpSupport({ user }: any) {
  const [communityData, setCommunityData] = useState<any>(null);
  const [showCommunity, setShowCommunity] = useState(false);

  const [showSupport, setShowSupport] = useState(false);
  const [supportName, setSupportName] = useState(user?.name || "");
  const [supportEmail, setSupportEmail] = useState(user?.email || "");
  const [issueType, setIssueType] = useState("Technical Issue");
  const [supportMsg, setSupportMsg] = useState("");

  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketInfo, setTicketInfo] = useState<any>(null);

  const loadCommunity = async () => {
    try {
      const res = await fetch("https://intelligent-research-discovery-system-production.up.railway.app/community");
      const data = await res.json();

      setCommunityData(data);
      setShowCommunity(true);
      setShowSupport(false);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTickets = async () => {
    if (!user?.email) return;

    try {
      const res = await fetch(
        `https://intelligent-research-discovery-system-production.up.railway.app/support/${user.email}`
      );

      const data = await res.json();
      console.log("TICKETS =", data); 
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const submitSupport = async () => {
    try {
      const res = await fetch("https://intelligent-research-discovery-system-production.up.railway.app/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: supportName,
          email: supportEmail,
          issue_type: issueType,
          message: supportMsg,
        }),
      });

      const data = await res.json();

      setTicketInfo(data);

      setIssueType("Technical Issue");
      setSupportMsg("");

      loadTickets();
    } catch (err) {
      console.error(err);
      alert("Support request failed");
    }
  };

  const faqs = [
    {
      q: "How does the AI summarization work?",
      a: "Our system uses advanced Large Language Models (Gemini Pro) to analyze the abstract and content of research papers, extracting key methodologies, findings, and contributions automatically.",
    },
    {
      q: "Which academic databases are supported?",
      a: "Currently, we fetch papers from arXiv, Semantic Scholar, CrossRef, and OpenAlex. We are constantly adding more sources.",
    },
    {
      q: "Is my uploaded data secure?",
      a: "Yes, all uploaded papers are stored securely and are only accessible by you. We do not use your private research data to train our models.",
    },
    {
      q: "How do I export my analysis?",
      a: "Premium users can export comparative analysis and research gap reports as PDF or Markdown files directly from the Results & Analysis module.",
    },
  ];

  const cards = [
    {
      icon: Book,
      title: "Documentation",
      desc: "Read our comprehensive guide on how to use the system.",
      action: () =>
        window.open(
          "https://intelligent-research-discovery-system-production.up.railway.app/docs/ILRS_Documentation.pdf",
          "_blank"
        ),
    },
    {
      icon: MessageCircle,
      title: "Community",
      desc: "Join our researcher community to share tips and tricks.",
      action: loadCommunity,
    },
    {
      icon: Mail,
      title: "Direct Support",
      desc: "Can't find what you need? Contact our support team.",
      action: () => {
        setShowSupport(true);
        setShowCommunity(false);
        loadTickets();
      },
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          Help & Support
        </h2>

        <p className="text-slate-500 mt-4">
          Everything you need to know about the
          Intelligent Literature Review System.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((item, i) => (
          <div
            key={i}
            onClick={item.action}
            className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <item.icon className="text-blue-600 w-6 h-6" />
            </div>

            <h3 className="font-bold text-slate-900 mb-2">
              {item.title}
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* DIRECT SUPPORT */}
      {showSupport && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-xl">
            Direct Support
          </h3>

          <div className="flex flex-wrap gap-3">
            {[
              "Upload Problem",
              "Login Problem",
              "Search Issue",
              "AI Summary Failed",
              "Citation Error",
            ].map((x) => (
              <button
                key={x}
                onClick={() => setSupportMsg(x)}
                className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm"
              >
                {x}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-xl">
              🟢 Search Engine : Active
            </div>

            <div className="p-4 bg-green-50 rounded-xl">
              🟢 Upload Module : Active
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl">
              🟡 AI Summary : Limited
            </div>

            <div className="p-4 bg-green-50 rounded-xl">
              🟢 Citation Engine : Active
            </div>
          </div>

          {ticketInfo && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="font-semibold text-green-700">
                Ticket Submitted Successfully
              </div>

              <div className="text-sm mt-2">
                Ticket ID: <b>{ticketInfo.ticket_id}</b>
              </div>

              <div className="text-sm">
                Status: <b>{ticketInfo.status}</b>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            <input
              placeholder="Name"
              value={supportName}
              onChange={(e) =>
                setSupportName(e.target.value)
              }
              className="border rounded-xl px-4 py-3"
            />

            <input
              placeholder="Email"
              value={supportEmail}
              onChange={(e) =>
                setSupportEmail(e.target.value)
              }
              className="border rounded-xl px-4 py-3"
            />

            <select
              value={issueType}
              onChange={(e) =>
                setIssueType(e.target.value)
              }
              className="border rounded-xl px-4 py-3"
            >
              <option>Technical Issue</option>
              <option>Bug Report</option>
              <option>Account Problem</option>
              <option>Feature Request</option>
              <option>Payment Issue</option>
            </select>

            <textarea
              rows={5}
              placeholder="Describe your issue..."
              value={supportMsg}
              onChange={(e) =>
                setSupportMsg(e.target.value)
              }
              className="border rounded-xl px-4 py-3"
            />

            <button
              onClick={submitSupport}
              className="bg-blue-600 text-white py-3 rounded-xl font-semibold"
            >
              Submit Ticket
            </button>
          </div>

          {tickets.length > 0 && (
            <div className="mt-6">
              <h4 className="font-bold mb-3">
                My Tickets
              </h4>

              <div className="space-y-3">
                {tickets.map((t, i) => (
                  <div
                    key={i}
                    className="p-4 border rounded-xl bg-slate-50"
                  >
                    <div className="font-semibold">
                      {t.ticket_id}
                    </div>

                    <div className="text-sm text-slate-600">
                      {t.issue_type}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      Status: {t.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* COMMUNITY */}
      {showCommunity && communityData && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <Users className="text-blue-600" />
            Research Community
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold flex gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                Most Searched Topics
              </h4>

              <div className="space-y-2">
                {communityData.top?.map((item: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => {
                      localStorage.setItem(
                        "communitySearch",
                        item.query
                      );
                      window.location.href =
                        "/dashboard/search";
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50"
                  >
                    {item.query}
                    <span className="float-right text-xs text-slate-400">
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold flex gap-2 mb-3">
                <Clock className="w-5 h-5 text-green-600" />
                Recent Queries
              </h4>

              <div className="space-y-2">
                {communityData.recent?.map((item: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => {
                      localStorage.setItem(
                        "communitySearch",
                        item.query
                      );
                      window.location.href =
                        "/dashboard/search";
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-green-50"
                  >
                    {item.query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="text-blue-600 w-5 h-5" />
            Frequently Asked Questions
          </h3>
        </div>

        <div className="divide-y divide-slate-50">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.q}
              answer={faq.a}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left py-2 group"
      >
        <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
          {question}
        </span>

        <ChevronDown
          className={cn(
            "w-5 h-5 text-slate-400 transition-transform",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-slate-500 py-4 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
} 