import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      console.error(err);
      setError('Email o contraseña incorrectos.');
    }
    setLoading(false);
  };

  return (
    // 1. Fondo: Gris claro en día, oscuro en noche
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors duration-300">
      
      {/* 2. Tarjeta: Blanca en día, oscura en noche */}
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl transition-all duration-300">
        
        <div className="text-center mb-8">
          {/* 3. Textos: Oscuros en día, blancos en noche */}
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Bienvenido de nuevo</h2>
          <p className="text-slate-600 dark:text-slate-400">Accede a tu cuenta de MediaConnect</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            {/* 4. Inputs: Fondo gris suave en día */}
            <input
              type="email"
              required
              placeholder="Correo electrónico"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input
              type="password"
              required
              placeholder="Contraseña"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-6 shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Iniciando...' : (
              <>Iniciar Sesión <LogIn size={20} /></>
            )}
          </button>
        </form>

        <p className="text-center text-slate-600 dark:text-slate-500 mt-6 text-sm">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-bold hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;