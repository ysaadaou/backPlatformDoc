import express from "express";
import Student from "../models/Student.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Login route with improved input handling
router.post("/login", async (req, res) => {
  try {
    const { nom, prenom, cin, motDePasse } = req.body;

    // Validate input
    if (!nom || !prenom || !cin || !motDePasse) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont obligatoires",
      });
    }

    // Find student with case-insensitive search for nom, prenom, and CIN
    // Only password remains case-sensitive
    const student = await Student.findOne({
      nom: { $regex: new RegExp(`^${nom.trim()}$`, "i") }, // Case insensitive
      prenom: { $regex: new RegExp(`^${prenom.trim()}$`, "i") }, // Case insensitive
      cin: { $regex: new RegExp(`^${cin.trim()}$`, "i") }, // Case insensitive
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides. Vérifiez votre nom, prénom et CIN.",
      });
    }

    // Check password - exact match (case sensitive)
    if (motDePasse !== student.motDePasse) {
      return res.status(401).json({
        success: false,
        message: "Code d'accès incorrect.",
      });
    }

    // Generate JWT token (10 minutes expiry)
    const token = jwt.sign(
      {
        studentId: student._id,
        cin: student.cin,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "10m" },
    );

    // Return user data (including password for plain text storage)
    const userData = {
      _id: student._id,
      nom: student.nom,
      prenom: student.prenom,
      email: student.email,
      cin: student.cin,
      telephone: student.telephone,
      faculte: student.faculte,
      sessions: student.sessions,
      note: student.note,
      eligible: student.eligible,
      certificatTelecharge: student.certificatTelecharge,
      lienCertificat: student.lienCertificat,
      qrCodeLink: student.qrCodeLink,
      genre: student.genre,
    };

    res.json({
      success: true,
      message: "Connexion réussie",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    });
  }
});

// Verify token route
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token manquant",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );
    const student = await Student.findById(decoded.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Étudiant non trouvé",
      });
    }

    res.json({
      success: true,
      user: student,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token invalide",
    });
  }
});

export default router;
