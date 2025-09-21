import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/user/UserDashboard';
import BusinessDashboard from './pages/business/BusinessDashboard';
import CreateQueue from './pages/business/CreateQueue';
import QueueDetails from './pages/business/QueueDetails';
import JoinQueue from './pages/user/JoinQueue';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="flex flex-col min-h-screen text-slate-100">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* User Routes */}
                <Route path="/user" element={
                  <ProtectedRoute allowedRole="user">
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/queue/:queueId/join" element={
                  <ProtectedRoute allowedRole="user">
                    <JoinQueue />
                  </ProtectedRoute>
                } />
                
                {/* Business Routes */}
                <Route path="/business" element={
                  <ProtectedRoute allowedRole="business">
                    <BusinessDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/business/create-queue" element={
                  <ProtectedRoute allowedRole="business">
                    <CreateQueue />
                  </ProtectedRoute>
                } />
                <Route path="/business/queue/:queueId" element={
                  <ProtectedRoute allowedRole="business">
                    <QueueDetails />
                  </ProtectedRoute>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;