const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql')
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "reminder"
});

app.get("/users", function(request, response) {
  const username = request.query.username;
  let query = "SELECT * FROM user";

  connection.query(query, (err, queryResults) => {
    if (err) {
      console.log("Error fetching items", err);
      response.status(500).json({
        error: err
      });
    } else {
      response.json({
        tasks: queryResults
      });
    }
  });
});
app.post("/users", function(request, response) {
    const userToBeSaved = request.body;
    connection.query('INSERT INTO user SET ?', userToBeSaved, function (error, results, fields) {
      if (error) {
        console.log("Error saving user", error);
        response.status(500).json({
          error: error
        });
      }
      else{
        response.json({
          ItemId:results.insertId
        });
      }
    });
  });


module.exports.handler = serverless(app);