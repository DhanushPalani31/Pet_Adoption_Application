import { useState } from 'react';
import axios from '../api/axios';
import { X } from 'lucide-react';

const ApplicationFormPage = ({ pet, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    housingType: 'house',
    ownRent: 'own',
    hasYard: false,
    landlordApproval: false,
    householdMembers: 1,
    hasChildren: false,
    childrenAges: [],
    hasPets: false,
    currentPets: [],
    experience: '',
    reason: '',
    veterinarian: { name: '', phone: '' },
    references: [{ name: '', relationship: '', phone: '', email: '' }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [field]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/applications', {
        petId: pet._id,
        applicationData: formData,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 relative">
        <div className=" relative top-0 bg-white border-b p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Adoption Application for {pet.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6 absolute t-[10]">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Housing Type
              </label>
              <select
                name="housingType"
                value={formData.housingType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you own or rent?
              </label>
              <select
                name="ownRent"
                value={formData.ownRent}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="own">Own</option>
                <option value="rent">Rent</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="hasYard"
                checked={formData.hasYard}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
              />
              <label className="ml-2 text-gray-700">I have a yard</label>
            </div>

            {formData.ownRent === 'rent' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="landlordApproval"
                  checked={formData.landlordApproval}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
                />
                <label className="ml-2 text-gray-700">I have landlord approval</label>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of household members
            </label>
            <input
              type="number"
              name="householdMembers"
              value={formData.householdMembers}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasChildren"
              checked={formData.hasChildren}
              onChange={handleChange}
              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
            />
            <label className="ml-2 text-gray-700">I have children</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasPets"
              checked={formData.hasPets}
              onChange={handleChange}
              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
            />
            <label className="ml-2 text-gray-700">I currently have other pets</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pet ownership experience
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="Tell us about your experience with pets..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why do you want to adopt {pet.name}?
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="Tell us why you want to adopt this pet..."
              required
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Veterinarian Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.veterinarian.name}
                onChange={(e) =>
                  handleNestedChange('veterinarian', 'name', e.target.value)
                }
                placeholder="Veterinarian name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="tel"
                value={formData.veterinarian.phone}
                onChange={(e) =>
                  handleNestedChange('veterinarian', 'phone', e.target.value)
                }
                placeholder="Phone number"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationFormPage;