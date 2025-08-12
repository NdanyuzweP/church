import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  author: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  isPublished: boolean;
  publishDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  imageUrl: {
    type: String,
    trim: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date
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
articleSchema.pre<IArticle>('save', function(next) {
  this.updatedAt = new Date();
  if (this.isPublished && !this.publishDate) {
    this.publishDate = new Date();
  }
  next();
});

// Indexes
articleSchema.index({ isPublished: 1 });
articleSchema.index({ publishDate: -1 });
articleSchema.index({ category: 1 });
articleSchema.index({ tags: 1 });

export default mongoose.model<IArticle>('Article', articleSchema);