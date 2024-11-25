import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import './css/auth.css';
import logo from './img/Logo Axel.png'; // Import du logo

const Auth = ({ setToken }) => {
  const [formToShow, setFormToShow] = useState("login");

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setFormToShow("login");
  }, []);

  const goToRegister = () => {
    setErrorMessage("");
    setFormToShow("register");
  };

  const goBack = () => {
    setErrorMessage("");
    setFormToShow("login");
  };

  return (
    <div className="auth-container">
      {/* Affichage du logo */}
      <img src={logo} alt="Logo" className="auth-logo" />
      <h1>Bienvenue</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {formToShow === "login" && (
        <Login 
          setToken={setToken} 
          goToRegister={goToRegister} 
          setErrorMessage={setErrorMessage} 
        />
      )}

      {formToShow === "register" && (
        <Register 
          goToLogin={goBack} 
          setErrorMessage={setErrorMessage} 
        />
      )}

      <div className="toggle-form">
        {formToShow === "login" ? (
          <button onClick={goToRegister}>Créer un compte</button>
        ) : (
          <button onClick={goBack}>Retour à la connexion</button>
        )}
      </div>
    </div>
  );
};

export default Auth;