"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PORT = 8080;
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'server is up & running '
    });
});
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});
