const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const multer = require('multer');
const pdfParse = require('pdf-parse');
require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Gemini API setup
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // Use your Gemini API key from the .env file

// Database setup
mongoose
    .connect(process.env.dburl)
    .then((result) => {
        console.log('Connected to MongoDB');
        app.listen(5000, () => {
            console.log('Server started on 5000');
        });
    })
    .catch((err) => {
        console.log('Could not connect to MongoDB');
    });

// Routes
app.get('/', (req, res) => {
    res.render('upload'); // Render the upload form
});

app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        // Check if the uploaded file is a valid PDF
        if (!req.file || req.file.mimetype !== 'application/pdf') {
            return res.status(400).send('Please upload a valid PDF file.');
        }

        // Extract text from the uploaded PDF
        const pdfData = await pdfParse(req.file.path); // Pass the file path to pdf-parse
        const pdfText = pdfData.text;

        // Generate a summary using Gemini's API
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash", // Use the appropriate Gemini model
            contents: pdfText,        // Pass the extracted text to Gemini's API
        });

        const summary = response.text; // Adjust based on Gemini's API response structure

        // Render the summary
        res.render('summary', { summary });
    } catch (err) {
        console.error("Error while processing the PDF:", err);
        res.status(500).send('An error occurred while processing the PDF.');
    }
});

app.post('/submit-event', (req, res) => {
    const event = new Event(req.body);
    event.save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/create-event', (req, res) => {
    res.render('form'); // Render the form.ejs file
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
