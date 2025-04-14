import mongoose from 'mongoose';

const HealthMetricSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  height: {
    type: Number
  },
  weight: {
    type: Number
  },
  bloodPressure: {
    type: String
  },
  heartRate: {
    type: Number
  },
  glucoseLevel: {
    type: Number
  },
  bmi: {
    type: Number
  },
  bmiStatus: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for userId and timestamp for efficient querying
HealthMetricSchema.index({ userId: 1, timestamp: -1 });

const HealthMetric = mongoose.models.HealthMetric || mongoose.model('HealthMetric', HealthMetricSchema);

export default HealthMetric; 