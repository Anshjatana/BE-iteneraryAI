"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Create a model without defining a schema
const Itinerary = mongoose_1.default.model('Itinerary', new mongoose_1.default.Schema({}, { strict: false }));
exports.default = Itinerary;
