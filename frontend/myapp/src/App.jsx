import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PetDetailPage from './pages/PetDetailPage';
import ApplicationFormPage from './pages/ApplicationFormPage';
import ApplicationsPage from './pages/ApplicationsPage';
import FavoritesPage from './pages/FavoritesPage';
import MessagesPage from './pages/MessagesPage';
import MyPetsPage from './pages/MyPetsPage';
import AddPetPage from './pages/AddPetPage';
import EditPetPage from './pages/EditPetPage';
import FosterProgramPage from './pages/FosterProgramPage';
import "./App.css"

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPetDetail, setShowPetDetail] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setShowPetDetail(false);
    setShowApplicationForm(false);
  };

  const handleViewPet = (pet) => {
    setSelectedPet(pet);
    setShowPetDetail(true);
  };

  const handleApply = (pet) => {
    setSelectedPet(pet);
    setShowPetDetail(false);
    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    setShowApplicationForm(false);
    alert('Application submitted successfully!');
    handleNavigate('applications');
  };

  const handlePetSuccess = () => {
    alert('Pet listing saved successfully!');
    handleNavigate('my-pets');
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet);
    handleNavigate('edit-pet');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onViewPet={handleViewPet} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'applications':
        return <ApplicationsPage />;
      case 'favorites':
        return <FavoritesPage onViewPet={handleViewPet} />;
      case 'messages':
        return <MessagesPage />;
      case 'my-pets':
        return <MyPetsPage onNavigate={handleNavigate} onEditPet={handleEditPet} />;
      case 'add-pet':
        return <AddPetPage onNavigate={handleNavigate} onSuccess={handlePetSuccess} />;
      case 'edit-pet':
        return <EditPetPage pet={editingPet} onNavigate={handleNavigate} onSuccess={handlePetSuccess} />;
      case 'foster':
        return <FosterProgramPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onViewPet={handleViewPet} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigate} />
        {renderPage()}

        {showPetDetail && selectedPet && (
          <PetDetailPage
            pet={selectedPet}
            onClose={() => setShowPetDetail(false)}
            onApply={handleApply}
          />
        )}

        {showApplicationForm && selectedPet && (
          <ApplicationFormPage
            pet={selectedPet}
            onClose={() => setShowApplicationForm(false)}
            onSuccess={handleApplicationSuccess}
          />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;