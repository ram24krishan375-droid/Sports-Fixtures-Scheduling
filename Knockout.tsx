import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import BracketSVG from "./BrackectSVG";
import Header from "./Header";
import "./Knockout.css";

export interface Fixture {
  id: string;
  round: string;
  team1: string;
  team2: string;
  winner?: string;
  order: number;
}

export interface MatchDetails {
  date: string;
  gameName: string;
  totalTeams: number;
  venue: string;
  startTime: string;
}

export default function KnockoutPage() {
  const { game, date } = useParams();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const fetchFixtures = async () => {
    if (!game || !date) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/fixtures/${game}/${date}`,
      );
      setFixtures(res.data);
    } catch (error) {
      console.error("Failed to fetch fixtures", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchDetails = async () => {
    if (!game || !date) return;
    setDetailsLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/gantt/details?date=${date}&gameName=${game}`,
      );
      setMatchDetails(res.data);
    } catch (error) {
      console.error("Failed to fetch match details", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures();
    fetchMatchDetails();
  }, [game, date]);

  const handleDownloadPDF = async () => {
    if (!matchDetails) {
      alert("Match details are not available. Cannot generate PDF.");
      return;
    }

    setPdfGenerating(true);

    // Loading message
    const loadingMsg = document.createElement("div");
    loadingMsg.textContent = "Generating PDF...";
    loadingMsg.style.position = "fixed";
    loadingMsg.style.top = "50%";
    loadingMsg.style.left = "50%";
    loadingMsg.style.transform = "translate(-50%, -50%)";
    loadingMsg.style.background = "white";
    loadingMsg.style.padding = "10px 20px";
    loadingMsg.style.borderRadius = "8px";
    loadingMsg.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    loadingMsg.style.zIndex = "9999";
    document.body.appendChild(loadingMsg);

    try {
      // 1. Capture match details card
      const detailsCard = document.querySelector(
        ".details-card",
      ) as HTMLElement;
      if (!detailsCard) {
        throw new Error("Details card not found");
      }

      const detailsCanvas = await html2canvas(detailsCard, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const detailsImgData = detailsCanvas.toDataURL("image/png");

      // 2. Capture bracket wrapper (not the SVG directly, due to foreignObject issues)
      const bracketWrapper = document.querySelector(
        ".bracket-wrapper",
      ) as HTMLElement;
      if (!bracketWrapper) {
        throw new Error("Bracket wrapper not found");
      }

      const bracketCanvas = await html2canvas(bracketWrapper, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: true, // helps debug if issues
      });
      const bracketImgData = bracketCanvas.toDataURL("image/png");

      // 3. Create PDF in A4 landscape
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 297 mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 210 mm

      // Add details image (scaled to fit width, 10mm margins)
      const detailsImgWidth = pageWidth - 20;
      const detailsImgHeight =
        (detailsCanvas.height * detailsImgWidth) / detailsCanvas.width;

      pdf.addImage(
        detailsImgData,
        "PNG",
        10,
        10,
        detailsImgWidth,
        detailsImgHeight,
      );

      // Add bracket image
      const bracketImgWidth = pageWidth - 20;
      const bracketImgHeight =
        (bracketCanvas.height * bracketImgWidth) / bracketCanvas.width;

      const remainingHeight = pageHeight - (detailsImgHeight + 20);
      if (bracketImgHeight <= remainingHeight) {
        pdf.addImage(
          bracketImgData,
          "PNG",
          10,
          detailsImgHeight + 20,
          bracketImgWidth,
          bracketImgHeight,
        );
      } else {
        pdf.addPage();
        pdf.addImage(
          bracketImgData,
          "PNG",
          10,
          10,
          bracketImgWidth,
          bracketImgHeight,
        );
      }

      pdf.save("tournament-bracket.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert(
        `Failed to generate PDF: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      document.body.removeChild(loadingMsg);
      setPdfGenerating(false);
    }
  };

  return (
    <>
      <Header />

      <div className="knockout-page">
        {/* Match Details Section */}
        {detailsLoading ? (
          <div className="details-wrapper">
            <div className="details-card">
              <div className="details-title" style={{ padding: "20px 24px" }}>
                Loading match details...
              </div>
            </div>
          </div>
        ) : matchDetails ? (
          <div className="details-wrapper">
            <div className="details-card">
              <h2 className="details-title">Summary:</h2>

              <div className="details-grid">
                <div className="detail-row">
                  <span className="detail-label">Game Name</span>
                  <span className="detail-separator">:</span>
                  <span className="detail-value">{matchDetails.gameName}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Date</span>
                  <span className="detail-separator">:</span>
                  <span className="detail-value">
                    {new Date(matchDetails.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Start Time</span>
                  <span className="detail-separator">:</span>
                  <span className="detail-value">{matchDetails.startTime}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Venue</span>
                  <span className="detail-separator">:</span>
                  <span className="detail-value">{matchDetails.venue}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Total Teams</span>
                  <span className="detail-separator">:</span>
                  <span className="detail-value">
                    {matchDetails.totalTeams}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="details-wrapper">
            <div className="details-card">
              <div
                className="details-title"
                style={{ padding: "20px 24px", color: "#64748b" }}
              >
                ℹ️ No match details available
              </div>
            </div>
          </div>
        )}

        {/* PDF Download Button */}
        <div className="bracket-actions">
          <button
            className="download-btn"
            onClick={handleDownloadPDF}
            disabled={pdfGenerating}
          >
            {pdfGenerating ? "Generating..." : "📄 Download PDF"}
          </button>
        </div>

        {/* Bracket Section */}
        <div className="bracket-container">
          {loading ? (
            <div className="status-text">Loading fixtures...</div>
          ) : fixtures.length > 0 ? (
            <BracketSVG fixtures={fixtures} fetchFixtures={fetchFixtures} />
          ) : (
            <div className="status-text">No fixtures available</div>
          )}
        </div>
      </div>
    </>
  );
}
