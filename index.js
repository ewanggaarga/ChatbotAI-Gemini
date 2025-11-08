import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;

    try {
        if(!Array.isArray(messages)) throw new Error('Messages must be an array!');

        const contents = messages.map(({ role, content }) => ({
            role,
            parts: [{ text: content }]
        }));

        const response = await model.generateContent({
            contents
        });

        res.status(200).json({ result: response.response.text() });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.listen(port, () => {
    console.log(`Gemini Chatbot running on http://localhost:${port}`);
});