import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes de Estructura
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer'; // <--- 1. IMPORTAR FOOTER
import ScrollToTop from './components/common/ScrollToTop'; // <--- 1. IMPORTAR

// Páginas
import Home from './pages/Home';
import Anime from './pages/Anime';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Games from './pages/Games';
import Forum from './pages/Forum';
import Details from './pages/Details';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        
        {/* Usamos flex y flex-col para que el footer se quede abajo siempre */}
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300 flex flex-col">
          
          <Navbar />
          
          {/* Flex-1 hace que el contenido ocupe todo el espacio disponible empujando el footer */}
          <main className="flex-1"> 
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/anime" element={<Anime />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/series" element={<Series />} />
              <Route path="/games" element={<Games />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/movie/:id" element={<Details type="movie" />} />
              <Route path="/series/:id" element={<Details type="series" />} />
              <Route path="/game/:id" element={<Details type="game" />} />
              <Route path="/anime/:id" element={<Details type="anime" />} />
            </Routes>
          </main>

          <Footer /> {/* <--- 2. AÑADIR FOOTER AQUÍ AL FINAL */}
          <ScrollToTop />

        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;