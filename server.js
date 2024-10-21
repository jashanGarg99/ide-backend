const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://jashan9garg:eeEwlxHsIWP2bzU5@cluster0.j1qae.mongodb.net/ide?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB Schema and Model
const codeSchema = new mongoose.Schema({
  code: String,
  language: String,
  input: String,
  createdAt: { type: Date, default: Date.now },
});

const Code = mongoose.model('Code', codeSchema);

// API to store code
app.post('/storeCode', async (req, res) => {
  try {
    const { code, language, input } = req.body;
    const newCode = new Code({ code, language, input });
    const savedCode = await newCode.save();
    res.json({ success: true, uniqueId: savedCode._id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving code' });
  }
});

// API to get code by ID
app.get('/getCode/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const codeData = await Code.findById(id);
    if (!codeData) {
      return res.status(404).json({ success: false, message: 'Code not found' });
    }
    res.json({ success: true, code: codeData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching code' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
