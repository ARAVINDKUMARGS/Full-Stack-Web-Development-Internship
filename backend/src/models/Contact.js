import mongoose from 'mongoose';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s-]{7,20}$/;

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name must be 80 characters or fewer'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [EMAIL_RE, 'Enter a valid email address'],
      maxlength: [120, 'Email must be 120 characters or fewer'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: (v) => !v || PHONE_RE.test(v),
        message: 'Enter a valid phone number (7-20 digits; + ( ) - allowed)',
      },
    },
    company: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Company must be 100 characters or fewer'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Notes must be 500 characters or fewer'],
    },
  },
  { timestamps: true }
);

contactSchema.index({ createdAt: -1 });

export const Contact = mongoose.model('Contact', contactSchema);
