import mongoose, { Document, Schema } from 'mongoose';

export interface ISermon extends Document {
  title: string;
  speaker: string;
  date: Date;
  category: 'Expository' | 'Book Study' | 'Confession Study' | 'Topical';
  description: string;
  imageUrl?: string; // Custom sermon image (optional)
  audioUrl?: string;
  videoUrl?: string;
  duration?: number; // in minutes
  scriptures: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const sermonSchema = new Schema<ISermon>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  speaker: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['Expository', 'Book Study', 'Confession Study', 'Topical'],
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  imageUrl: {
    type: String,
    trim: true
  },
  audioUrl: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    min: 1,
    max: 180 // 3 hours max
  },
  scriptures: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
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
sermonSchema.pre<ISermon>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for better query performance
sermonSchema.index({ date: -1 });
sermonSchema.index({ category: 1 });
sermonSchema.index({ speaker: 1 });
sermonSchema.index({ tags: 1 });

export default mongoose.model<ISermon>('Sermon', sermonSchema);