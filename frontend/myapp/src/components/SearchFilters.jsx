import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const SearchFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    species: '',
    breed: '',
    size: '',
    age: '',
    city: '',
    state: '',
    gender: '',
    goodWithKids: false,
    goodWithPets: false,
    trained: false,
    vaccinated: false,
    spayedNeutered: false,
    energyLevel: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      species: '',
      breed: '',
      size: '',
      age: '',
      city: '',
      state: '',
      gender: '',
      goodWithKids: false,
      goodWithPets: false,
      trained: false,
      vaccinated: false,
      spayedNeutered: false,
      energyLevel: '',
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Find Your Perfect Pet</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
          <select
            name="species"
            value={filters.species}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Species</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="rabbit">Rabbit</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
          <input
            type="text"
            name="breed"
            value={filters.breed}
            onChange={handleChange}
            placeholder="Enter breed..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <select
            name="size"
            value={filters.size}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Sizes</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Age (years)</label>
          <input
            type="number"
            name="age"
            value={filters.age}
            onChange={handleChange}
            placeholder="Any age"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="Enter city..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input
            type="text"
            name="state"
            value={filters.state}
            onChange={handleChange}
            placeholder="Enter state..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4"
      >
        {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Filters</span>
      </button>

      {showAdvanced && (
        <div className="border-t pt-6 mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Any Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Energy Level</label>
              <select
                name="energyLevel"
                value={filters.energyLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Any Energy Level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 mb-3">Temperament & Training</h4>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="goodWithKids"
                checked={filters.goodWithKids}
                onChange={handleChange}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-gray-700">Good with Kids</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="goodWithPets"
                checked={filters.goodWithPets}
                onChange={handleChange}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-gray-700">Good with Other Pets</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="trained"
                checked={filters.trained}
                onChange={handleChange}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-gray-700">House Trained</span>
            </label>
          </div>

          <div className="space-y-2 mt-4">
            <h4 className="font-medium text-gray-700 mb-3">Medical Status</h4>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="vaccinated"
                checked={filters.vaccinated}
                onChange={handleChange}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-gray-700">Vaccinated</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="spayedNeutered"
                checked={filters.spayedNeutered}
                onChange={handleChange}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-gray-700">Spayed/Neutered</span>
            </label>
          </div>
        </div>
      )}

      <button
        onClick={handleReset}
        className="w-full md:w-auto px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
      >
        Reset All Filters
      </button>
    </div>
  );
};

export default SearchFilters;