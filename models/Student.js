import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const studentSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    prenom: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    cin: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    telephone: {
      type: String,
      required: true,
      trim: true,
    },
    motDePasse: {
      type: String,
      required: true,
      // No hashing - plain text storage
    },
    faculte: {
      type: String,
      required: true,
      trim: true,
    },
    sessions: {
      s1: {
        type: String,
        enum: ["P", "absent"],
        default: "absent",
      },
      s2: {
        type: String,
        enum: ["P", "absent"],
        default: "absent",
      },
      s3: {
        type: String,
        enum: ["P", "absent"],
        default: "absent",
      },
    },
    note: {
      type: Number,
      min: 0,
      max: 20,
      default: 0,
    },
    eligible: {
      type: Boolean,
      default: false,
    },
    certificatTelecharge: {
      type: Boolean,
      default: false,
    },
    lienCertificat: {
      type: String,
      trim: true,
    },
    qrCodeLink: {
      type: String,
      unique: true,
      default: () => `qr_${uuidv4().replace(/-/g, "")}_${Date.now()}`,
    },
    // Add gender field for proper French grammar
    genre: {
      type: String,
      enum: ["M", "F"],
      default: "M",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Student", studentSchema);
