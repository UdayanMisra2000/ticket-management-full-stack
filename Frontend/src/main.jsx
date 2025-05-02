import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from './Pages/Homepage';
import SignUp from './Pages/SignUp';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Layout from './Components/Layout';
import ContactCenter from './Pages/ContactCenter';
import Analytics from './Pages/Analytics';
import Chatbot from './Pages/ChatBotDesigning';
import Team from './Pages/Team';
import Setting from './Pages/Setting';
import { UserProvider } from './UserContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/member" element={<Layout />}>
            <Route index element={<Dashboard />} />  {/* Default to Dashboard  */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="contact-center" element={<ContactCenter />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="team" element={<Team />} />
            <Route path="setting" element={<Setting />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
