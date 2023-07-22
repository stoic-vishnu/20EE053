const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainName: { type: String, required: true },
  trainNumber: { type: String, required: true },
  departureTime: {
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true },
    seconds: { type: Number, default: 0 },
  },
  seatsAvailable: {
    sleeper: { type: Number, required: true },
    AC: { type: Number, required: true },
  },
  price: {
    sleeper: { type: Number, required: true },
    AC: { type: Number, required: true },
  },
  delayedBy: { type: Number, default: 0 },
});

const Train = mongoose.model('Train', trainSchema);

module.exports = Train;
