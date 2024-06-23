const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api.js');
require('dotenv').config(); 

const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
);
let db = mongoose.connection;

db.on('open', () => {
    console.log('Connected to the database.');
});

db.on('error', (err) => {
    console.log(`Database error: ${err}`);
});

// Routes
app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});