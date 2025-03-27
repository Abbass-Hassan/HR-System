// CertificationsView.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CertificationsView.css";
import PageHeader from "../../../common/PageHeader/PageHeader";

const API_BASE_URL = "http://localhost:8000";

const CertificationsView = () => {
  const navigate = useNavigate();
  const [myCertifications, setMyCertifications] = useState([]);
  const [availableCertifications, setAvailableCertifications] = useState([]);
  const [popularCertifications, setPopularCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificationsData();
  }, []);

  const fetchCertificationsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch user's certifications
      const myCertificationsResponse = await axios.get(
        `${API_BASE_URL}/api/v0.1/training/certifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch available certifications
      const availableCertificationsResponse = await axios.get(
        `${API_BASE_URL}/api/v0.1/training/certifications/available`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch popular certifications
      const popularCertificationsResponse = await axios.get(
        `${API_BASE_URL}/api/v0.1/training/certifications/popular`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (myCertificationsResponse.data.success) {
        setMyCertifications(myCertificationsResponse.data.certifications);
      }

      if (availableCertificationsResponse.data.success) {
        setAvailableCertifications(
          availableCertificationsResponse.data.certifications
        );
      }

      if (popularCertificationsResponse.data.success) {
        setPopularCertifications(
          popularCertificationsResponse.data.certifications
        );
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching certifications:", err);
      setError("Failed to load certifications. Please try again.");
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calculate days until expiration
  const getDaysUntilExpiration = (expiryDate) => {
    if (!expiryDate) return null;

    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  const getStatusClass = (daysRemaining) => {
    if (daysRemaining === null) return "no-expiry";
    if (daysRemaining <= 0) return "expired";
    if (daysRemaining <= 30) return "expiring-soon";
    return "valid";
  };

  if (loading) {
    return <div className="loading-indicator">Loading certifications...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="certifications-view">
      <PageHeader
        title="Certifications"
        subTitle="Training"
        subSubTitle="Certifications"
      />

      <div className="certifications-content">
        <div className="my-certifications-section">
          <h2 className="section-title">My Certifications</h2>
          {myCertifications.length > 0 ? (
            <div className="certification-cards">
              {myCertifications.map((cert) => {
                const daysRemaining = getDaysUntilExpiration(cert.expiry_date);
                const statusClass = getStatusClass(daysRemaining);

                return (
                  <div className="certification-card" key={cert.id}>
                    <div className="certification-header">
                      <div className="certification-logo">
                        {cert.certification.issuing_organization.charAt(0)}
                      </div>
                      <div className={`certification-status ${statusClass}`}>
                        {statusClass === "no-expiry" && "Never Expires"}
                        {statusClass === "expired" && "Expired"}
                        {statusClass === "expiring-soon" &&
                          `Expires in ${daysRemaining} days`}
                        {statusClass === "valid" &&
                          `Valid for ${daysRemaining} days`}
                      </div>
                    </div>

                    <h3 className="certification-name">
                      {cert.certification.certification_name}
                    </h3>
                    <div className="certification-details">
                      <div className="cert-detail">
                        <span className="detail-label">
                          Issuing Organization:
                        </span>
                        <span className="detail-value">
                          {cert.certification.issuing_organization}
                        </span>
                      </div>
                      <div className="cert-detail">
                        <span className="detail-label">Issue Date:</span>
                        <span className="detail-value">
                          {formatDate(cert.issue_date)}
                        </span>
                      </div>
                      {cert.expiry_date && (
                        <div className="cert-detail">
                          <span className="detail-label">Expiry Date:</span>
                          <span className="detail-value">
                            {formatDate(cert.expiry_date)}
                          </span>
                        </div>
                      )}
                      {cert.certificate_number && (
                        <div className="cert-detail">
                          <span className="detail-label">
                            Certificate Number:
                          </span>
                          <span className="detail-value">
                            {cert.certificate_number}
                          </span>
                        </div>
                      )}
                    </div>

                    {cert.document_id && (
                      <button className="view-certificate-button">
                        View Certificate
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>
                You don't have any certifications yet. Complete courses to earn
                certifications.
              </p>
            </div>
          )}
        </div>

        <div className="popular-certifications-section">
          <h2 className="section-title">Popular Certifications</h2>
          {popularCertifications.length > 0 ? (
            <div className="popular-certification-cards">
              {popularCertifications.map((cert) => (
                <div className="popular-certification-card" key={cert.id}>
                  <div className="popular-certification-logo">
                    {cert.issuing_organization.charAt(0)}
                  </div>
                  <h3 className="popular-certification-name">
                    {cert.certification_name}
                  </h3>
                  <div className="popular-certification-details">
                    <div className="cert-detail">
                      <span className="detail-label">
                        Issuing Organization:
                      </span>
                      <span className="detail-value">
                        {cert.issuing_organization}
                      </span>
                    </div>
                    <div className="cert-detail">
                      <span className="detail-label">Validity Period:</span>
                      <span className="detail-value">
                        {cert.validity_period || "Not specified"}
                      </span>
                    </div>
                    <div className="cert-detail">
                      <span className="detail-label">Popularity:</span>
                      <span className="detail-value">
                        {cert.user_certification_count || 0} holders
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No popular certifications available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificationsView;
