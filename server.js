import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import authRoutes from "./routes/auth.js";
import certificateRoutes from "./routes/certificate.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // Cannot use credentials with '*'
  }),
);
//app.use(cors({
//  origin: "*", // Allow all origins
//  credentials: false // Cannot use credentials with '*'
//}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/certificate", certificateRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Serveur backend opérationnel",
    timestamp: new Date().toISOString(),
  });
});

// MongoDB Connection with Memory Server fallback
const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // If no MongoDB URI provided, use memory server
    if (!mongoUri || mongoUri.includes("your-username")) {
      console.log("Démarrage du serveur MongoDB en mémoire...");
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log("Serveur MongoDB en mémoire démarré");
    }

    await mongoose.connect(mongoUri);
    console.log("Connecté à MongoDB");
  } catch (error) {
    console.error("Erreur de connexion MongoDB:", error.message);
    process.exit(1);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err.stack);
  res.status(500).json({
    success: false,
    message: "Erreur interne du serveur",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée`,
  });
});

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log("Serveur backend démarré!");
    console.log(`Port: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log("Pour tester l'API, exécutez: npm run seed");
  });
};

startServer();
