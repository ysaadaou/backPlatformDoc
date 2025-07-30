import mongoose from "mongoose";
import student from "../models/student.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const generateqrcode = () => {
  return `qr_${uuidv4().replace(/-/g, "")}_${date.now()}`;
};

const seeddata = async () => {
  try {
    console.log("connexion à mongodb...");
    await mongoose.connect(
      process.env.mongodb_uri ||
        "mongodb://localhost:27017/student-certificates",
    );
    console.log("connecté à mongodb");

    console.log("suppression des données existantes...");
    await student.deletemany({});
    console.log("données existantes supprimées");

    console.log("création des données d'exemple...");

    // sample students data with plain text passwords and gender
    const studentsdata = [
      {
        nom: "saadaoui",
        prenom: "yahya",
        email: "yahya.saadaoui@university.ma",
        cin: "wa276900",
        telephone: "0624164940",
        motdepasse: "3620", // plain text password
        faculte: "fsj",
        genre: "m",
        sessions: {
          s1: "p",
          s2: "p",
          s3: "p",
        },
        note: 18,
        eligible: true,
        liencertificat:
          "https://drive.google.com/file/d/1e19lrmsllmvyoqv2r4xmthp8q4xbmszg/view?usp=drive_link",
        qrcodelink: generateqrcode(),
      },
      {
        nom: "alami",
        prenom: "ahmed",
        email: "ahmed.alami@university.ma",
        cin: "ab123456",
        telephone: "0612345678",
        motdepasse: "secret123",
        faculte: "faculté des sciences",
        genre: "m",
        sessions: {
          s1: "p",
          s2: "p",
          s3: "p",
        },
        note: 16,
        eligible: true,
        liencertificat:
          "https://drive.google.com/file/d/1def456_ab123456/view?usp=sharing",
        qrcodelink: generateqrcode(),
      },
      {
        nom: "benali",
        prenom: "fatima",
        email: "fatima.benali@university.ma",
        cin: "cd789012",
        telephone: "0623456789",
        motdepasse: "password456",
        faculte: "faculté des sciences économiques",
        genre: "f", // female
        sessions: {
          s1: "p",
          s2: "absent",
          s3: "p",
        },
        note: 8,
        eligible: false,
        liencertificat:
          "https://drive.google.com/file/d/1ghi789_cd789012/view?usp=sharing",
        qrcodelink: generateqrcode(),
      },
      {
        nom: "chakir",
        prenom: "omar",
        email: "omar.chakir@university.ma",
        cin: "ef345678",
        telephone: "0634567890",
        motdepasse: "mypass789",
        faculte: "faculté de médecine",
        genre: "m",
        sessions: {
          s1: "p",
          s2: "p",
          s3: "p",
        },
        note: 14,
        eligible: true,
        liencertificat:
          "https://drive.google.com/file/d/1jkl012_ef345678/view?usp=sharing",
        qrcodelink: generateqrcode(),
      },
      {
        nom: "idrissi",
        prenom: "aicha",
        email: "aicha.idrissi@university.ma",
        cin: "gh901234",
        telephone: "0645678901",
        motdepasse: "secure321",
        faculte: "faculté des lettres",
        genre: "f", // female
        sessions: {
          s1: "absent",
          s2: "p",
          s3: "absent",
        },
        note: 12,
        eligible: false,
        liencertificat:
          "https://drive.google.com/file/d/1mno345_gh901234/view?usp=sharing",
        qrcodelink: generateqrcode(),
      },
      {
        nom: "tazi",
        prenom: "youssef",
        email: "youssef.tazi@university.ma",
        cin: "ij567890",
        telephone: "0656789012",
        motdepasse: "pass2024",
        faculte: "école nationale supérieure d'informatique",
        genre: "m",
        sessions: {
          s1: "p",
          s2: "p",
          s3: "p",
        },
        note: 18,
        eligible: true,
        liencertificat:
          "https://drive.google.com/file/d/1pqr678_ij567890/view?usp=sharing",
        qrcodelink: generateqrcode(),
      },
      {
        nom: "mansouri",
        prenom: "khadija",
        email: "khadija.mansouri@university.ma",
        cin: "kl234567",
        telephone: "0667890123",
        motdepasse: "test123",
        faculte: "faculté de droit",
        genre: "f", // female
        sessions: {
          s1: "p",
          s2: "p",
          s3: "absent",
        },
        note: 15,
        eligible: false,
        liencertificat:
          "https://drive.google.com/file/d/1stu901_kl234567/view?usp=sharing",
        qrcodelink: generateqrcode(),
      },
    ];

    console.log("insertion des données d'exemple...");
    await student.insertmany(studentsdata);
    console.log("données d'exemple créées avec succès");

    // display login credentials
    console.log("\n" + "=".repeat(60));
    console.log("identifiants de connexion pour les tests");
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

    studentsdata.foreach((student, index) => {
      const sessionscount = [
        student.sessions.s1,
        student.sessions.s2,
        student.sessions.s3,
      ].filter((s) => s === "p").length;

      console.log(`\nétudiant ${index + 1}:`);
      console.log(`   nom: ${student.nom}`);
      console.log(`   prénom: ${student.prenom}`);
      console.log(`   cin: ${student.cin}`);
      console.log(`   mot de passe: ${passwords[index]}`);
      console.log(`   genre: ${student.genre}`);
      console.log(`   note: ${student.note}/20`);
      console.log(`   sessions: ${sessionscount}/3`);
      console.log(`   éligible: ${student.eligible ? "oui" : "non"}`);
      console.log(`   qr code: ${student.qrcodelink}`);
      console.log(`   faculté: ${student.faculte}`);
    });

    console.log("\n" + "=".repeat(60));
    console.log("résumé des données");
    console.log("=".repeat(60));
    console.log(`total étudiants: ${studentsdata.length}`);
    console.log(
      `étudiants éligibles: ${studentsdata.filter((s) => s.eligible).length}`,
    );
    console.log(
      `étudiants avec note ≥ 10: ${studentsdata.filter((s) => s.note >= 10).length}`,
    );

    console.log("\nbase de données initialisée avec succès!");
    console.log("vous pouvez maintenant démarrer le serveur avec: npm run dev");
  } catch (error) {
    console.error(
      "erreur lors de l'initialisation de la base de données:",
      error,
    );
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("déconnecté de mongodb");
    process.exit(0);
  }
};

seeddata();
