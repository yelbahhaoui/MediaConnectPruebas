import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    if (password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password, username);
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está registrado.');
      } else {
        setError('Error al crear la cuenta. Inténtalo de nuevo.');
      }
    }
    setLoading(false);
  };

  return (
    // 1. Fondo adaptable
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors duration-300">
      
      {/* 2. Tarjeta adaptable */}
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl transition-all duration-300">
        
        <div className="text-center mb-8">
          {/* 3. Textos adaptables */}
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Crear Cuenta</h2>
          <p className="text-slate-600 dark:text-slate-400">Únete a la comunidad de MediaConnect</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre de Usuario */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input
              type="text"
              required
              placeholder="Nombre de usuario"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input
              type="email"
              required
              placeholder="Correo electrónico"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input
              type="password"
              required
              placeholder="Confirmar contraseña"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-6 shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Creando cuenta...' : (
              <>Registrarse <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <p className="text-center text-slate-600 dark:text-slate-500 mt-6 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-bold hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;