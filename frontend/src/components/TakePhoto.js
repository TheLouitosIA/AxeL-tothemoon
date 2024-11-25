// src/components/TakePhoto.js
import React, { useState, useEffect } from "react";
import { detectVehiclePhoto, fetchPhotosByUser } from "./API";
import { useNavigate } from "react-router-dom";
import "../css/TakePhoto.css";

const TakePhoto = () => {
  const [message, setMessage] = useState("");
  const [validationStatus, setValidationStatus] = useState(null);
  const [validatedTypes, setValidatedTypes] = useState([]); // Liste des types validés
  const [allValidated, setAllValidated] = useState(false); // État pour vérifier si tout est validé
  const [userId, setUserId] = useState(null);
  const photoTypes = [
    { type: "face", label: "Photo de face" },
    { type: "droite", label: "Photo côté droit" },
    { type: "gauche", label: "Photo côté gauche" },
    { type: "plaque", label: "Photo arrière + plaque" },
    { type: "compteur", label: "Photo compteur" },
  ];
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);

      // Charger les photos déjà validées au démarrage
      const fetchValidatedPhotos = async () => {
        try {
          const photos = await fetchPhotosByUser(storedUserId);
          const validated = photos
            .filter((photo) => photo.statut_validation === "validé")
            .map((photo) => photo.type_photo);
          setValidatedTypes(validated);

          // Vérifier si tout est déjà validé
          if (validated.length === photoTypes.length) {
            setAllValidated(true);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des photos validées:", error);
        }
      };

      fetchValidatedPhotos();
    } else {
      setMessage("ID utilisateur non trouvé, veuillez vous reconnecter.");
    }
  }, []);

  const handlePhotoUpload = async (type) => {
    if (!userId) {
      setMessage("Veuillez vous reconnecter pour continuer.");
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          setMessage("Veuillez sélectionner un fichier image valide.");
          return;
        }

        try {
          setMessage("Téléversement en cours...");
          const response = await detectVehiclePhoto(file, userId, type);
          setMessage("Photo téléchargée avec succès !");
          setValidationStatus(response.validation_status);

          // Ajouter le type validé si la photo est validée
          if (response.validation_status === "validé" && !validatedTypes.includes(type)) {
            setValidatedTypes((prev) => {
              const updated = [...prev, type];
              if (updated.length === photoTypes.length) {
                setAllValidated(true); // Activer le message global si tout est validé
              }
              return updated;
            });
          }
        } catch (error) {
          setMessage(`Erreur : ${error.response?.data?.error || "Erreur lors du téléchargement de la photo"}`);
          console.error("Erreur lors de la requête de détection", error.response?.data);
          setValidationStatus(null);
        }
      }
    };
    fileInput.click();
  };

  const handleConfirmation = () => {
    setAllValidated(false); // Désactiver le message global
  };

  return (
    <div className="take-photo-container">
      <h2>Prise de Photos</h2>

      {/* Message global si tout est validé */}
      {allValidated && (
        <div className="all-validated-message">
          <h3>🎉 Toutes les photos sont validées !</h3>
          <p>Rendez-vous le mois prochain pour votre prochaine validation.</p>
          <button onClick={handleConfirmation} className="confirmation-button">
            OK
          </button>
        </div>
      )}

      {/* Masquer les boutons si tout est validé */}
      {!allValidated && (
        <>
          <p>Sélectionnez le type de photo que vous souhaitez capturer :</p>
          {photoTypes.map((photo) => (
            <button
              key={photo.type}
              onClick={() => handlePhotoUpload(photo.type)}
              className={`photo-button ${validatedTypes.includes(photo.type) ? "disabled" : ""}`}
              disabled={validatedTypes.includes(photo.type)} // Désactiver si déjà validé
            >
              {photo.label} {validatedTypes.includes(photo.type) ? "✔️" : ""}
            </button>
          ))}
        </>
      )}

      {message && <p className="upload-message">{message}</p>}

      {validationStatus && (
        <p className="validation-status">Statut de validation : {validationStatus}</p>
      )}

      {/* Boutons de navigation */}
      <div className="navigation-buttons">
        <button className="switch-button" onClick={() => navigate("/results")}>
          Voir les résultats
        </button>
      </div>
    </div>
  );
};

export default TakePhoto;