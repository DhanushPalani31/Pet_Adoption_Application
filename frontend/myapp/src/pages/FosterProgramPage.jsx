import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Heart, Home, Calendar, AlertCircle } from 'lucide-react';

const FosterProgramPage = ({ onNavigate }) => {
  const [fosterPets, setFosterPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationData, setApplicationData] = useState({
    experience: '',
    homeType: '',
    hasYard: false,
    otherPets: '',
    availability: '',
    preferences: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'foster') {
      fetchFosterPets();
    }
  }, [user]);

  const fetchFosterPets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/pets', { params: { status: 'fostered' } });
      const myFosterPets = data.pets.filter(pet => pet.fosteredBy?._id === user._id);
      setFosterPets(myFosterPets);
    } catch (error) {
      console.error('Error fetching foster pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/update-profile', {
        role: 'foster',
        fosterApplication: applicationData,
      });
      alert('Foster application submitted successfully! Please wait for approval.');
      setShowApplication(false);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application');
    }
  };

  const updatePetStatus = async (petId, notes) => {
    try {
      await axios.put(`/pets/${petId}`, { fosterNotes: notes });
      fetchFosterPets();
      alert('Status updated successfully');
    } catch (error) {
      console.error('Error updating pet status:', error);
      alert('Failed to update status');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to access foster program</h2>
            <button
              onClick={() => onNavigate('login')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'foster' && !showApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <Heart className="w-20 h-20 mx-auto mb-4 text-emerald-600" />
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Become a Foster Parent</h1>
              <p className="text-xl text-gray-600 mb-6">
                Open your home and heart to pets in need of temporary care
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <Home className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Provide Temporary Care</h3>
                  <p className="text-gray-600">
                    Foster pets stay with you temporarily while waiting for their forever homes. You provide
                    love, care, and a safe environment.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Calendar className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Flexible Commitment</h3>
                  <p className="text-gray-600">
                    Foster periods can range from a few weeks to several months. You can choose what works
                    best for your schedule and lifestyle.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <AlertCircle className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Support Provided</h3>
                  <p className="text-gray-600">
                    Shelters provide food, supplies, and veterinary care. You provide the love and attention
                    that helps pets thrive.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowApplication(true)}
                className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold text-lg"
              >
                Apply to Foster
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Foster Parent Application</h1>
            <form onSubmit={handleApplicationSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Care Experience *
                </label>
                <textarea
                  value={applicationData.experience}
                  onChange={(e) => setApplicationData({ ...applicationData, experience: e.target.value })}
                  required
                  rows="4"
                  placeholder="Tell us about your experience with pets..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home Type *
                </label>
                <select
                  value={applicationData.homeType}
                  onChange={(e) => setApplicationData({ ...applicationData, homeType: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={applicationData.hasYard}
                    onChange={(e) => setApplicationData({ ...applicationData, hasYard: e.target.checked })}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">I have a yard</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Pets in Home
                </label>
                <textarea
                  value={applicationData.otherPets}
                  onChange={(e) => setApplicationData({ ...applicationData, otherPets: e.target.value })}
                  rows="3"
                  placeholder="Please describe any other pets you have..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability *
                </label>
                <textarea
                  value={applicationData.availability}
                  onChange={(e) => setApplicationData({ ...applicationData, availability: e.target.value })}
                  required
                  rows="3"
                  placeholder="When are you available to foster? How long can you commit?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Preferences
                </label>
                <textarea
                  value={applicationData.preferences}
                  onChange={(e) => setApplicationData({ ...applicationData, preferences: e.target.value })}
                  rows="3"
                  placeholder="Any preferences for pet type, size, age, etc.?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplication(false)}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Foster Pets</h1>
          <p className="text-gray-600">Track and manage pets you're currently fostering</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600"></div>
          </div>
        ) : fosterPets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600 mb-4">You're not currently fostering any pets</p>
            <p className="text-gray-500">Contact shelters to start fostering</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fosterPets.map((pet) => (
              <div key={pet._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {pet.photos && pet.photos.length > 0 && (
                  <img
                    src={pet.photos[0].url}
                    alt={pet.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pet.name}</h3>
                  <p className="text-gray-600 mb-4">
                    {pet.species} • {pet.breed} • {pet.age.value} {pet.age.unit}
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Shelter:</strong> {pet.shelter?.name}</p>
                    <p><strong>Foster Since:</strong> {new Date(pet.updatedAt).toLocaleDateString()}</p>
                  </div>
                  {pet.fosterNotes && (
                    <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                      <p className="text-sm text-gray-700"><strong>Notes:</strong> {pet.fosterNotes}</p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      const notes = prompt('Enter status update or notes:', pet.fosterNotes || '');
                      if (notes !== null) updatePetStatus(pet._id, notes);
                    }}
                    className="w-full mt-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FosterProgramPage;
