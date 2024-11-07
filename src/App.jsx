// src/App.jsx
import React, { useState } from "react";
import "./App.css";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./components/HomePage";
import SubscriptionsTable from "./components/SubscriptionsTable";
import ChannelPage from "./components/canales/ChannelPage";
import ChannelDetailPage from "./components/canales/ChannelDetailPage";
import ChannelAdminPage from "./components/canales/ChannelAdminPage.jsx";
import PlaylistCrudPage from "./components/playlists/PlaylistCrudPage.jsx";
import SideBar from "./components/navbar/SideBar";
import NavBar from "./components/navbar/NavBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/login/LoginPage.jsx";
import ProfileForm from "./components/ProfileForm";
import UserTable from "./components/UserTable.jsx";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
      <Router>
        <div className="app">
          <NavBar onToggleSidebar={toggleSidebar} />
          <div className="d-flex">
            <SideBar isCollapsed={isSidebarCollapsed} />
            <div className={`content ${isSidebarCollapsed ? "collapsed" : ""} p-4`}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/subscriptions" element={<SubscriptionsTable />} />
                <Route path="/channels" element={<ChannelPage />} />
                <Route path="/channels/:channelId" element={<ChannelDetailPage />} /> {/* Ruta de detalle */}
                <Route path="/profile" element={<ProfileForm />} />
                <Route path="/profile/all" element={<UserTable />} />
                <Route path="/channels/crud" element={<ChannelAdminPage />} />
                <Route path="/playlists/crud" element={<PlaylistCrudPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
  );
}

export default App;
