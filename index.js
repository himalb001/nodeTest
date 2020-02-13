const express = require('express');
const webService = require('./web.service');
const subtext = require("./subtext");
const fizzBuzz = require("./fizzbuzz");
const constants = require("./constants");

const app = express();
const port = 9999;


// Root API for fizz-buzz style output
app.get('/', fizzBuzz.handler);

app.get('/subtexts', subtext.handler);

let divisorMap;

app.listen(port, () => console.log(`Server running on port ${port}!`));