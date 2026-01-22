import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import MediaCard from '../components/media/MediaCard';
import { Filter, Settings, User, Camera, Loader } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Estado para la subida
  const [uploading, setUploading] = useState(false);
  // Estado local para forzar que la imagen cambie visualmente al instante
  const [localPhoto, setLocalPhoto] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const querySnapshot = await getDocs(collection(db, "users", user.uid, "favorites"));
        const favsData = querySnapshot.docs.map(doc => doc.data());
        setFavorites(favsData);
      } catch (error) {
        console.error("Error fetching favs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  // Sincronizar foto local con la del usuario al cargar
  useEffect(() => {
    if (user?.photoURL) {
      setLocalPhoto(user.photoURL);
    }
  }, [user]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Subir el archivo (usamos Date.now() para evitar problemas de caché con el mismo nombre)
      const storageRef = ref(storage, `avatars/${user.uid}_${Date.now()}`);
      await uploadBytes(storageRef, file);

      // 2. Obtener la URL
      const photoURL = await getDownloadURL(storageRef);

      // 3. Actualizar el perfil en Firebase
      await updateProfile(user, { photoURL });
      
      // 4. Recargar los metadatos del usuario internamente (sin recargar la página)
      await user.reload();

      // 5. Actualizar el estado local para ver el cambio INSTANTÁNEAMENTE
      setLocalPhoto(photoURL);
      
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("Error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const filteredFavs = filter === 'all' 
    ? favorites 
    : favorites.filter(item => {
        const type = item.type?.toLowerCase();
        if (filter === 'movie') return type?.includes('película') || type === 'movie';
        if (filter === 'series') return type?.includes('serie') || type === 'tv';
        if (filter === 'game') return type?.includes('juego') || type === 'game';
        if (filter === 'anime') return type?.includes('anime');
        return true;
    });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-slate-900 dark:text-slate-200 p-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-8">
        
        {/* Cabecera del Perfil */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 mb-8 shadow-lg flex flex-col md:flex-row items-center gap-6">
          
          {/* Avatar con Overlay de Carga */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl text-white font-bold border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden shrink-0">
               {/* Usamos localPhoto si existe, si no la del usuario, si no la inicial */}
               {localPhoto ? (
                 <img src={localPhoto} alt="Perfil" className="w-full h-full object-cover" />
               ) : (
                 user?.displayName ? user.displayName[0].toUpperCase() : <User />
               )}
            </div>
            
            {/* Botón flotante de cámara */}
            <button 
              onClick={triggerFileInput}
              disabled={uploading}
              className="absolute bottom-0 right-0 bg-slate-800 text-white p-2 rounded-full hover:bg-blue-600 transition-colors border-2 border-white dark:border-slate-900 shadow-md z-10"
              title="Cambiar foto"
            >
              {uploading ? <Loader size={14} className="animate-spin"/> : <Camera size={14} />}
            </button>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold">{user?.displayName || "Usuario"}</h1>
            <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
            
            {/* Texto de ayuda */}
            <button 
              onClick={triggerFileInput}
              disabled={uploading}
              className="mt-4 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center md:justify-start gap-2"
            >
              <Settings size={14} /> 
              {uploading ? "Actualizando..." : "Editar foto de perfil"}
            </button>
          </div>

          <div className="ml-auto text-center md:text-right hidden md:block">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-500">{favorites.length}</div>
            <div className="text-sm text-slate-500 uppercase font-bold tracking-wider">Favoritos</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'movie', 'series', 'anime', 'game'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full font-bold capitalize transition-all ${
                filter === f 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? 'Todos' : f}
            </button>
          ))}
        </div>

        {/* Grid de Favoritos */}
        {loading ? (
           <p className="text-center py-10 dark:text-white">Cargando biblioteca...</p>
        ) : filteredFavs.length === 0 ? (
           <div className="text-center py-20 text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
             <Filter size={48} className="mx-auto mb-4 opacity-50" />
             <p>No tienes favoritos en esta categoría.</p>
           </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredFavs.map((item) => (
              <MediaCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;