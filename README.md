# Capstone-Group5-StockApp

Group Members: Kylar Posey / Kyle Rivera / Paul Negrido

Stage 3 Updates:
Overview of Files sumbitted:

1) Front End:  All front-end related files are in the "stock-dashboard" folder.
This folder contains the following folders and files:
- Under the "src" folder: 
   - React Components folder - contains react component files
   - services(utilities) folder - utility function files
   - test folder - contains jest test files
   - assets folder - contains css files and images
   - App.js and index.js file
- End-to-End test file "testCafeInitial.js"
- gitignore - this file prevents node modules and .env file that contains the API keys
- package.json for the frontend 

2) Back End: All back-end related files are in "backend" folder.
This folder contains the following files:
- Under data: contains the investment-categories.json - file that stores different categories of investment
- Under routes: modularized route file for stockDetails.js
- index.js - monolithic file containing the backend code
- gitignore - this file prevents node modules and .env file that contains the API keys
- package.json for the backend

3) GitHub Actions/Workflow:  This folder contains the test.yml file for automated GitHub actions workflow file

4) Documentation Folder: Contains the documentation previously submitted as well as the User Guide submitted for Stage 3.

The app is deployed and can be accessed through the link below.  See User guide under the "Documentation" folder.

https://group5-capstone-project.web.app/


 
Local host run - To run the code locally do the following: 
Front End:
- Go to the stock-dashboard directory.
- Install the required modules with npm install
- run the script "npm start"

Back End:
- Go to the backend directory.
- Install the required modules with npm install
- Start the server with the command: node index.js


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


Video Links:
Project Voting Video: https://youtu.be/tgaViAHR_po

Stage 2 - https://youtu.be/eyHaKMJNorg

Previous Stage(s) video links:
Stage 1 - https://youtu.be/-7ZLHhF5aPQ

Previous Submission files:
Testing and Security Documentation - Stage 2:
Link to both documentation below:
https://github.com/kylarposey/Capstone-Group5-StockApp/tree/main/Documentation

- Testing-Strategy documentation => /documentation/Testing-Strategy.pdf
- Login-Security documentation => /documentation/Login-Security.pd