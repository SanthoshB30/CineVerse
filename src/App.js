import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PersonalizeProvider } from './context/PersonalizeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import ChatBot from './components/ChatBot';
import DataInitializer from './components/DataInitializer';
import ThemeInitializer from './components/ThemeInitializer';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import CreateProfilePage from './pages/CreateProfilePage';
import SelectProfilePage from './pages/SelectProfilePage';
import SwitchProfilePage from './pages/SwitchProfilePage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import ManageProfilesPage from './pages/ManageProfilesPage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import DirectorPage from './pages/DirectorPage';
import ActorPage from './pages/ActorPage';
import GenrePage from './pages/GenrePage';
import BrowseGenresPage from './pages/BrowseGenresPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AllDirectorsPage from './pages/AllDirectorsPage';
import AllActorsPage from './pages/AllActorsPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <PersonalizeProvider>
        <AuthProvider>
          <DataInitializer>
            <ThemeInitializer />
            <div className="App">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={
                <div className="error-page">
                  <h1>Password Recovery</h1>
                  <p>This feature is coming soon!</p>
                  <a href="/login" className="btn btn-primary">Back to Login</a>
                </div>
              } />
              <Route path="/create-profile" element={<CreateProfilePage />} />
              <Route path="/select-profile" element={<SelectProfilePage />} />
              <Route path="/profiles" element={
                <ProtectedRoute requireProfile={false}>
                  <>
                    <Navigation />
                    <main className="main-content">
                      <ManageProfilesPage />
                    </main>
                    <footer className="footer">
                      <p>&copy; 2025 CineVerse. Your Universe of Cinema.</p>
                    </footer>
                  </>
                </ProtectedRoute>
              } />
              <Route path="/switch-profile" element={
                <ProtectedRoute requireProfile={false}>
                  <SwitchProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/account" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <main className="main-content">
                      <AccountSettingsPage />
                    </main>
                    <ChatBot />
                    <footer className="footer">
                      <p>&copy; 2025 CineVerse. Your Universe of Cinema.</p>
                    </footer>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/home" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <main className="main-content">
                      <HomePage />
                    </main>
                    <ChatBot />
                    <footer className="footer">
                      <p>&copy; 2025 CineVerse. Your Universe of Cinema.</p>
                    </footer>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/movie/:slug" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <main className="main-content">
                      <MovieDetailPage />
                    </main>
                    <ChatBot />
                    <footer className="footer">
                      <p>&copy; 2025 CineVerse. Your Universe of Cinema.</p>
                    </footer>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/director/:slug" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <main className="main-content">
                      <DirectorPage />
                    </main>
                    <ChatBot />
                    <footer className="footer">
                      <p>&copy; 2025 CineVerse. Your Universe of Cinema.</p>
                    </footer>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/directors" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <main className="main-content">
                      <AllDirectorsPage />
                    </main>
                    <ChatBot />
                    <footer className="footer">
                      <p>&copy; 2025 CineVerse. Your Universe of Cinema.</p>
                    </footer>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/actors" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <main className="main-content">
                      <AllActorsPage />
                    </main>
                    <ChatBot />
                    <footer className="footer">
                      <p>&copy; 2025 CineVerse. Your Universe of Cinema.</p>
                    </footer>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/actor/:slug" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <main className="main-content">
                      <ActorPage />
                    </main>
                    <ChatBot />
                    <footer className="footer">
                      <p>&copy; 2025 CineVerse. Your Universe of Cinema.</p>
                    </footer>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/genres" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <main className="main-content">
                      <BrowseGenresPage />
                    </main>
                    <ChatBot />
                    <footer className="footer">
                      <p>&copy; 2025 CineVerse. Your Universe of Cinema.</p>
                    </footer>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/genre/:slug" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <main className="main-content">
                      <GenrePage />
                    </main>
                    <ChatBot />
                    <footer className="footer">
                      <p>&copy; 2025 CineVerse. Your Universe of Cinema.</p>
                    </footer>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/search" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <main className="main-content">
                      <SearchResultsPage />
                    </main>
                    <ChatBot />
                    <footer className="footer">
                      <p>&copy; 2025 CineVerse. Your Universe of Cinema.</p>
                    </footer>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={
                <div className="error-page">
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/login" className="btn btn-primary">Go to Login</a>
                </div>
              } />
            </Routes>
          </div>
          </DataInitializer>
        </AuthProvider>
      </PersonalizeProvider>
    </Router>
  );
}

export default App;

