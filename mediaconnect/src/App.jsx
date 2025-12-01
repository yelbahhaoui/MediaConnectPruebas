import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
// 1. IMPORTANTE: Importamos la nueva página Home
import Home from './pages/Home'; 
import Anime from './pages/Anime';

const Placeholder = ({ title }) => (
  <div className="text-white text-center py-20 text-2xl">
    Página de {title} en construcción 🚧
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
        <Navbar />
        
        <Routes>
          {/* 2. IMPORTANTE: Cambiamos el element del path "/" para usar <Home /> */}
          <Route path="/" element={<Home />} />
          
          <Route path="/anime" element={<Anime />} />
          
          <Route path="/movies" element={<Placeholder title="Películas" />} />
          <Route path="/series" element={<Placeholder title="Series" />} />
          <Route path="/games" element={<Placeholder title="Videojuegos" />} />
          {/* Añadimos ruta de registro para que no de error el botón del Home */}
          <Route path="/register" element={<Placeholder title="Registro" />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
};

export default App;