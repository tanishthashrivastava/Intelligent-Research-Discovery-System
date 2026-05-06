import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { askAssistant } from '../services/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant({ user }: any) {

  // ✅ SAFE NAME FIX
  const userName = user?.name?.split?.(' ')?.[0] || "User";

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello ${userName}! I'm your AI Research Assistant. How can I help you today?`
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  // =========================
  // SEND MESSAGE
  // =========================
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');

    setMessages(prev => [
      ...prev,
      { role: 'user', content: userMsg }
    ]);

    setLoading(true);

    try {
      const response = await askAssistant(
        userMsg,
        user?.email || "guest"
      );
  

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response || "No response generated."
        }
      ]);

    } catch (err) {
      console.error(err);

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: " AI server error. Try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CLEAR CHAT
  // =========================
  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Hello ${userName}! How can I help you today?`
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-white rounded-2xl border shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold">Research Assistant</h3>
            <span className="text-xs text-green-600">● Online</span>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="text-xs text-gray-500 hover:text-blue-600"
        >
          Clear Chat
        </button>
      </div>

      {/* CHAT */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-5"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 max-w-[80%] ${
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            }`}
          >

            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              msg.role === 'user'
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600"
            }`}>
              {msg.role === 'user'
                ? <User size={16} />
                : <Bot size={16} />
              }
            </div>

            <div className={`p-3 rounded-xl text-sm ${
              msg.role === 'user'
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}>
              {msg.content}
            </div>

          </motion.div>
        ))}

        {/* LOADING */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="p-3 bg-gray-100 text-gray-500 rounded-xl flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* INPUT */}
      <form onSubmit={handleSend} className="p-4 border-t bg-slate-50">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask anything about research..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-3 pr-12 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </form>

    </div>
  );
} 