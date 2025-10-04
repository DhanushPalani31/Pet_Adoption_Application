import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Calendar, MapPin, Phone, Mail, FileText, Plus } from 'lucide-react';

const ApplicationDetailPage = ({ applicationId, onBack }) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [meetGreet, setMeetGreet] = useState({
    date: '',
    location: '',
    notes: '',
  });
  const [showMeetGreetForm, setShowMeetGreetForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/applications/${applicationId}`);
      setApplication(data);
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.put(`/applications/${applicationId}/status`, { status: newStatus });
      fetchApplication();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update application status');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    try {
      await axios.post(`/applications/${applicationId}/notes`, { content: note });
      setNote('');
      fetchApplication();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  };

  const handleScheduleMeetGreet = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/applications/${applicationId}/meet-greet`, meetGreet);
      setShowMeetGreetForm(false);
      setMeetGreet({ date: '', location: '', notes: '' });
      fetchApplication();
      alert('Meet & Greet scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling meet & greet:', error);
      alert('Failed to schedule meet & greet');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xl text-gray-600">Application not found</p>
        </div>
      </div>
    );
  }

  const isShelter = user.role === 'shelter';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Applications</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Application for {application.pet?.name}
              </h1>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>
            {application.pet?.photos?.[0] && (
              <img
                src={application.pet.photos[0].url}
                alt={application.pet.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                {isShelter ? 'Applicant Information' : 'Shelter Information'}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <FileText className="w-5 h-5 mr-2" />
                  <span>{isShelter ? application.applicant?.name : application.shelter?.name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>{isShelter ? application.applicant?.email : application.shelter?.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>{isShelter ? application.applicant?.phone : application.shelter?.phone}</span>
                </div>
                {isShelter && application.applicant?.address && (
                  <div className="flex items-start text-gray-600">
                    <MapPin className="w-5 h-5 mr-2 mt-1" />
                    <span>
                      {application.applicant.address.street}, {application.applicant.address.city},{' '}
                      {application.applicant.address.state} {application.applicant.address.zipCode}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Pet Information</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Species:</strong> {application.pet?.species}</p>
                <p><strong>Breed:</strong> {application.pet?.breed}</p>
                <p><strong>Age:</strong> {application.pet?.age?.value} {application.pet?.age?.unit}</p>
                <p><strong>Size:</strong> {application.pet?.size}</p>
                <p><strong>Adoption Fee:</strong> ${application.pet?.adoptionFee}</p>
              </div>
            </div>
          </div>

          {application.applicationData && (
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Application Details</h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                <div>
                  <p className="font-medium">Housing Type</p>
                  <p>{application.applicationData.housingType}</p>
                </div>
                <div>
                  <p className="font-medium">Own/Rent</p>
                  <p>{application.applicationData.ownRent}</p>
                </div>
                <div>
                  <p className="font-medium">Household Members</p>
                  <p>{application.applicationData.householdMembers}</p>
                </div>
                <div>
                  <p className="font-medium">Has Yard</p>
                  <p>{application.applicationData.hasYard ? 'Yes' : 'No'}</p>
                </div>
                {application.applicationData.otherPets && (
                  <div className="md:col-span-2">
                    <p className="font-medium">Other Pets</p>
                    <p>{application.applicationData.otherPets}</p>
                  </div>
                )}
                {application.applicationData.reason && (
                  <div className="md:col-span-2">
                    <p className="font-medium">Reason for Adoption</p>
                    <p>{application.applicationData.reason}</p>
                  </div>
                )}
                {application.applicationData.experience && (
                  <div className="md:col-span-2">
                    <p className="font-medium">Pet Ownership Experience</p>
                    <p>{application.applicationData.experience}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {application.additionalInfo && (
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Additional Information</h3>
              <p className="text-gray-600">{application.additionalInfo}</p>
            </div>
          )}

          {application.meetGreet?.scheduled && (
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Meet & Greet Scheduled</h3>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 mb-2">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span><strong>Date:</strong> {new Date(application.meetGreet.date).toLocaleString()}</span>
                </div>
                <div className="flex items-start text-gray-700 mb-2">
                  <MapPin className="w-5 h-5 mr-2 mt-1" />
                  <span><strong>Location:</strong> {application.meetGreet.location}</span>
                </div>
                {application.meetGreet.notes && (
                  <div className="text-gray-700">
                    <strong>Notes:</strong> {application.meetGreet.notes}
                  </div>
                )}
              </div>
            </div>
          )}

          {isShelter && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Actions</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {application.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate('reviewing')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Start Review
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('approved')}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('rejected')}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </>
                )}
                {application.status === 'reviewing' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate('approved')}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('rejected')}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </>
                )}
                {!application.meetGreet?.scheduled && application.status !== 'rejected' && (
                  <button
                    onClick={() => setShowMeetGreetForm(!showMeetGreetForm)}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                  >
                    Schedule Meet & Greet
                  </button>
                )}
              </div>

              {showMeetGreetForm && (
                <form onSubmit={handleScheduleMeetGreet} className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-700 mb-4">Schedule Meet & Greet</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={meetGreet.date}
                        onChange={(e) => setMeetGreet({ ...meetGreet, date: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={meetGreet.location}
                        onChange={(e) => setMeetGreet({ ...meetGreet, location: e.target.value })}
                        required
                        placeholder="Address or meeting location"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={meetGreet.notes}
                        onChange={(e) => setMeetGreet({ ...meetGreet, notes: e.target.value })}
                        rows="3"
                        placeholder="Any additional instructions or information"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                      >
                        Schedule
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMeetGreetForm(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-700 mb-4">Internal Notes</h4>
                <form onSubmit={handleAddNote} className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add a note about this application..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Note</span>
                    </button>
                  </div>
                </form>

                {application.notes && application.notes.length > 0 && (
                  <div className="space-y-3">
                    {application.notes.map((note, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-700">{note.author?.name}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(note.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
