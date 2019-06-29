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

app.get("/tasks", function(request, response) {
  const username = request.query.username;
  let query = "SELECT * FROM items";
  if (username) {
    query =
      "SELECT * FROM items JOIN user on items.UserId = user.UserId WHERE user.username = " +
      connection.escape(username);
  }
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

app.post("/tasks", function(request, response) {
  const itemsToBeSaved = request.body;
  connection.query('INSERT INTO items SET ?', itemsToBeSaved, function (error, results, fields) {
    if (error) {
      console.log("Error saving items", error);
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
app.delete("/tasks/:itemId", function(request, response) {
  const itemToBeDeleted = request.params.itemId;
  connection.query('DELETE FROM items WHERE itemId = ?', itemToBeDeleted, function (error, results, fields) {
    if (error) {
      console.log("Error deleting items", error);
      response.status(500).json({
        error: error
      });
    }
    else{
      let deletedMessage = JSON.stringify(itemToBeDeleted).replace(/\"/, '')
      .replace(/"/, '').replace(/:/, ' ').replace(/{/, '').replace(/}/, '')
       + " has been deleted"
      response.json({
        message: deletedMessage
      });
    }
  });
});
app.put("/tasks", function(request, response){
  const itemToBeUpdated = request.body.itemID
  const itemToBeCompleted = request.body.completed
  const itemUpdatedDescription = request.body.itemDescription
  connection.query('UPDATE items SET itemDescription = ?, completed = ? WHERE itemID = ?', [itemUpdatedDescription, 
    itemToBeCompleted, itemToBeUpdated], function(error, results, fields){
    if (error) {
      console.log("Error completing item", error);
      response.status(500).json({
        error: error
      });
    }
    else{
      let completedMessage = JSON.stringify(itemToBeUpdated).replace(/\"/, '')
      .replace(/"/, '').replace(/:/, ' ').replace(/{/, '').replace(/}/, '')
       + " has been completed"
      response.json({
        message: completedMessage
      });
    }
  });
});

module.exports.handler = serverless(app);