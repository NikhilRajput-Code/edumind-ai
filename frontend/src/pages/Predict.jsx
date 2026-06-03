import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import { toast } from 'react-hot-toast'
import { Brain, Zap, AlertTriangle } from 'lucide-react'

const fields = [
  { key: 'study_hours',      label: 'Study Hours/day',  type: 'number', step: '0.1' },
  { key: 'attendance',       label: 'Attendance (%)',    type: 'number', step: '1'   },
  { key: 'prev_grade',       label: 'Previous Grade',    type: 'number', step: '1'   },
  { key: 'assignments_done', label: 'Assignments Done',  type: 'number', step: '1'   },
  { key: 'sleep_hours',      label: 'Sleep Hours',       type: 'number', step: '0.1' },
  { key: 'internet_access',  label: 'Internet Access',   type: 'select', options: [['1','Yes'],['0','No']] },
  { key: 'extracurricular',  label: 'Extracurricular',   type: 'select', options: [['1','Yes'],['0','No']] },
  { key: 'gender',           label: 'Gender',            type: 'select', options: [['1','Male'],['0','Female']] },
  { key: 'family_income',    label: 'Family Income',     type: 'select', options: [['1','Medium'],['0','Low'],['2','High']] },
  { key: 'parent_education', label: 'Parent Education',  type: 'select', options: [['2','Graduate'],['1','School'],['0','None'],['3','Postgrad']] },
]

const riskColor = { Low: 'text-green-400', Medium: 'text-amber-400', High: 'text-red-400' }
const riskBg    = { Low: 'bg-green-500/10', Medium: 'bg-amber-500/10', High: 'bg-red-500/10' }

export default function Predict() {
  const [form, setForm] = useState({
    student_name: 'Student A', study_hours: '5', attendance: '80',
    prev_grade: '70', assignments_done: '15', sleep_hours: '7',
    internet_access: '1', extracurricular: '1', gender: '1', family_income: '1', parent_education: '2'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [wsReady, setWsReady] = useState(false)
  const ws = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    ws.current = new WebSocket(`ws://localhost:8000/api/ws/predict?token=${token}`)
    ws.current.onopen = () => setWsReady(true)
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.status === 'processing') return
      setResult(data)
      setLoading(false)
    }
    ws.current.onerror = () => toast.error('WebSocket connection failed')
    ws.current.onclose = () => setWsReady(false)
    return () => ws.current?.close()
  }, [])

  const predict = () => {
    if (!wsReady) { toast.error('Connecting... try again in a moment'); return }
    setLoading(true); setResult(null)
    const payload = {}
    fields.forEach(f => payload[f.key] = parseFloat(form[f.key]))
    ws.current.send(JSON.stringify(payload))
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="text-indigo-400" /> Live Prediction
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <Zap size={14} className="text-indigo-400" />
            Powered by WebSocket —
            <span className={wsReady ? 'text-green-400' : 'text-amber-400'}>
              {wsReady ? '● Connected' : '○ Connecting...'}
            </span>
          </p>
        </motion.div>

        <div className="grid grid-cols-5 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 col-span-3">
            <div className="mb-4">
              <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Student Name</label>
              <input className="input-field" value={form.student_name}
                onChange={e => setForm({...form, student_name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {fields.map(f => (
                <div key={f.key}>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">{f.label}</label>
                  {f.type === 'select' ? (
                    <select className="input-field" value={form[f.key]}
                      onChange={e => setForm({...form, [f.key]: e.target.value})}>
                      {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  ) : (
                    <input type="number" step={f.step} className="input-field"
                      value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} />
                  )}
                </div>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={predict} disabled={loading || !wsReady}
              className="btn-primary w-full py-3 mt-6 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Analyzing...</>
              ) : (
                <><Zap size={16} /> Predict Now</>
              )}
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="col-span-2 flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card p-6">
                  <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-4">Result</h3>
                  <div className={`text-5xl font-extrabold mb-2 ${result.result === 'PASS' ? 'text-green-400' : 'text-red-400'}`}>
                    {result.result === 'PASS' ? '✓ PASS' : '✗ FAIL'}
                  </div>
                  <div className="text-slate-400 text-sm mb-6">{form.student_name}</div>
                  <div className="space-y-3">
                    {[
                      ['Confidence',       `${result.confidence}%`,       'text-indigo-400'],
                      ['Pass Probability', `${result.pass_probability}%`, 'text-green-400'],
                      ['Fail Probability', `${result.fail_probability}%`, 'text-red-400'],
                    ].map(([l, v, c]) => (
                      <div key={l} className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">{l}</span>
                        <span className={`text-sm font-bold ${c}`}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className={`mt-4 p-3 rounded-xl ${riskBg[result.risk_level]} flex items-center gap-2`}>
                    <AlertTriangle size={16} className={riskColor[result.risk_level]} />
                    <span className={`text-sm font-semibold ${riskColor[result.risk_level]}`}>
                      {result.risk_level} Risk
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-slate-400 mb-2">Pass probability</div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${result.pass_probability}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${result.result === 'PASS' ? 'bg-gradient-to-r from-indigo-500 to-green-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`} />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" className="glass-card p-6 flex flex-col items-center justify-center h-64 text-center">
                  <Brain size={40} className="text-indigo-400/40 mb-3" />
                  <p className="text-slate-500 text-sm">Fill the form and click<br />Predict Now</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="glass-card p-4">
              <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-3">How it works</h3>
              {['Input student data', 'WebSocket sends to FastAPI', 'XGBoost model predicts', 'Result returned live'].map((s, i) => (
                <div key={i} className="flex items-center gap-3 mb-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-bold">{i+1}</div>
                  <span className="text-xs text-slate-400">{s}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
