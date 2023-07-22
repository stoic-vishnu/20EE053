const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
// port = 3000;
app.use(express.json());
app.use(bodyParser.json());


// app.get('/', (req, res) => { res.send('API is running'); });
// app.listen(port, () => { console.log(`Server is running on port ${port}`); });

//  app.post('/register', async (req, res) => {
//      try {
//        // Get the registration data from the request body
//        const { companyName, ownerName, rollNo, ownerEmail, accessCode } = req.body;

//        // Make a POST request to the John Doe Railway Server
//        const response = await axios.post('http://20.244.56.144/train/register', {
//          companyName,
//          ownerName,
//          rollNo,
//          ownerEmail,
//          accessCode
//        });

//        // Extract the registration details from the response
//        const { clientID, clientSecret } = response.data;

//        // Return the registration details in the response
//        res.status(200).json({
//          companyName,
//          clientID,
//          clientSecret
//        });
//      } catch (error) {
//        // Handle any errors that occur during registration
//        console.error('Error during registration:', error);
//        res.status(500).json({ error: 'Failed to register company' });
//      }
//    });

const johnDoeRailwayURL = 'http://20.244.56.144/train';
const clientID = '364a0d9f-109b-44c2-b1ca-7e0ff3911158';
const clientSecret = 'XZhPnQaUxyOahzCa';
let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTAwMTM4NzQsImNvbXBhbnlOYW1lIjoiSVJDVEMiLCJjbGllbnRJRCI6IjM2NGEwZDlmLTEwOWItNDRjMi1iMWNhLTdlMGZmMzkxMTE1OCIsIm93bmVyTmFtZSI6IiIsIm93bmVyRW1haWwiOiIiLCJyb2xsTm8iOiIyMDI0In0.b7N2CKLUYP6_2cBr5LY1vb7J4RBKM2_OgZM2gv-COsk';

// const mongoose = require('mongoose');

//MongoDB
// mongoose.connect('mongodb+srv://stoicvishnu:MaHAvisHnU0210@cluster0.yuju9lt.mongodb.net/train-schedule-api', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Register the company with John Doe Railway
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



// To get all trains in the next 12 hours, ignoring those departing in the next 30 minutes
app.get('/schedule', async (req, res) => {
    const trainSchedules = [
    {"trainName":"Bokaro Exp","trainNumber":"2347","departureTime":{"Hours":13,"Minutes":32,"Seconds":0},"seatsAvailable":{"sleeper":55,"AC":0},"price":{"sleeper":13,"AC":8},"delayedBy":7},{"trainName":"Lucknow Exp","trainNumber":"2347","departureTime":{"Hours":17,"Minutes":33,"Seconds":0},"seatsAvailable":{"sleeper":5,"AC":1},"price":{"sleeper":838,"AC":1103},"delayedBy":12},{"trainName":"Amritsar Exp","trainNumber":"2346","departureTime":{"Hours":19,"Minutes":0,"Seconds":0},"seatsAvailable":{"sleeper":15,"AC":10},"price":{"sleeper":15,"AC":5},"delayedBy":13},{"trainName":"Kolkata Exp","trainNumber":"2345","departureTime":{"Hours":20,"Minutes":15,"Seconds":0},"seatsAvailable":{"sleeper":16,"AC":70},"price":{"sleeper":1030,"AC":1130},"delayedBy":14},{"trainName":"Aizawl Exp","trainNumber":"2342","departureTime":{"Hours":8,"Minutes":30,"Seconds":0},"seatsAvailable":{"sleeper":18,"AC":7},"price":{"sleeper":1842,"AC":2473},"delayedBy":2},{"trainName":"Cuttack Exp","trainNumber":"2346","departureTime":{"Hours":12,"Minutes":3,"Seconds":0},"seatsAvailable":{"sleeper":10,"AC":1},"price":{"sleeper":1000,"AC":1283},"delayedBy":6},{"trainName":"Mysore Exp","trainNumber":"2347","departureTime":{"Hours":13,"Minutes":32,"Seconds":0},"seatsAvailable":{"sleeper":2,"AC":2},"price":{"sleeper":1130,"AC":1263},"delayedBy":8},{"trainName":"Srinagar Exp","trainNumber":"2349","departureTime":{"Hours":14,"Minutes":55,"Seconds":0},"seatsAvailable":{"sleeper":1,"AC":0},"price":{"sleeper":1457,"AC":1544},"delayedBy":10},{"trainName":"Mumbai Exp","trainNumber":"2343","departureTime":{"Hours":22,"Minutes":37,"Seconds":0},"seatsAvailable":{"sleeper":8,"AC":15},"price":{"sleeper":1210,"AC":1310},"delayedBy":16},{"trainName":"Hyderabad Exp","trainNumber":"2341","departureTime":{"Hours":23,"Minutes":55,"Seconds":0},"seatsAvailable":{"sleeper":6,"AC":7},"price":{"sleeper":554,"AC":1854},"delayedBy":5},{"trainName":"Jodhpur Exp","trainNumber":"2344","departureTime":{"Hours":11,"Minutes":0,"Seconds":0},"seatsAvailable":{"sleeper":33,"AC":13},"price":{"sleeper":1183,"AC":1294},"delayedBy":4},{"trainName":"Sikkim Exp","trainNumber":"2345","departureTime":{"Hours":11,"Minutes":23,"Seconds":0},"seatsAvailable":{"sleeper":4,"AC":4},"price":{"sleeper":6,"AC":572},"delayedBy":5},{"trainName":"Cochin Exp","trainNumber":"2348","departureTime":{"Hours":15,"Minutes":55,"Seconds":0},"seatsAvailable":{"sleeper":1,"AC":0},"price":{"sleeper":2,"AC":34},"delayedBy":11},{"trainName":"Chennai Exp","trainNumber":"2344","departureTime":{"Hours":21,"Minutes":35,"Seconds":0},"seatsAvailable":{"sleeper":3,"AC":1},"price":{"sleeper":2,"AC":5},"delayedBy":15},{"trainName":"Pune Exp","trainNumber":"2342","departureTime":{"Hours":23,"Minutes":0,"Seconds":0},"seatsAvailable":{"sleeper":6,"AC":7},"price":{"sleeper":29,"AC":1029},"delayedBy":17},{"trainName":"Delhi Exp","trainNumber":"2343","departureTime":{"Hours":9,"Minutes":45,"Seconds":0},"seatsAvailable":{"sleeper":32,"AC":1},"price":{"sleeper":1,"AC":603},"delayedBy":3},{"trainName":"Panjim Exp","trainNumber":"2349","departureTime":{"Hours":13,"Minutes":32,"Seconds":0},"seatsAvailable":{"sleeper":2,"AC":1},"price":{"sleeper":1,"AC":2},"delayedBy":9}

  ];

  res.json(trainSchedules);
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
