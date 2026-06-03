import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Doughnut, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js'
import Navbar from '../components/Navbar'
import api from '../api'
import { Users, CheckCircle, XCircle, TrendingUp, AlertTriangle, Activity } from 'lucide-react'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement)

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/dashboard').then(r => setData(r.data)).catch(() => {
      setData({ total_predictions: 0, pass_count: 0, fail_count: 0, pass_rate: 0, avg_confidence: 0, recent_predictions: [], uploads: [] })
    })
  }, [])

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full" />
    </div>
  )

  const stats = [
    { label: 'Total Predictions', value: data.total_predictions, icon: Users,         color: 'text-blue-400',   bg: 'bg-blue-500/10' },
    { label: 'Passed',            value: data.pass_count,        icon: CheckCircle,    color: 'text-green-400',  bg: 'bg-green-500/10' },
    { label: 'Failed',            value: data.fail_count,        icon: XCircle,        color: 'text-red-400',    bg: 'bg-red-500/10' },
    { label: 'Pass Rate',         value: `${data.pass_rate}%`,   icon: TrendingUp,     color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Avg Confidence',    value: `${data.avg_confidence}%`, icon: Activity,    color: 'text-amber-400',  bg: 'bg-amber-500/10' },
    { label: 'Uploads',           value: data.uploads.length,    icon: AlertTriangle,  color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  ]

  const doughnutData = {
    labels: ['Pass', 'Fail'],
    datasets: [{ data: [data.pass_count || 1, data.fail_count || 0],
      backgroundColor: ['rgba(99,102,241,0.8)', 'rgba(239,68,68,0.8)'],
      borderColor: ['#6366f1', '#ef4444'], borderWidth: 2 }]
  }

  const recentLabels = data.recent_predictions.slice(0,8).map((_, i) => `#${i+1}`)
  const barData = {
    labels: recentLabels,
    datasets: [{
      label: 'Confidence %',
      data: data.recent_predictions.slice(0,8).map(p => p.confidence),
      backgroundColor: data.recent_predictions.slice(0,8).map(p =>
        p.result === 'PASS' ? 'rgba(99,102,241,0.7)' : 'rgba(239,68,68,0.7)'),
      borderRadius: 6,
    }]
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Your prediction analytics overview</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.02 }}
              className="glass-card p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon size={22} className={s.color} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-6">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Pass vs Fail</h3>
            <div className="h-48"><Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false,
              plugins: { legend: { labels: { color: '#94a3b8' } } } }} /></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass-card p-6 col-span-2">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Recent Confidence Scores</h3>
            <div className="h-48"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
                        y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' }, min: 0, max: 100 } }
            }} /></div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card p-6">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Recent Predictions</h3>
          {data.recent_predictions.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No predictions yet. Go to Predict page to start!</p>
          ) : (
            <div className="space-y-2">
              {data.recent_predictions.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors">
                  <span className="text-sm text-slate-300">{p.created_at?.slice(0,16).replace('T',' ')}</span>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    p.result === 'PASS' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                    {p.result}
                  </span>
                  <span className="text-sm text-slate-400">{p.confidence}% confidence</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
