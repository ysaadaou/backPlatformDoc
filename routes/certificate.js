import express from "express";
import Student from "../models/Student.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Convert Google Drive view link to direct download link
const convertGoogleDriveLink = (viewLink) => {
  if (!viewLink || !viewLink.includes("drive.google.com")) {
    return viewLink;
  }

  // Extract file ID from Google Drive link
  const fileIdMatch = viewLink.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  return viewLink;
};

// Download certificate route
router.post("/download", verifyToken, async (req, res) => {
  try {
    const student = await Student.findById(req.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Étudiant non trouvé",
      });
    }

    // Check eligibility conditions
    const sessionsAttended = [
      student.sessions.s1,
      student.sessions.s2,
      student.sessions.s3,
    ].filter((session) => session === "P").length;

    const hasMinimumGrade = student.note >= 10;
    const hasAttendedAllSessions = sessionsAttended === 3;
    const isEligible =
      student.eligible && hasMinimumGrade && hasAttendedAllSessions;

    if (!isEligible) {
      return res.status(403).json({
        success: false,
        message: "Non éligible au téléchargement du certificat",
        details: {
          eligible: student.eligible,
          hasMinimumGrade,
          hasAttendedAllSessions,
          sessionsAttended,
          currentGrade: student.note,
        },
      });
    }

    // Mark certificate as downloaded
    await Student.findByIdAndUpdate(req.studentId, {
      certificatTelecharge: true,
    });

    // Return Google Drive download link
    const downloadLink = convertGoogleDriveLink(student.lienCertificat);

    res.json({
      success: true,
      message: "Lien de téléchargement généré",
      downloadUrl: downloadLink,
      fileName: `attestation_formation_IA_${student.cin}.pdf`,
      qrCode: student.qrCodeLink,
    });
  } catch (error) {
    console.error("Certificate download error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la génération du lien de téléchargement",
    });
  }
});

// Get certificate status
router.get("/status", verifyToken, async (req, res) => {
  try {
    const student = await Student.findById(req.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Étudiant non trouvé",
      });
    }

    const sessionsAttended = [
      student.sessions.s1,
      student.sessions.s2,
      student.sessions.s3,
    ].filter((session) => session === "P").length;

    const hasMinimumGrade = student.note >= 10;
    const hasAttendedAllSessions = sessionsAttended === 3;
    const isEligible =
      student.eligible && hasMinimumGrade && hasAttendedAllSessions;

    res.json({
      success: true,
      certificateStatus: {
        eligible: isEligible,
        downloaded: student.certificatTelecharge,
        conditions: {
          administrativeApproval: student.eligible,
          minimumGrade: hasMinimumGrade,
          allSessionsAttended: hasAttendedAllSessions,
        },
        details: {
          currentGrade: student.note,
          sessionsAttended,
          totalSessions: 3,
          qrCode: student.qrCodeLink,
        },
      },
    });
  } catch (error) {
    console.error("Certificate status error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification du statut",
    });
  }
});

export default router;
