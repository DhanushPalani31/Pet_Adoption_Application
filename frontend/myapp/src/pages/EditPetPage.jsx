import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { ArrowLeft } from 'lucide-react';

const EditPetPage = ({ pet, onNavigate, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age: { value: '', unit: 'years' },
    size: 'medium',
    gender: 'male',
    color: '',
    description: '',
    status: 'available',
    medicalHistory: {
      vaccinated: false,
      spayedNeutered: false,
      specialNeeds: '',
      medications: '',
    },
    behavior: {
      goodWithKids: false,
      goodWithPets: false,
      energyLevel: 'medium',
      trained: false,
    },
    location: {
      city: '',
      state: '',
      zipCode: '',
    },
    adoptionFee: 0,
    photos: [{ url: '', caption: '' }],
    videos: [{ url: '', caption: '' }],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        species: pet.species || 'dog',
        breed: pet.breed || '',
        age: pet.age || { value: '', unit: 'years' },
        size: pet.size || 'medium',
        gender: pet.gender || 'male',
        color: pet.color || '',
        description: pet.description || '',
        status: pet.status || 'available',
        medicalHistory: pet.medicalHistory || {
          vaccinated: false,
          spayedNeutered: false,
          specialNeeds: '',
          medications: '',
        },
        behavior: pet.behavior || {
          goodWithKids: false,
          goodWithPets: false,
          energyLevel: 'medium',
          trained: false,
        },
        location: pet.location || {
          city: '',
          state: '',
          zipCode: '',
        },
        adoptionFee: pet.adoptionFee || 0,
        photos: pet.photos && pet.photos.length > 0 ? pet.photos : [{ url: '', caption: '' }],
        videos: pet.videos && pet.videos.length > 0 ? pet.videos : [{ url: '', caption: '' }],
      });
    }
  }, [pet]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handlePhotoChange = (index, field, value) => {
    const newPhotos = [...formData.photos];
    newPhotos[index][field] = value;
    setFormData(prev => ({ ...prev, photos: newPhotos }));
  };

  const addPhoto = () => {
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, { url: '', caption: '' }],
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleVideoChange = (index, field, value) => {
    const newVideos = [...formData.videos];
    newVideos[index][field] = value;
    setFormData(prev => ({ ...prev, videos: newVideos }));
  };

  const addVideo = () => {
    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, { url: '', caption: '' }],
    }));
  };

  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanedData = {
        ...formData,
        age: {
          value: parseInt(formData.age.value),
          unit: formData.age.unit,
        },
        adoptionFee: parseFloat(formData.adoptionFee),
        photos: formData.photos.filter(p => p.url),
        videos: formData.videos.filter(v => v.url),
      };

      await axios.put(`/pets/${pet._id}`, cleanedData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update pet listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => onNavigate('my-pets')}
          className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to My Pets</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Pet: {pet?.name}</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="adopted">Adopted</option>
                  <option value="fostered">Fostered</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Species *
                </label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed *
                </label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="age.value"
                    value={formData.age.value}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <select
                    name="age.unit"
                    value={formData.age.unit}
                    onChange={handleChange}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adoption Fee ($)
                </label>
                <input
                  type="number"
                  name="adoptionFee"
                  value={formData.adoptionFee}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="medicalHistory.vaccinated"
                    checked={formData.medicalHistory.vaccinated}
                    onChange={handleChange}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">Vaccinated</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="medicalHistory.spayedNeutered"
                    checked={formData.medicalHistory.spayedNeutered}
                    onChange={handleChange}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">Spayed/Neutered</span>
                </label>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Needs
                </label>
                <textarea
                  name="medicalHistory.specialNeeds"
                  value={formData.medicalHistory.specialNeeds}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medications
                </label>
                <textarea
                  name="medicalHistory.medications"
                  value={formData.medicalHistory.medications}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Behavior & Temperament</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="behavior.goodWithKids"
                    checked={formData.behavior.goodWithKids}
                    onChange={handleChange}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">Good with Kids</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="behavior.goodWithPets"
                    checked={formData.behavior.goodWithPets}
                    onChange={handleChange}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">Good with Other Pets</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="behavior.trained"
                    checked={formData.behavior.trained}
                    onChange={handleChange}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">House Trained</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Energy Level
                  </label>
                  <select
                    name="behavior.energyLevel"
                    value={formData.behavior.energyLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="location.zipCode"
                    value={formData.location.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Photos</h3>
              {formData.photos.map((photo, index) => (
                <div key={index} className="flex space-x-2 mb-3">
                  <input
                    type="url"
                    placeholder="Photo URL"
                    value={photo.url}
                    onChange={(e) => handlePhotoChange(index, 'url', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Caption"
                    value={photo.caption}
                    onChange={(e) => handlePhotoChange(index, 'caption', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {formData.photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPhoto}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                + Add Another Photo
              </button>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Videos</h3>
              {formData.videos.map((video, index) => (
                <div key={index} className="flex space-x-2 mb-3">
                  <input
                    type="url"
                    placeholder="Video URL"
                    value={video.url}
                    onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Caption"
                    value={video.caption}
                    onChange={(e) => handleVideoChange(index, 'caption', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {formData.videos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addVideo}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                + Add Another Video
              </button>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Updating...' : 'Update Pet Listing'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('my-pets')}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPetPage;
