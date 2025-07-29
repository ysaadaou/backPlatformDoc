//import express from "express";
//import Student from "../models/Student.js";
//import { verifyToken } from "../middleware/auth.js";
//
//const router = express.Router();
//
//// Convert Google Drive view link to direct download link
//const convertGoogleDriveLink = (viewLink) => {
//  if (!viewLink || !viewLink.includes("drive.google.com")) {
//    return viewLink;
//  }
//
//  // Extract file ID from Google Drive link
//  const fileIdMatch = viewLink.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
//  if (fileIdMatch) {
//    const fileId = fileIdMatch[1];
//    return `https://drive.google.com/uc?export=download&id=${fileId}`;
//  }
//
//  return viewLink;
//};
//
//// Download certificate route
//router.post("/download", verifyToken, async (req, res) => {
//  try {
//    const student = await Student.findById(req.studentId);
//
//    if (!student) {
//      return res.status(404).json({
//        success: false,
//        message: "Étudiant non trouvé",
//      });
//    }
//
//    // Check eligibility conditions
//    const sessionsAttended = [
//      student.sessions.s1,
//      student.sessions.s2,
//      student.sessions.s3,
//    ].filter((session) => session === "P").length;
//
//    const hasMinimumGrade = student.note >= 10;
//    const hasAttendedAllSessions = sessionsAttended === 3;
//    const isEligible =
//      student.eligible && hasMinimumGrade && hasAttendedAllSessions;
//
//    if (!isEligible) {
//      return res.status(403).json({
//        success: false,
//        message: "Non éligible au téléchargement du certificat",
//        details: {
//          eligible: student.eligible,
//          hasMinimumGrade,
//          hasAttendedAllSessions,
//          sessionsAttended,
//          currentGrade: student.note,
//        },
//      });
//    }
//
//    // Mark certificate as downloaded
//    await Student.findByIdAndUpdate(req.studentId, {
//      certificatTelecharge: true,
//    });
//
//    // Return Google Drive download link
//    const downloadLink = convertGoogleDriveLink(student.lienCertificat);
//
//    res.json({
//      success: true,
//      message: "Lien de téléchargement généré",
//      downloadUrl: downloadLink,
//      fileName: `attestation_formation_IA_${student.cin}.pdf`,
//      qrCode: student.qrCodeLink,
//    });
//  } catch (error) {
//    console.error("Certificate download error:", error);
//    res.status(500).json({
//      success: false,
//      message: "Erreur lors de la génération du lien de téléchargement",
//    });
//  }
//});
//
//// Get certificate status
//router.get("/status", verifyToken, async (req, res) => {
//  try {
//    const student = await Student.findById(req.studentId);
//
//    if (!student) {
//      return res.status(404).json({
//        success: false,
//        message: "Étudiant non trouvé",
//      });
//    }
//
//    const sessionsAttended = [
//      student.sessions.s1,
//      student.sessions.s2,
//      student.sessions.s3,
//    ].filter((session) => session === "P").length;
//
//    const hasMinimumGrade = student.note >= 10;
//    const hasAttendedAllSessions = sessionsAttended === 3;
//    const isEligible =
//      student.eligible && hasMinimumGrade && hasAttendedAllSessions;
//
//    res.json({
//      success: true,
//      certificateStatus: {
//        eligible: isEligible,
//        downloaded: student.certificatTelecharge,
//        conditions: {
//          administrativeApproval: student.eligible,
//          minimumGrade: hasMinimumGrade,
//          allSessionsAttended: hasAttendedAllSessions,
//        },
//        details: {
//          currentGrade: student.note,
//          sessionsAttended,
//          totalSessions: 3,
//          qrCode: student.qrCodeLink,
//        },
//      },
//    });
//  } catch (error) {
//    console.error("Certificate status error:", error);
//    res.status(500).json({
//      success: false,
//      message: "Erreur lors de la vérification du statut",
//    });
//  }
//});
//
//export default router;
//
//
//

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

    // Check if student has a certificate link
    if (!student.googleDriveLink && !student.lienCertificat) {
      return res.status(404).json({
        success: false,
        message: "Aucun lien de certificat disponible",
      });
    }

    // Use googleDriveLink if available, otherwise use lienCertificat
    const certificateLink = student.googleDriveLink || student.lienCertificat;

    // Mark certificate as downloaded
    await Student.findByIdAndUpdate(req.studentId, {
      certificatTelecharge: true,
    });

    // Return Google Drive download link
    const downloadLink = convertGoogleDriveLink(certificateLink);

    console.log(`Certificate link provided to student: ${student.cin}`);

    res.json({
      success: true,
      message: "Lien de téléchargement généré",
      downloadUrl: downloadLink,
      viewUrl: certificateLink, // Original view link
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

// Mark certificate as downloaded/accessed (NEW ENDPOINT)
router.post("/mark-downloaded", verifyToken, async (req, res) => {
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
        message: "Non éligible à l'accès au certificat",
      });
    }

    // Mark certificate as downloaded/accessed
    await Student.findByIdAndUpdate(req.studentId, {
      certificatTelecharge: true,
    });

    console.log(`Certificate marked as accessed by student: ${student.cin}`);

    res.json({
      success: true,
      message: "Accès au certificat enregistré avec succès",
    });
  } catch (error) {
    console.error("Mark downloaded error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'enregistrement de l'accès",
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

    // Check if certificate link exists
    const hasCertificateLink = !!(
      student.googleDriveLink || student.lienCertificat
    );

    res.json({
      success: true,
      certificateStatus: {
        eligible: isEligible,
        downloaded: student.certificatTelecharge,
        hasCertificateLink: hasCertificateLink,
        certificateLink: hasCertificateLink
          ? student.googleDriveLink || student.lienCertificat
          : null,
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

// Check certificate availability (alternative endpoint)
router.get("/check", verifyToken, async (req, res) => {
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
    const hasCertificateLink = !!(
      student.googleDriveLink || student.lienCertificat
    );

    res.json({
      success: true,
      data: {
        eligible: isEligible,
        hasGoogleDriveLink: hasCertificateLink,
        downloaded: student.certificatTelecharge,
        googleDriveLink: hasCertificateLink
          ? student.googleDriveLink || student.lienCertificat
          : null,
        qrCodeLink: student.qrCodeLink,
      },
    });
  } catch (error) {
    console.error("Certificate check error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification du certificat",
    });
  }
});

export default router;
