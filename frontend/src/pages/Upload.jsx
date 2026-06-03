import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import Navbar from '../components/Navbar'
import api from '../api'
import { toast } from 'react-hot-toast'
import { Upload as UploadIcon, FileText, CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react'

export default function Upload() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(async (files) => {
    const file = files[0]
    if (!file) return
    setLoading(true); setResult(null); setProgress(0)
    const formData = new FormData()
    formData.append('file', file)
    const interval = setInterval(() => setProgress(p => Math.min(p + 8, 85)), 200)
    try {
      const { data } = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      clearInterval(interval); setProgress(100)
      setTimeout(() => { setResult(data); setLoading(false) }, 400)
      toast.success(`Processed ${data.total} students!`)
    } catch (e) {
      clearInterval(interval); setLoading(false); setProgress(0)
      toast.error(e.response?.data?.detail || 'Upload failed')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'text/csv': ['.csv'] }, maxFiles: 1
  })

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <UploadIcon className="text-indigo-400" /> Bulk Upload
          </h1>
          <p className="text-slate-400 mt-1">Upload a CSV file to predict performance for all students at once</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          {...getRootProps()}
          className={`glass-card p-12 text-center cursor-pointer transition-all border-2 border-dashed mb-6 ${
            isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/50'}`}>
          <input {...getInputProps()} />
          <motion.div animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}>
            <FileText size={48} className="text-indigo-400/60 mx-auto mb-4" />
            <p className="text-white font-semibold text-lg mb-2">
              {isDragActive ? 'Drop it here!' : 'Drag & drop your CSV file'}
            </p>
            <p className="text-slate-400 text-sm mb-4">or click to browse</p>
            <span className="px-4 py-2 rounded-lg text-xs font-medium"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
              Required columns: study_hours, attendance, prev_grade, assignments_done, sleep_hours, family_income, parent_education, internet_access, extracurricular, gender
            </span>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-300 font-medium">Processing students...</span>
                <span className="text-sm text-indigo-400 font-bold">{progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Students', value: result.total,    icon: FileText,       color: 'text-blue-400',   bg: 'bg-blue-500/10' },
                  { label: 'Passed',         value: result.passed,   icon: CheckCircle,    color: 'text-green-400',  bg: 'bg-green-500/10' },
                  { label: 'Failed',         value: result.failed,   icon: XCircle,        color: 'text-red-400',    bg: 'bg-red-500/10' },
                  { label: 'At Risk',        value: result.at_risk,  icon: AlertTriangle,  color: 'text-amber-400',  bg: 'bg-amber-500/10' },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }} className="glass-card p-5 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                      <s.icon size={20} className={s.color} />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">{s.value}</div>
                      <div className="text-xs text-slate-400">{s.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="glass-card p-4 mb-4 flex items-center gap-3">
                <TrendingUp className="text-indigo-400" size={20} />
                <span className="text-white font-semibold">Pass Rate: </span>
                <span className="text-indigo-400 font-bold text-lg">{result.pass_rate}%</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden ml-4">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${result.pass_rate}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-green-500 rounded-full" />
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Results Preview</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {result.results.slice(0, 20).map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors">
                      <span className="text-sm text-slate-400">Student #{i + 1}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        r.prediction === 'PASS' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                        {r.prediction}
                      </span>
                      <span className="text-sm text-slate-300">{r.confidence}%</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        r.risk_level === 'Low' ? 'bg-green-500/10 text-green-400' :
                        r.risk_level === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                        {r.risk_level} Risk
                      </span>
                    </motion.div>
                  ))}
                </div>
                {result.results.length > 20 && (
                  <p className="text-center text-slate-500 text-xs mt-3">Showing 20 of {result.results.length} results</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
