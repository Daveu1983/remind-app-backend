const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.get('/tasks', function (request, response) {

  const username = request.query.username;

  const someJson = {
    message:"Hello " + username + "your tasks are", 
    tasks = [
      {taskDescription: "buy milk", completed: false},
      {taskDescription: "buy eggs", completed: false},
      {taskDescription: "buy bread", completed: true},
      {taskDescription: "buy coffee", completed: true}

    ]
  };
  response.json(someJson);
})

module.exports.handler = serverless(app);