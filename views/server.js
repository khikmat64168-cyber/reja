const http = require('http');
const mongodb = require('mongodb');
const { connect } = require('http2');

let db;
const connectionString =
  'mongodb+srv://Matthew01:Matthew2024@cluster0.ydwixqq.mongodb.net/Reja';

mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },

  ///bu ikki parametirdan so'ng uchinchi parametir callback bo'ladi
  (err, client) => {
    if (err) console.log('ERROR on connection MongoDB');
    else {
      const app = require('./app');
      console.log('MongoDB connection succeed');
      module.exports = client;

      const server = http.createServer(app);
      let port = 3000;
      server.listen(port, () => {
        console.log(`The server is runing successfully on port  ${port}`);
        console.log(`http://localhost:${port}`);
      });
    }
  },
);
