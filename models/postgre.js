const {Client} = require('pg');
const client = new Client({
  user:"Symon",
  password:"3333",
  host:"127.0.0.1",
  port:5432,
  database:"Calendar"
});

module.exports = client;
