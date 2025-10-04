import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, XCircle, Calendar, Eye } from 'lucide-react';
import ApplicationDetailPage from './ApplicationDetailPage';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = filter ? { status: filter } : {};
      const { data } = await axios.get('/applications', { params });
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await axios.put(`/applications/${applicationId}/status`, { status: newStatus });
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (selectedApplication) {
    return (
      <ApplicationDetailPage
        applicationId={selectedApplication}
        onBack={() => {
          setSelectedApplication(null);
          fetchApplications();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {user.role === 'shelter' ? 'Adoption Applications' : 'My Applications'}
          </h1>
          <p className="text-gray-600">
            {user.role === 'shelter'
              ? 'Review and manage adoption applications'
              : 'Track your adoption applications'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === ''
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'pending'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('reviewing')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'reviewing'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reviewing
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'approved'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'rejected'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-xl text-gray-600">No applications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {application.pet?.photos?.[0] && (
                      <img
                        src={application.pet.photos[0].url}
                        alt={application.pet.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {application.pet?.name || 'Unknown Pet'}
                      </h3>
                      {user.role === 'shelter' ? (
                        <p className="text-gray-600">
                          Applicant: {application.applicant?.name}
                        </p>
                      ) : (
                        <p className="text-gray-600">
                          Shelter: {application.shelter?.name}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusIcon(application.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedApplication(application._id)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    {user.role === 'shelter' && application.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(application._id, 'reviewing')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Start Review
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application._id, 'approved')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application._id, 'rejected')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {user.role === 'shelter' && application.status === 'reviewing' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(application._id, 'approved')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application._id, 'rejected')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {application.applicationData && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-gray-700 mb-2">Application Details:</h4>
                    <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <p>Housing: {application.applicationData.housingType}</p>
                      <p>Own/Rent: {application.applicationData.ownRent}</p>
                      <p>
                        Household members: {application.applicationData.householdMembers}
                      </p>
                      <p>Has yard: {application.applicationData.hasYard ? 'Yes' : 'No'}</p>
                    </div>
                    {application.applicationData.reason && (
                      <div className="mt-3">
                        <p className="font-semibold text-gray-700 text-sm">Reason:</p>
                        <p className="text-gray-600 text-sm">
                          {application.applicationData.reason}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;