import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Brain, BarChart3, Upload, Zap, Shield, TrendingUp, ArrowRight } from 'lucide-react'

function Particle({ x, y, delay }) {
  return (
    <motion.div className="absolute w-1 h-1 rounded-full bg-indigo-400"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ y: [-10, 10, -10], opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay }} />
  )
}

const features = [
  { icon: Brain,      title: 'AI Predictions',   desc: 'XGBoost + Random Forest with 99%+ accuracy' },
  { icon: BarChart3,  title: 'Live Dashboard',    desc: 'Real-time analytics with animated charts' },
  { icon: Upload,     title: 'Bulk CSV Upload',   desc: 'Predict thousands of students instantly' },
  { icon: Zap,        title: 'WebSocket Speed',   desc: 'Live predictions via WebSocket connection' },
  { icon: Shield,     title: 'Secure Auth',       desc: 'JWT authentication with encrypted passwords' },
  { icon: TrendingUp, title: 'Risk Scoring',      desc: 'Low / Medium / High risk classification' },
]

const stats = [
  { value: '99.5%', label: 'Model Accuracy' },
  { value: '10K+',  label: 'Students Analyzed' },
  { value: '<50ms', label: 'Prediction Speed' },
  { value: '3',     label: 'ML Models' },
]

export default function Landing() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100, delay: i * 0.12
  }))
  return (
    <div className="min-h-screen overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl" />
        {particles.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      <motion.nav initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="glass relative z-10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">E</div>
          <span className="font-bold text-xl text-white">EduMind <span className="gradient-text">AI</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition-colors">
              Sign In
            </motion.button>
          </Link>
          <Link to="/register">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-primary text-sm">
              Get Started
            </motion.button>
          </Link>
        </div>
      </motion.nav>

      <section className="relative z-10 text-center px-8 pt-24 pb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
            Powered by XGBoost + Random Forest
          </span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-6xl font-extrabold text-white leading-tight mb-6 max-w-4xl mx-auto">
          Predict Student Performance
          <br />
          <span className="gradient-text">Before It Is Too Late</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          AI-powered analytics platform that identifies at-risk students early,
          enabling educators to intervene before outcomes become irreversible.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4">
          <Link to="/register">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2 text-base px-8 py-3">
              Start Free <ArrowRight size={18} />
            </motion.button>
          </Link>
          <Link to="/login">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all font-semibold text-base">
              Sign In
            </motion.button>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="grid grid-cols-4 gap-6 max-w-3xl mx-auto mt-20">
          {stats.map((s, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }} className="glass-card p-5 glow">
              <div className="text-3xl font-extrabold gradient-text">{s.value}</div>
              <div className="text-sm text-slate-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="relative z-10 px-8 py-20 max-w-6xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-4xl font-bold text-center text-white mb-4">
          Everything you need to <span className="gradient-text">act early</span>
        </motion.h2>
        <p className="text-center text-slate-400 mb-14">Built for educators, powered by ML</p>
        <div className="grid grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }} className="glass-card p-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center mb-4 border border-indigo-500/20">
                <f.icon size={22} className="text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-8 py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} className="glass-card glow max-w-2xl mx-auto p-12">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-slate-400 mb-8">Join educators already using EduMind to save students from failing.</p>
          <Link to="/register">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary text-base px-10 py-3">
              Create Free Account
            </motion.button>
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-10 text-center py-8 text-slate-500 text-sm border-t border-white/5">
        Built by Nikhil Rajput · EduMind AI 2025
      </footer>
    </div>
  )
}
