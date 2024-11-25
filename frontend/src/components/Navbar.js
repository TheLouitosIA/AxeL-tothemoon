// src/components/Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaHistory, FaUser, FaSignOutAlt } from "react-icons/fa";
import NavItem from "./NavItem";
import "./../css/Navbar.css";

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.removeItem("userId");
      setToken(null);
      navigate("/");
    }
  };

  return (
    <nav className="navbar">
      <NavItem to="/take-photo" icon={FaCamera} label="Photos" activeClass="active" />
      <NavItem to="/results" icon={FaHistory} label="Historique" activeClass="active" />
      <NavItem to="/account" icon={FaUser} label="Compte" activeClass="active" />
      <button
        onClick={handleLogout}
        className="logout-button"
        aria-label="Déconnexion"
      >
        <FaSignOutAlt className="icon" />
        <span className="link-text">Déconnexion</span>
      </button>
    </nav>
  );
};

export default Navbar;