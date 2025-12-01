import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <--- IMPORTANTE
import { Menu, X, Search, LogIn } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo con Link a Home */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            MediaConnect
          </Link>

          {/* Menú Escritorio */}
          <div className="hidden md:flex space-x-8">
            <Link to="/movies" className="hover:text-blue-400 transition-colors">Películas</Link>
            <Link to="/series" className="hover:text-blue-400 transition-colors">Series</Link>
            <Link to="/anime" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">Anime</Link>
            <Link to="/games" className="hover:text-blue-400 transition-colors">Juegos</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
              <LogIn size={18} /> Acceder
            </button>
          </div>
          
          {/* Botón Móvil */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </div>
      
      {/* Menú Móvil */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 pb-4 px-4 flex flex-col gap-4">
           <Link to="/anime" className="block py-2">Anime</Link>
           {/* Resto de links... */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;