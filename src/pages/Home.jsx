import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Gamepad2, Tv, MessageCircle, ArrowRight, Star, Users } from 'lucide-react';

const Home = () => {
  // Clase común para las tarjetas de categoría
  const cardClass = "group relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 block transition-all duration-300 hover:ring-2 hover:ring-blue-500 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1";

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        
        {/* Fondo decorativo: Blanco en modo claro, Oscuro en modo oscuro */}
        <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 -z-10 transition-colors duration-300"></div>
        
        {/* Mancha de color de fondo (Glow) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent pointer-events-none"></div>

        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight transition-colors duration-300">
          Tu universo multimedia <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            en un solo lugar
          </span>
        </h1>
        
        {/* Subtítulo */}
        <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed transition-colors duration-300">
          MediaConnect es la plataforma definitiva para organizar tus películas, series, videojuegos y animes. 
          Descubre, comparte y debate con una comunidad apasionada.
        </p>
        
        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20">
            Crear cuenta gratis <ArrowRight size={20} />
          </Link>
          <Link to="/anime" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 px-8 py-4 rounded-xl font-bold text-lg border border-slate-200 dark:border-slate-700 transition-all shadow-sm">
            Explorar Catálogo
          </Link>
        </div>
      </section>

      {/* 2. FEATURES - Características */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-colors shadow-sm dark:shadow-none">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                <Star size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Listas y Valoraciones</h3>
              <p className="text-slate-600 dark:text-slate-400">Crea tu biblioteca personal. Marca lo que has visto, lo que quieres ver y puntúa tus obras favoritas.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-none">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Comunidad Activa</h3>
              <p className="text-slate-600 dark:text-slate-400">Participa en foros temáticos. ¿Teoría sobre el final de una serie? ¿Guía de un juego? Este es el lugar.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-green-500/50 transition-colors shadow-sm dark:shadow-none">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                <MessageCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Chat en Tiempo Real</h3>
              <p className="text-slate-600 dark:text-slate-400">Conecta instantáneamente con otros usuarios. Comenta estrenos en vivo mediante nuestra tecnología WebSocket.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORÍAS */}
      <section className="py-20 bg-white dark:bg-slate-900 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 flex items-center gap-3">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            Todo tu entretenimiento
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Card Películas */}
            <Link to="/movies" className={cardClass}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80" alt="Cine" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20">
                <Film className="text-red-500 mb-2" />
                <span className="text-xl font-bold text-white">Películas</span>
              </div>
            </Link>

            {/* Card Juegos */}
            <Link to="/games" className={cardClass}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80" alt="Juegos" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20">
                <Gamepad2 className="text-green-500 mb-2" />
                <span className="text-xl font-bold text-white">Videojuegos</span>
              </div>
            </Link>

            {/* Card Anime */}
            <Link to="/anime" className={cardClass}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80" alt="Anime" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 z-20">
                <Star className="text-yellow-400 mb-2 fill-yellow-400" />
                <span className="text-xl font-bold text-white">Anime</span>
              </div>
            </Link>

            {/* Card Series */}
            <Link to="/series" className={cardClass}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1576438112307-db9c736ff392?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D.com/photo-1522869635100-8f47562584a5?auto=format&fit=crop&q=80" alt="Series" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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