import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Gamepad2, Tv, MessageCircle, ArrowRight, Star, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // <--- 1. IMPORTAMOS EL CONTEXTO

const Home = () => {
  const { user } = useAuth(); // <--- 2. OBTENEMOS EL USUARIO

  const cardClass = "group relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 block transition-all duration-300 hover:ring-2 hover:ring-blue-500 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1";

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 -z-10 transition-colors duration-300"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent pointer-events-none"></div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight transition-colors duration-300">
          Tu universo multimedia <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            en un solo lugar
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed transition-colors duration-300">
          MediaConnect es la plataforma definitiva para organizar tus películas, series, videojuegos y animes. 
          Descubre, comparte y debate con una comunidad apasionada.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          
          {/* 3. CONDICIONAL: Solo mostramos este botón si NO hay usuario (!user) */}
          {!user && (
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20">
              Crear cuenta gratis <ArrowRight size={20} />
            </Link>
          )}

          <Link to="/anime" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 px-8 py-4 rounded-xl font-bold text-lg border border-slate-200 dark:border-slate-700 transition-all shadow-sm">
            Explorar Catálogo
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
              <Star size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Listas y Valoraciones</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Crea tu biblioteca personal. Marca lo que has visto, lo que quieres ver y puntúa tus obras favoritas.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Comunidad Activa</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Participa en foros temáticos. ¿Teoría sobre el final de una serie? ¿Guía de un juego? Este es el lugar.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-green-500/50 transition-colors">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
              <MessageCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Chat en Tiempo Real</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Conecta instantáneamente con otros usuarios. Comenta estrenos en vivo mediante nuestra mensajería.
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORIES PREVIEW */}
      <section className="py-20 bg-white dark:bg-slate-900 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Explora por categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/movies" className={cardClass}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
              <img src="https://image.tmdb.org/t/p/w500/aosm8NMQ3UyoBVpSxyimorCQykC.jpg" alt="Movies" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white">
                <Film size={20} /> <span className="font-bold">Películas</span>
              </div>
            </Link>
            <Link to="/series" className={cardClass}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
              <img src="https://www.themoviedb.org/t/p/w600_and_h900_face/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg" alt="Series" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white">
                <Tv size={20} /> <span className="font-bold">Series</span>
              </div>
            </Link>
            <Link to="/anime" className={cardClass}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
              <img src="https://www.themoviedb.org/t/p/w600_and_h900_face/nTnO9LyAm20NMR4NBA5eeHaIskN.jpg" alt="Anime" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white">
                <Tv size={20} /> <span className="font-bold">Anime</span>
              </div>
            </Link>
            <Link to="/games" className={cardClass}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
              <img src="https://store-images.s-microsoft.com/image/apps.47379.63407868131364914.bcaa868c-407e-42c2-baeb-48a3c9f29b54.89bb995b-b066-4a53-9fe4-0260ce07e894" alt="Games" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white">
                <Gamepad2 size={20} /> <span className="font-bold">Juegos</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;