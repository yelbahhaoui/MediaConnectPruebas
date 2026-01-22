import React from 'react';
import { Github, Twitter, Instagram, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // <--- IMPORTAMOS EL CONTEXTO

const Footer = () => {
  const { user } = useAuth(); // <--- OBTENEMOS EL USUARIO

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              MediaConnect
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Tu plataforma definitiva para organizar, descubrir y compartir tu pasión por el contenido multimedia.
            </p>
          </div>

          {/* Columna 2: Explorar */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Explorar</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/movies" className="hover:text-blue-500 transition-colors">Películas</Link></li>
              <li><Link to="/series" className="hover:text-blue-500 transition-colors">Series TV</Link></li>
              <li><Link to="/anime" className="hover:text-blue-500 transition-colors">Anime</Link></li>
              <li><Link to="/games" className="hover:text-blue-500 transition-colors">Videojuegos</Link></li>
            </ul>
          </div>

          {/* Columna 3: Comunidad (LÓGICA CAMBIADA) */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Comunidad</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/forum" className="hover:text-blue-500 transition-colors">Foros de Discusión</Link></li>
              
              {/* CONDICIONAL: Si NO hay usuario, muestra Login/Registro */}
              {!user ? (
                <>
                  <li><Link to="/register" className="hover:text-blue-500 transition-colors">Registrarse</Link></li>
                  <li><Link to="/login" className="hover:text-blue-500 transition-colors">Iniciar Sesión</Link></li>
                </>
              ) : (
                /* Si HAY usuario, muestra enlace al perfil */
                <li><Link to="/profile" className="hover:text-blue-500 transition-colors font-bold text-blue-600 dark:text-blue-400">Ir a mi Perfil</Link></li>
              )}
            </ul>
          </div>

          {/* Columna 4: Social */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-500 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-500 text-sm flex items-center justify-center gap-1">
            Hecho con <Heart size={14} className="text-red-500 fill-red-500" /> por Yahya El Bahhaoui Souri &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;