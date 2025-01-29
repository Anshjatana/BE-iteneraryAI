"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const itinerary_routes_1 = require("./routes/itinerary.routes");
const ai_routes_1 = require("./routes/ai.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/itineraries', itinerary_routes_1.itineraryRoutes);
app.use('/api/ai', ai_routes_1.aiRoutes);
// Connect to MongoDB
(0, db_1.connectDB)();
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
