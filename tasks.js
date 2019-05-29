const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

app.get('/tasks', function (request, response) {

  const username = request.query.username;

  let taskList = [
    {taskDescription: "buy milk", completed: false},
    {taskDescription: "buy eggs", completed: false},
    {taskDescription: "buy bread", completed: true},
    {taskDescription: "buy coffee", completed: true}
  ];

  const someJson = {
    message:"Hello " + username + " your tasks are ",

    taskList: taskList

  };

  response.json(someJson);
})

module.exports.handler = serverless(app);