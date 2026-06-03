import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Brain, Upload, LogOut } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const name = localStorage.getItem('name')
  const logout = () => { localStorage.clear(); navigate('/') }
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/predict',   label: 'Predict',   icon: Brain },
    { to: '/upload',    label: 'Upload',     icon: Upload },
  ]
  return (
    <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="glass sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">E</div>
        <span className="font-bold text-white text-lg">EduMind <span className="gradient-text">AI</span></span>
      </Link>
      <div className="flex items-center gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === to ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              <Icon size={15} />{label}
            </motion.div>
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400">Hi, <span className="text-white font-medium">{name}</span></span>
        <motion.button whileTap={{ scale: 0.95 }} onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 text-sm transition-all">
          <LogOut size={15} /> Logout
        </motion.button>
      </div>
    </motion.nav>
  )
}
