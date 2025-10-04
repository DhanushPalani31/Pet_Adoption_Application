import { useState, useEffect } from 'react';
import axios from '../api/axios';
import PetCard from '../components/PetCard';

const FavoritesPage = ({ onViewPet }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/pets/favorites');
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (petId) => {
    try {
      await axios.post(`/pets/${petId}/favorite`);
      setFavorites(favorites.filter((pet) => pet._id !== petId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Favorite Pets</h1>
          <p className="text-gray-600">Pets you've saved for later</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-xl text-gray-600">No favorite pets yet</p>
            <p className="text-gray-500 mt-2">
              Browse available pets and click the heart icon to save them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((pet) => (
              <PetCard
                key={pet._id}
                pet={pet}
                onView={onViewPet}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;