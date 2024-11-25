// src/components/ResultsPage.js
import React, { useEffect, useState } from "react";
import { fetchPhotosByUser } from "./API";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ResultsPage.css";

const ResultsPage = () => {
  const [photos, setPhotos] = useState([]);
  const [months, setMonths] = useState([]);
  const [displayedMonths, setDisplayedMonths] = useState([]);
  const [resultsByMonth, setResultsByMonth] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [monthlyResult, setMonthlyResult] = useState(null);
  const [userId] = useState(localStorage.getItem("userId"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllMonths, setShowAllMonths] = useState(false);
  const navigate = useNavigate();

  // Fonction pour récupérer les photos et les résultats par mois
  useEffect(() => {
    const fetchPhotosAndResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const photosData = await fetchPhotosByUser(userId);

        // Extraire les mois uniques triés (plus récents en premier)
        const uniqueMonths = Array.from(
          new Set(
            photosData
              .filter((photo) => photo.date_prise)
              .map((photo) =>
                new Date(photo.date_prise).toLocaleString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })
              )
          )
        ).sort((a, b) => new Date(`01 ${b}`) - new Date(`01 ${a}`)); // Tri par date décroissante

        // Charger les résultats pour chaque mois
        const results = {};
        for (const month of uniqueMonths) {
          const filtered = photosData.filter(
            (photo) =>
              new Date(photo.date_prise).toLocaleString("fr-FR", {
                month: "long",
                year: "numeric",
              }) === month
          );

          if (!filtered.length) {
            results[month] = "non validé";
            continue;
          }

          const formattedMonth = `${new Date(filtered[0]?.date_prise).getFullYear()}-${String(
            new Date(filtered[0]?.date_prise).getMonth() + 1
          ).padStart(2, "0")}`;

          try {
            const response = await axios.get(
              `http://localhost:8000/suivi_validations/?utilisateur_id=${userId}&mois=${formattedMonth}`
            );
            results[month] = response.data.historique_validations[0]?.resultat || "non validé";
          } catch {
            results[month] = "non validé";
          }
        }

        setPhotos(photosData);
        setMonths(uniqueMonths);
        setDisplayedMonths(uniqueMonths.slice(0, 3)); // Afficher uniquement les 3 derniers mois par défaut
        setResultsByMonth(results);
      } catch (error) {
        console.error("Erreur lors de la récupération des photos et des résultats:", error);
        setError("Erreur lors du chargement des données. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotosAndResults();
  }, [userId]);

  // Filtrer et obtenir les photos pour le mois sélectionné
  useEffect(() => {
    if (selectedMonth) {
      const filtered = photos.filter(
        (photo) =>
          new Date(photo.date_prise).toLocaleString("fr-FR", {
            month: "long",
            year: "numeric",
          }) === selectedMonth
      );

      if (!filtered.length) {
        setMonthlyResult({ mois_verification: selectedMonth, resultat: "non validé" });
        setFilteredPhotos([]);
        return;
      }

      const latestPhotos = Object.values(
        filtered.reduce((acc, photo) => {
          const existing = acc[photo.type_photo];
          if (
            !existing ||
            new Date(photo.date_prise) > new Date(existing.date_prise) ||
            photo.statut_validation === "validé"
          ) {
            acc[photo.type_photo] = photo;
          }
          return acc;
        }, {})
      );

      setFilteredPhotos(latestPhotos);
      setMonthlyResult({ mois_verification: selectedMonth, resultat: resultsByMonth[selectedMonth] });
    }
  }, [selectedMonth, photos, resultsByMonth]);

  // Gestion de l'affichage de tous les mois
  const handleShowAllMonths = () => {
    setShowAllMonths(true);
    setDisplayedMonths(months);
  };

  // Retour avec confirmation
  const handleBack = () => {
    if (window.confirm("Voulez-vous vraiment revenir ?")) {
      navigate("/take-photo");
    }
  };

  return (
    <div className="results-page">
      <h2>Historique des validations par mois</h2>

      {loading && <p>Chargement des données...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          <div className="months-list">
            {displayedMonths.map((month, index) => (
              <button
                key={index}
                onClick={() => setSelectedMonth(month)}
                className="month-button"
              >
                {month} - {resultsByMonth[month]}
              </button>
            ))}

            {!showAllMonths && months.length > 3 && (
              <button onClick={handleShowAllMonths} className="show-more-button">
                Afficher plus
              </button>
            )}
          </div>

          {selectedMonth && (
            <div className="month-details">
              <h3>Détails pour le mois de {selectedMonth}</h3>

              {monthlyResult && (
                <p className="monthly-result">
                  Résultat : {monthlyResult.resultat} ({monthlyResult.mois_verification})
                </p>
              )}

              {filteredPhotos.length > 0 ? (
                filteredPhotos.map((photo, index) => (
                  <div key={index} className="photo-detail">
                    <p>Type de photo : {photo.type_photo}</p>
                    <p>Date prise : {new Date(photo.date_prise).toLocaleDateString("fr-FR")}</p>
                    <p>Statut de validation : {photo.statut_validation}</p>
                  </div>
                ))
              ) : (
                <p>Aucune photo disponible pour ce mois.</p>
              )}
            </div>
          )}
        </>
      )}

      <button className="back-button" onClick={handleBack}>
        Retour à la prise de photos
      </button>
    </div>
  );
};

export default ResultsPage;