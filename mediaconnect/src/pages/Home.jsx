import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Gamepad2, Tv, MessageCircle, ArrowRight, Star, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION - La entrada principal */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Fondo decorativo (gradiente) */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 -z-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600 via-transparent to-transparent pointer-events-none"></div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
          Tu universo multimedia <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            en un solo lugar
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-10 leading-relaxed">
          MediaConnect es la plataforma definitiva para organizar tus películas, series, videojuegos y animes. 
          Descubre, comparte y debate con una comunidad apasionada.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
            Crear cuenta gratis <ArrowRight size={20} />
          </Link>
          <Link to="/anime" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg border border-slate-700 transition-all hover:bg-slate-700/80">
            Explorar Catálogo
          </Link>
        </div>
      </section>

      {/* 2. FEATURES - ¿Qué ofrece el proyecto? */}
      <section className="py-20 bg-slate-950 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors">
              <div className="w-14 h-14 bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 text-blue-400">
                <Star size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Listas y Valoraciones</h3>
              <p className="text-slate-400">Crea tu biblioteca personal. Marca lo que has visto, lo que quieres ver y puntúa tus obras favoritas.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-colors">
              <div className="w-14 h-14 bg-purple-900/30 rounded-lg flex items-center justify-center mb-6 text-purple-400">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Comunidad Activa</h3>
              <p className="text-slate-400">Participa en foros temáticos. ¿Teoría sobre el final de una serie? ¿Guía de un juego? Este es el lugar.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-green-500/50 transition-colors">
              <div className="w-14 h-14 bg-green-900/30 rounded-lg flex items-center justify-center mb-6 text-green-400">
                <MessageCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Chat en Tiempo Real</h3>
              <p className="text-slate-400">Conecta instantáneamente con otros usuarios. Comenta estrenos en vivo mediante nuestra tecnología WebSocket.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISUAL PREVIEW - Categorías */}
      <section className="py-20 bg-slate-900 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            Todo tu entretenimiento
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card Películas */}
            <Link to="/movies" className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-800 block">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80" alt="Cine" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20">
                <Film className="text-red-500 mb-2" />
                <span className="text-xl font-bold text-white">Películas</span>
              </div>
            </Link>

            {/* Card Juegos */}
            <Link to="/games" className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-800 block">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80" alt="Juegos" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20">
                <Gamepad2 className="text-green-500 mb-2" />
                <span className="text-xl font-bold text-white">Videojuegos</span>
              </div>
            </Link>

            {/* Card Anime (Enlaza a la página que YA FUNCIONA) */}
            <Link to="/anime" className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-800 block ring-2 ring-blue-500 shadow-lg shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80" alt="Anime" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20">
                <Star className="text-yellow-400 mb-2 fill-yellow-400" />
                <span className="text-xl font-bold text-white">Anime</span>
                <span className="ml-2 text-xs bg-blue-600 px-2 py-1 rounded text-white">Live!</span>
              </div>
            </Link>

            {/* Card Series */}
            <Link to="/series" className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-800 block">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1522869635100-8f47562584a5?auto=format&fit=crop&q=80" alt="Series" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20">
                <Tv className="text-purple-500 mb-2" />
                <span className="text-xl font-bold text-white">Series TV</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;