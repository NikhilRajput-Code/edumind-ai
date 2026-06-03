import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../api'
import { Brain } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const submit = async () => {
    if (!form.name || !form.email || !form.password) { toast.error('Fill all fields'); return }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('name', data.name)
      toast.success(`Welcome, ${data.name}!`)
      navigate('/dashboard')
    } catch (e) { toast.error(e.response?.data?.detail || 'Registration failed') }
    setLoading(false)
  }
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Brain size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-slate-400 text-sm mt-1">Start predicting student outcomes</p>
        </div>
        <div className="space-y-4">
          {[['name','Full Name','text','Your Name'],['email','Email','email','you@example.com'],['password','Password','password','••••••••']].map(([f,l,t,ph]) => (
            <div key={f}>
              <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">{l}</label>
              <input type={t} className="input-field" placeholder={ph}
                value={form[f]} onChange={e => setForm({...form,[f]:e.target.value})}
                onKeyDown={e => e.key === 'Enter' && submit()} />
            </div>
          ))}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={submit} disabled={loading} className="btn-primary w-full py-3 mt-2 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Account'}
          </motion.button>
        </div>
        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
