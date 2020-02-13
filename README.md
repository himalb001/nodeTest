# NodeJS test 

## Requirement
The code is written using `node v10.16.0` and npm `6.9.0`. The code may not work as intended on any other major version of node.

## Starting server
To start the server, run command `npm start` and navigate to localhost:9999

## Endpoints
There are two endpoints:  
`localhost:9999`  
`localhost:9999/subtexts`

## Tests 
Run `npm test` to run unit tests.   

Unit tests are provided with the project. Unit tests files are named `**.spec.js` under test folder. Mocha is used as the testing framework whereas Chai is used as assertion library

Not all of the code is completely covered with unit test. This is due to time constraint and time involved in mocking HTTP server for example.

Screenshot of test cases attached below:

![Screenshot](/Users/himal/Documents/reckon/screenshot.png)