import mongoose from 'mongoose';

// Create a model without defining a schema
const Itinerary = mongoose.model('Itinerary', new mongoose.Schema({}, { strict: false }));

export default Itinerary;
