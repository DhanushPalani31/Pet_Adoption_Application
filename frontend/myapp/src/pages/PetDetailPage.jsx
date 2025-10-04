import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/ReviewSection';
import {
  MapPin,
  Calendar,
  Heart,
  DollarSign,
  Phone,
  Mail,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PetDetailPage = ({ pet, onClose, onApply }) => {
  const [petData, setPetData] = useState(pet);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (pet._id) {
      fetchPetDetails();
    }
  }, [pet._id]);

  const fetchPetDetails = async () => {
    try {
      const { data } = await axios.get(`/pets/${pet._id}`);
      setPetData(data);
    } catch (error) {
      console.error('Error fetching pet details:', error);
    }
  };

  const nextImage = () => {
    if (petData.photos && petData.photos.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % petData.photos.length);
    }
  };

  const prevImage = () => {
    if (petData.photos && petData.photos.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + petData.photos.length) % petData.photos.length
      );
    }
  };

  const handleMessage = async () => {
    try {
      const participantId = petData.shelter?._id || petData.owner?._id;
      if (!participantId) {
        console.error("No participant found for messaging");
        return;

      }

      const { data } = await axios.post("/messages/conversations", {
        participantId,
        petId: petData._id,
      });

      navigate(`/messages?conversation=${data._id}`);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div>
            <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden mb-4">
              {petData.photos && petData.photos.length > 0 ? (
                <>
                  <img
                    src={petData.photos[currentImageIndex].url}
                    alt={petData.name}
                    className="w-full h-full object-cover"
                  />
                  {petData.photos.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-75 rounded-full hover:bg-opacity-100"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-75 rounded-full hover:bg-opacity-100"
                      >
                        →
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No photo available
                </div>
              )}
            </div>

            {petData.photos && petData.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {petData.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.url}
                    alt={`${petData.name} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer ${
                      index === currentImageIndex ? 'ring-2 ring-emerald-600' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="overflow-y-auto max-h-[600px]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{petData.name}</h1>
                <p className="text-xl text-gray-600">
                  {petData.breed} • {petData.gender === 'male' ? 'Male' : 'Female'}
                </p>
              </div>
              <span className="text-2xl font-bold text-emerald-600">
                {petData.adoptionFee > 0 ? `${petData.adoptionFee}` : 'Free'}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span>
                  {petData.age?.value} {petData.age?.unit} old
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>
                  {petData.location?.city}, {petData.location?.state}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">About {petData.name}</h3>
              <p className="text-gray-700 leading-relaxed">{petData.description}</p>
            </div>

            {/* ---- Apply + Message Buttons ---- */}
            {user && user.role === 'adopter' && petData.status === 'available' && (
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => onApply(petData)}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-lg"
                >
                  Apply to Adopt
                </button>
                <button
                  onClick={handleMessage}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                >
                  Message
                </button>
              </div>
            )}

            <ReviewSection
              petId={petData._id}
              reviews={petData.reviews || []}
              onReviewAdded={fetchPetDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailPage;
