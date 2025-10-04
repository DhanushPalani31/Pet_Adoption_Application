import { Heart, MapPin, Calendar } from 'lucide-react';

const PetCard = ({ pet, onView, onToggleFavorite, isFavorite }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'adopted':
        return 'bg-gray-100 text-gray-800';
      case 'fostered':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden bg-gray-200">
        {pet.photos && pet.photos.length > 0 ? (
          <img
            src={pet.photos[0].url}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No photo available
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(pet._id);
          }}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
            pet.status
          )}`}
        >
          {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
        </span>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-gray-800">{pet.name}</h3>
          <span className="text-lg font-semibold text-emerald-600">
            {pet.adoptionFee > 0 ? `$${pet.adoptionFee}` : 'Free'}
          </span>
        </div>

        <p className="text-gray-600 mb-3">
          {pet.breed} • {pet.gender === 'male' ? '♂' : '♀'} • {pet.age?.value} {pet.age?.unit}
        </p>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>
            {pet.location?.city}, {pet.location?.state}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
            {pet.size}
          </span>
          {pet.behavior?.goodWithKids && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              Good with kids
            </span>
          )}
          {pet.behavior?.goodWithPets && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
              Good with pets
            </span>
          )}
          {pet.medicalHistory?.vaccinated && (
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
              Vaccinated
            </span>
          )}
        </div>

        <button
          onClick={() => onView(pet)}
          className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PetCard;