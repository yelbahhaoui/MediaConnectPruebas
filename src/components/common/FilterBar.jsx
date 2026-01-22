import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const FilterBar = ({ onSearch, onFilterChange, genresList = [], filters }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl mb-8 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center shadow-sm transition-colors duration-300">
      
      {/* 1. BUSCADOR */}
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar por nombre..." 
          className="w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

      {/* 2. FILTROS */}
      <div className="flex flex-wrap gap-4 w-full items-center">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Filter size={16} />
          <span className="text-sm font-bold uppercase">Filtrar:</span>
        </div>

        {/* Filtro Géneros */}
        <select 
          className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none transition-colors"
          value={filters.genre}
          onChange={(e) => onFilterChange('genre', e.target.value)}
        >
          <option value="">Todos los géneros</option>
          {genresList.map((g) => (
            <option key={g.id || g} value={g.id || g}>{g.name || g}</option>
          ))}
        </select>

        {/* Filtro Año */}
        <input 
          type="number" 
          placeholder="Año (ej. 2023)"
          className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm px-3 py-2 w-32 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none placeholder-slate-500 transition-colors"
          value={filters.year}
          onChange={(e) => onFilterChange('year', e.target.value)}
        />

        {/* Filtro Puntuación */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400">Min. Rating:</span>
          <input 
            type="range" 
            min="0" max="10" step="1"
            className="w-24 accent-blue-500 cursor-pointer"
            value={filters.minRating}
            onChange={(e) => onFilterChange('minRating', e.target.value)}
          />
          <span className="text-sm font-bold text-blue-500">{filters.minRating}</span>
        </div>

        {/* Botón Limpiar */}
        {(filters.year || filters.genre || filters.minRating > 0) && (
          <button 
            onClick={() => onFilterChange('reset')}
            className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
          >
            <X size={14} /> Limpiar
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;