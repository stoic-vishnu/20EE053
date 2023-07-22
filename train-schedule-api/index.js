const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.json());


const johnDoeRailwayURL = 'http://20.244.56.144/train';
const clientID = '364a0d9f-109b-44c2-b1ca-7e0ff3911158';
const clientSecret = 'XZhPnQaUxyOahzCa';
let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTAwMjIzMDQsImNvbXBhbnlOYW1lIjoiSVJDVEMiLCJjbGllbnRJRCI6IjM2NGEwZDlmLTEwOWItNDRjMi1iMWNhLTdlMGZmMzkxMTE1OCIsIm93bmVyTmFtZSI6IiIsIm93bmVyRW1haWwiOiIiLCJyb2xsTm8iOiIyMDI0In0.m56hUbni2Px79ozNw4xDaxRbiySfZHxWrW4w7lAiIl0';

//Register the company with John Doe Railway

app.post('/register', async (req, res) => {
  try {
    const registrationData = {
      companyName: req.body.companyName,
      ownerName: req.body.ownerName,
      rollNo: req.body.rollNo,
      ownerEmail: req.body.ownerEmail,
      accessCode: req.body.accessCode,
    };

    const response = await axios.post(`${johnDoeRailwayURL}/register`, registrationData);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Obtain Authorization Token
app.post('/auth', async (req, res) => {
  try {
    const authData = {
      companyName: req.body.companyName,
      clientID: clientID,
      ownerName: req.body.ownerName,
      ownerEmail: req.body.ownerEmail,
      rollNo: req.body.rollNo,
      clientSecret: clientSecret,
    };

    const response = await axios.post(`${johnDoeRailwayURL}/auth`, authData);
    accessToken = response.data.access_token;
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Authorization failed' });
  }
});

// Get all train details
app.get('/trains', async (req, res) => {
  try {
    const headers = { Authorization: `Bearer ${accessToken}` };
    const response = await axios.get(`${johnDoeRailwayURL}/trains`, { headers });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch train data' });
  }
});



// To get all trains in the next 12 hours, ignoring those departing in the next 30 minutes.

app.get('/schedule', async (req, res) => {
  try {
    const twelveHoursFromNow = new Date();
    twelveHoursFromNow.setHours(twelveHoursFromNow.getHours() + 12);

    const trains = await Train.find({
      'departureTime': { $gt: new Date(), $lt: twelveHoursFromNow },
      'delayedBy': { $lte: 30 },
    })
      .sort({ 'price.AC': 1, 'price.sleeper': 1, 'seatsAvailable.AC': -1, 'seatsAvailable.sleeper': -1, 'departureTime': 1 })
      .exec();

    res.status(200).json(trains);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch train schedule' });
  }
});


// const Train = require('./models/train');

// async function fetchAndSaveTrainData() {
//   try {
//     const headers = { Authorization: `Bearer ${accessToken}` };
//     const response = await axios.get(`${johnDoeRailwayURL}/trains`, { headers });
//     if(Array.isArray(response.data)) {
//     const trains = response.data.map(trainData => ({
//       trainName: trainData.trainName,
//       trainNumber: trainData.trainNumber,
//       departureTime: trainData.departureTime,
//       seatsAvailable: trainData.seatsAvailable,
//       price: trainData.price,
//       delayedBy: trainData.delayedBy,
//     }));

//     await Train.insertMany(trains);
//   }
//   else{
//     console.error('Invalid response format:', response.data);   
//   }
//  } catch (error) {
//     console.error('Failed to fetch and save train data:', error);
//   }
// }

// fetchAndSaveTrainData();




const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
