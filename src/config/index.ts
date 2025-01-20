import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  google: {
    apiKey: process.env.GOOGLE_AI_API_KEY || '',
  },
};