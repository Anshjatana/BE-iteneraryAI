import mongoose from 'mongoose';

// Create a model without defining a schema
const Itinerary = mongoose.model('Itinerary', new mongoose.Schema({}, { strict: false }));

// Insert data without schema validation
const itineraryData = {
  userId: '123',
  destination: 'Paris',
  budget: '5000',
  days: [
    {
      activities: [
        { type: 'Restaurant', name: 'Punjabi Haveli' },
        { type: 'Restaurant', name: 'Laxmi Refreshment Corner' },
      ],
    },
  ],
};

Itinerary.create(itineraryData)
  .then((result) => console.log('Itinerary Created:', result))
  .catch((err) => console.error('Error:', err));

export default Itinerary;
