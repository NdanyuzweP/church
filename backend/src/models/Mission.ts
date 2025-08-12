import mongoose, { Document, Schema } from 'mongoose';

export interface IMissionUpdate {
  title: string;
  content: string;
  date: Date;
  photos: string[];
}

export interface IMissionLocation {
  name: string;
  address: string;
  description: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IMission extends Document {
  name: string;
  description: string;
  purpose: string;
  startDate: Date;
  endDate?: Date;
  status: 'Active' | 'Completed' | 'On Hold';
  imageUrl?: string;
  locations: IMissionLocation[];
  updates: IMissionUpdate[];
  budget?: number;
  teamMembers?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const missionLocationSchema = new Schema<IMissionLocation>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  coordinates: {
    lat: Number,
    lng: Number
  }
});

const missionUpdateSchema = new Schema<IMissionUpdate>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  photos: [{
    type: String,
    trim: true
  }]
});

const missionSchema = new Schema<IMission>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
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
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'On Hold'],
    required: true,
    default: 'Active'
  },
  imageUrl: {
    type: String,
    trim: true
  },
  locations: [missionLocationSchema],
  updates: [missionUpdateSchema],
  budget: {
    type: Number,
    min: 0
  },
  teamMembers: [{
    type: String,
    trim: true,
    maxlength: 100
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
missionSchema.pre<IMission>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes
missionSchema.index({ status: 1 });
missionSchema.index({ startDate: -1 });
missionSchema.index({ 'locations.name': 1 });

export default mongoose.model<IMission>('Mission', missionSchema);