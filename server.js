// server.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' directory

// Route to handle form submission
app.post('/submit', async (req, res) => {
  const { name, email, zipcode } = req.body;

  // Basic server-side validation
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zipcode)) {
    return res.json({
      success: false,
      message: 'Invalid ZIP code format.'
    });
  }

  try {
    // Extract first 5 digits of ZIP code
    const zip5 = zipcode.substring(0, 5);
    
    // Make request to Zippopotam.us API
    const response = await axios.get(`https://api.zippopotam.us/us/${zip5}`);
    
    // Log the response for debugging
    console.log('API Response:', response.data);

    const { places } = response.data;
    if (!places || places.length === 0) {
      return res.json({
        success: false,
        message: 'ZIP code not found.'
      });
    }

    const location = places[0];
    const city = location['place name'];
    const state = location['state abbreviation'];

    return res.json({
      success: true,
      message: `Hello ${name}, your ZIP code ${zipcode} is valid and corresponds to ${city}, ${state}.`
    });

  } catch (error) {
    console.error('Error validating ZIP code:', error.message);
    if (error.response && error.response.status === 404) {
      return res.json({
        success: false,
        message: 'ZIP code not found.'
      });
    }
    return res.json({
      success: false,
      message: 'Error validating ZIP code.'
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
