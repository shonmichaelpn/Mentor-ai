import mongoose, { Model, Schema } from "mongoose";

export interface IEmailVerification {
  name: string;
  email: string;
  password: string;
  codeHash: string;
  expiresAt: Date;
}

const EmailVerificationSchema = new Schema<IEmailVerification>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

const EmailVerification: Model<IEmailVerification> =
  mongoose.models.EmailVerification ||
  mongoose.model<IEmailVerification>(
    "EmailVerification",
    EmailVerificationSchema
  );

export default EmailVerification;
