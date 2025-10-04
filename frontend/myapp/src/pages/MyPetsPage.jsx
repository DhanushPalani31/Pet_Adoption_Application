import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Plus, CreditCard as Edit, Trash2, Eye, Filter } from 'lucide-react';

const MyPetsPage = ({ onNavigate, onEditPet }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    pending: 0,
    adopted: 0,
    fostered: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchMyPets();
  }, [statusFilter]);

  const fetchMyPets = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const { data } = await axios.get('/pets', { params });

      const myPets = data.pets.filter(pet => pet.shelter._id === user._id);
      setPets(myPets);

      const statsData = {
        total: myPets.length,
        available: myPets.filter(p => p.status === 'available').length,
        pending: myPets.filter(p => p.status === 'pending').length,
        adopted: myPets.filter(p => p.status === 'adopted').length,
        fostered: myPets.filter(p => p.status === 'fostered').length,
      };
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (petId) => {
    if (!confirm('Are you sure you want to delete this pet listing?')) return;

    try {
      await axios.delete(`/pets/${petId}`);
      fetchMyPets();
    } catch (error) {
      console.error('Error deleting pet:', error);
      alert('Failed to delete pet listing');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      adopted: 'bg-blue-100 text-blue-800',
      fostered: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Pets</h1>
              <p className="text-emerald-50">Manage your pet listings and applications</p>
            </div>
            <button
              onClick={() => onNavigate('add-pet')}
              className="flex items-center space-x-2 bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Pet</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-500">
            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-gray-600 mt-1">Total Pets</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600">{stats.available}</div>
            <div className="text-gray-600 mt-1">Available</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-gray-600 mt-1">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600">{stats.adopted}</div>
            <div className="text-gray-600 mt-1">Adopted</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="text-3xl font-bold text-purple-600">{stats.fostered}</div>
            <div className="text-gray-600 mt-1">Fostered</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-700">Filter by Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'available', 'pending', 'adopted', 'fostered'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === status
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600"></div>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <p className="text-2xl text-gray-600 mb-4">No pets found</p>
            <button
              onClick={() => onNavigate('add-pet')}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
            >
              Add Your First Pet
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Species/Breed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pets.map((pet) => (
                  <tr key={pet._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          {pet.photos && pet.photos.length > 0 ? (
                            <img
                              className="h-12 w-12 rounded-full object-cover"
                              src={pet.photos[0].url}
                              alt={pet.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              {pet.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pet.species}</div>
                      <div className="text-sm text-gray-500">{pet.breed}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pet.age.value} {pet.age.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pet.status)}`}>
                        {pet.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${pet.adoptionFee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => onEditPet(pet)}
                        className="text-emerald-600 hover:text-emerald-900 inline-flex items-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeletePet(pet._id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPetsPage;
