# Capstone-Group5-StockApp

Group Members: Kylar Posey / Kyle Rivera / Paul Negrido

Video Link:
Stage2 - https://youtu.be/eyHaKMJNorg (Current Stage)

Previous Stage(s) video links:
Stage1 - https://youtu.be/-7ZLHhF5aPQ

 
Local host run - To run the code locally do the following: 
Front End:
- Go to the stock-dashboard directory.
- Install the required modules with npm install
- run the script "npm start"

Back End:
- Go to the backend directory.
- Install the required modules with npm install
- Start the server with the command: node index.js

Or, go to the app hosted firebase with the link below: 
https://group5-capstone-project.web.app/

Running tests:
Jest Testing:
To run tests locally do the following:
- Go the stock-dashboard directory.
- To run all jest unit tests, run the command below:
   Command ==> npm test
- To show jest unit tests coverage, run the command below:
   Comand ==> npm test -- --coverage --watchAll=false --verbose

TestCafe Testing (End-to-End):
- Go the stock-dashboard directory.
- Run the command: testcafe < installed browser of choice > ./testCafeTest/< filename of test >
   Example: testcafe chrome ./testCafeTest/testCafeInitial.js

GitHub Actions:
- We've setup GitHub workflows to run automated tests.
- Pull requests automatically trigger running our unit tests and shown in Github Actions.

Testing and Security Documentation - Stage 2:
Link to both documentation below:
https://github.com/kylarposey/Capstone-Group5-StockApp/tree/main/Documentation

- Testing-Strategy documentation => /documentation/Testing-Strategy.pdf
- Login-Security documentation => /documentation/Login-Security.pd