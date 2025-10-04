import { useState, useEffect } from 'react';
import axios from '../api/axios';
import PetCard from '../components/PetCard';
import SearchFilters from '../components/SearchFilters';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, PawPrint } from 'lucide-react';

const HomePage = ({ onViewPet }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    fetchPets();
    if (user) {
      fetchFavorites();
    }
  }, [filters, currentPage, user]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const params = { ...filters, page: currentPage, limit: 12, status: 'available' };
      const { data } = await axios.get('/pets', { params });
      setPets(data.pets);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data } = await axios.get('/pets/favorites');
      setFavorites(data.map((pet) => pet._id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleToggleFavorite = async (petId) => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }

    try {
      const { data } = await axios.post(`/pets/${petId}/favorite`);
      setFavorites(data.favoritePets);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  if (user && user.role === 'shelter') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <PawPrint className="w-20 h-20 mx-auto mb-6 text-emerald-600" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Your Shelter Dashboard</h1>
          <p className="text-xl text-gray-600 mb-8">
            Click on "My Pets" in the navigation to manage your pet listings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Find Your Perfect Companion</h1>
          <p className="text-xl text-emerald-50">
            Give a loving home to pets in need of adoption
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchFilters onFilter={handleFilter} />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600"></div>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">No pets found matching your criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {pets.map((pet) => (
                <PetCard
                  key={pet._id}
                  pet={pet}
                  onView={onViewPet}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(pet._id)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-emerald-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-700 transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <span className="text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-emerald-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-700 transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;