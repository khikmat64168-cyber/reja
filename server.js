const http = require('http');
const { MongoClient } = require('mongodb');

let db;
module.exports.db = () => db;

const connectionString =
  'mongodb+srv://Matthew01:Matthew2024@cluster0.ydwixqq.mongodb.net/Reja';

//++++++++++++ READ STEP 1: Server ishga tushadi — MongoDB Atlas ga ulaniladi ++++++++++++//
MongoClient.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },

  ///bu ikki parametirdan so'ng uchinchi parametir callback bo'ladi
  (err, client) => {
    if (err) console.log('ERROR on connection MongoDB');
    else {
      db = client.db('Reja');
      //++++++++++++ READ STEP 2: Ulanish muvaffaqiyatli — app.js yuklanadi, server 3000 portda tinglaydi ++++++++++++//
      const app = require('./app');
      console.log('MongoDB connection succeed');
      console.log(client);

      const server = http.createServer(app);
      let port = 3000;
      server.listen(port, () => {
        console.log(`The server is runing successfully on port  ${port}`);
        console.log(`http://localhost:${port}`);
      });
    }
  },
);
