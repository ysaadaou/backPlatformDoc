import mongoose from "mongoose";
import Student from "../models/Student.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const generateQrCode = () => {
  return `qr_${uuidv4().replace(/-/g, "")}_${Date.now()}`;
};

const seedData = async () => {
  try {
    console.log("Connexion à MongoDB...");
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/student-certificates",
    );
    console.log("Connecté à MongoDB");

    console.log("Suppression des données existantes...");
    await Student.deleteMany({});
    console.log("Données existantes supprimées");

    console.log("Création des données d'exemple...");

    // Sample students data with plain text passwords and gender
    const studentsData = [
      {
        nom: "Saadaoui",
        prenom: "Yahya",
        email: "yahya.saadaoui@university.ma",
        cin: "WA276900",
        telephone: "0624164940",
        motDePasse: "3620", // Plain text password
        faculte: "FSJ",
        genre: "M",
        sessions: {
          s1: "P",
          s2: "P",
          s3: "P",
        },
        note: 18,
        eligible: true,
        lienCertificat:
          "https://drive.google.com/file/d/1E19LrmsLlMvYoQV2R4XMTHp8q4XBmSZg/view?usp=drive_link",
        qrCodeLink: generateQrCode(),
      },
      {
        nom: "Alami",
        prenom: "Ahmed",
        email: "ahmed.alami@university.ma",
        cin: "AB123456",
        telephone: "0612345678",
        motDePasse: "secret123",
        faculte: "Faculté des Sciences",
        genre: "M",
        sessions: {
          s1: "P",
          s2: "P",
          s3: "P",
        },
        note: 16,
        eligible: true,
        lienCertificat:
          "https://drive.google.com/file/d/1DEF456_AB123456/view?usp=sharing",
        qrCodeLink: generateQrCode(),
      },
      {
        nom: "Benali",
        prenom: "Fatima",
        email: "fatima.benali@university.ma",
        cin: "CD789012",
        telephone: "0623456789",
        motDePasse: "password456",
        faculte: "Faculté des Sciences Économiques",
        genre: "F", // Female
        sessions: {
          s1: "P",
          s2: "absent",
          s3: "P",
        },
        note: 8,
        eligible: false,
        lienCertificat:
          "https://drive.google.com/file/d/1GHI789_CD789012/view?usp=sharing",
        qrCodeLink: generateQrCode(),
      },
      {
        nom: "Chakir",
        prenom: "Omar",
        email: "omar.chakir@university.ma",
        cin: "EF345678",
        telephone: "0634567890",
        motDePasse: "mypass789",
        faculte: "Faculté de Médecine",
        genre: "M",
        sessions: {
          s1: "P",
          s2: "P",
          s3: "P",
        },
        note: 14,
        eligible: true,
        lienCertificat:
          "https://drive.google.com/file/d/1JKL012_EF345678/view?usp=sharing",
        qrCodeLink: generateQrCode(),
      },
      {
        nom: "Idrissi",
        prenom: "Aicha",
        email: "aicha.idrissi@university.ma",
        cin: "GH901234",
        telephone: "0645678901",
        motDePasse: "secure321",
        faculte: "Faculté des Lettres",
        genre: "F", // Female
        sessions: {
          s1: "absent",
          s2: "P",
          s3: "absent",
        },
        note: 12,
        eligible: false,
        lienCertificat:
          "https://drive.google.com/file/d/1MNO345_GH901234/view?usp=sharing",
        qrCodeLink: generateQrCode(),
      },
      {
        nom: "Tazi",
        prenom: "Youssef",
        email: "youssef.tazi@university.ma",
        cin: "IJ567890",
        telephone: "0656789012",
        motDePasse: "pass2024",
        faculte: "École Nationale Supérieure d'Informatique",
        genre: "M",
        sessions: {
          s1: "P",
          s2: "P",
          s3: "P",
        },
        note: 18,
        eligible: true,
        lienCertificat:
          "https://drive.google.com/file/d/1PQR678_IJ567890/view?usp=sharing",
        qrCodeLink: generateQrCode(),
      },
      {
        nom: "Mansouri",
        prenom: "Khadija",
        email: "khadija.mansouri@university.ma",
        cin: "KL234567",
        telephone: "0667890123",
        motDePasse: "test123",
        faculte: "Faculté de Droit",
        genre: "F", // Female
        sessions: {
          s1: "P",
          s2: "P",
          s3: "absent",
        },
        note: 15,
        eligible: false,
        lienCertificat:
          "https://drive.google.com/file/d/1STU901_KL234567/view?usp=sharing",
        qrCodeLink: generateQrCode(),
      },
    ];

    console.log("Insertion des données d'exemple...");
    await Student.insertMany(studentsData);
    console.log("Données d'exemple créées avec succès");

    // Display login credentials
    console.log("\n" + "=".repeat(60));
    console.log("IDENTIFIANTS DE CONNEXION POUR LES TESTS");
    console.log("=".repeat(60));

    const passwords = [
      "3620",
      "secret123",
      "password456",
      "mypass789",
      "secure321",
      "pass2024",
      "test123",
    ];

    studentsData.forEach((student, index) => {
      const sessionsCount = [
        student.sessions.s1,
        student.sessions.s2,
        student.sessions.s3,
      ].filter((s) => s === "P").length;

      console.log(`\nÉtudiant ${index + 1}:`);
      console.log(`   Nom: ${student.nom}`);
      console.log(`   Prénom: ${student.prenom}`);
      console.log(`   CIN: ${student.cin}`);
      console.log(`   Mot de passe: ${passwords[index]}`);
      console.log(`   Genre: ${student.genre}`);
      console.log(`   Note: ${student.note}/20`);
      console.log(`   Sessions: ${sessionsCount}/3`);
      console.log(`   Éligible: ${student.eligible ? "Oui" : "Non"}`);
      console.log(`   QR Code: ${student.qrCodeLink}`);
      console.log(`   Faculté: ${student.faculte}`);
    });

    console.log("\n" + "=".repeat(60));
    console.log("RÉSUMÉ DES DONNÉES");
    console.log("=".repeat(60));
    console.log(`Total étudiants: ${studentsData.length}`);
    console.log(
      `Étudiants éligibles: ${studentsData.filter((s) => s.eligible).length}`,
    );
    console.log(
      `Étudiants avec note ≥ 10: ${studentsData.filter((s) => s.note >= 10).length}`,
    );

    console.log("\nBASE DE DONNÉES INITIALISÉE AVEC SUCCÈS!");
    console.log("Vous pouvez maintenant démarrer le serveur avec: npm run dev");
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la base de données:",
      error,
    );
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Déconnecté de MongoDB");
    process.exit(0);
  }
};

seedData();
