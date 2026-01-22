import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Loader Adaptable
  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center text-slate-900 dark:text-white transition-colors duration-300">
      Cargando...
    </div>
  );

  // Mensaje de Acceso Restringido (ADAPTABLE)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors duration-300">
        
        {/* Tarjeta: Blanca en día, oscura en noche */}
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-2xl transition-all duration-300">
          
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
            <Lock size={40} className="text-slate-400 dark:text-slate-500" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">
            Acceso Restringido
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 mb-8 transition-colors">
            Para acceder al chat y a los foros, necesitas formar parte de la comunidad.
          </p>

          <Link 
            to="/login" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <LogIn size={20} />
            Iniciar Sesión
          </Link>
          
          <p className="mt-4 text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-bold transition-colors">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Si hay usuario, mostramos la página normal
  return children;
};

export default ProtectedRoute;