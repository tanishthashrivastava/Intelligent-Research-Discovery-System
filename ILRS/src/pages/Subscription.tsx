import { Check, CreditCard, Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';

export default function Subscription({ user }: { user: User }) {
  const plans = [
    {
      name: 'Free Plan',
      price: '$0',
      desc: 'Perfect for individual casual researchers.',
      features: ['5 AI Summaries / day', 'Basic Search', '10 Paper Library Limit', 'Standard Support'],
      button: 'Current Plan',
      current: user.subscription === 'Free'
    },
    {
      name: 'Student Plan',
      price: '$9',
      desc: 'Enhanced features for dedicated students.',
      features: ['Unlimited AI Summaries', 'Advanced Gap Detection', '100 Paper Library Limit', 'Priority Email Support', 'Export Analysis to PDF'],
      button: 'Upgrade to Student',
      current: user.subscription === 'Student',
      popular: true
    },
    {
      name: 'Institutional Plan',
      price: '$49',
      desc: 'Full power for research labs and universities.',
      features: ['Everything in Student', 'Team Collaboration', 'Unlimited Library', 'API Access', 'Dedicated Account Manager'],
      button: 'Contact Sales',
      current: user.subscription === 'Institutional'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900">Choose the Right Plan</h2>
        <p className="text-slate-500 mt-4">Unlock advanced AI capabilities and accelerate your literature review process with our premium plans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "relative p-8 rounded-3xl border bg-white flex flex-col h-full transition-all",
              plan.popular ? "border-blue-200 shadow-xl shadow-blue-100 ring-1 ring-blue-100" : "border-slate-100 shadow-sm",
              plan.current ? "bg-slate-50/50" : ""
            )}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                Most Popular
              </span>
            )}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="mt-4 text-sm text-slate-500 leading-relaxed">{plan.desc}</p>
            </div>

            <div className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="mt-1 w-4 h-4 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="text-blue-600 w-3 h-3" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <button 
              disabled={plan.current}
              className={cn(
                "w-full py-3 rounded-xl font-bold transition-all",
                plan.current 
                  ? "bg-slate-100 text-slate-400 cursor-default" 
                  : plan.popular 
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200" 
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {plan.button}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="pt-12 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { icon: Shield, label: 'Secure Payments' },
          { icon: Zap, label: 'Instant Activation' },
          { icon: Globe, label: 'Global Access' },
          { icon: CreditCard, label: 'Cancel Anytime' }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <item.icon className="text-slate-300 w-6 h-6" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
