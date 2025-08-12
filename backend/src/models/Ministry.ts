import mongoose, { Document, Schema } from 'mongoose';

export interface IMinistry extends Document {
  name: string;
  description: string;
  purpose: string;
  meetingTime: string;
  meetingLocation: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  imageUrl?: string;
  images: string[];
  activities: string[];
  ageGroup?: string;
  capacity?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ministrySchema = new Schema<IMinistry>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  purpose: {
    type: String,
    required: true,
    maxlength: 500
  },
  meetingTime: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  meetingLocation: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  contactPhone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  imageUrl: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  activities: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  ageGroup: {
    type: String,
    trim: true,
    maxlength: 50
  },
  capacity: {
    type: Number,
    min: 1,
    max: 1000
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
ministrySchema.pre<IMinistry>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes
ministrySchema.index({ isActive: 1 });
ministrySchema.index({ name: 1 });

export default mongoose.model<IMinistry>('Ministry', ministrySchema);