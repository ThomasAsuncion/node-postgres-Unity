const database = require ('./database.js');
const express = require ("express");
const server = express();
server.use(express.json()); // This will tell us that .body will be a JSON and should expect it

// Establsh proper connections for the API to listen on a port and connect with a PostgreSQL Database
server.listen(3000, () => console.log("Web server is listening on Port 3000.")); 
database.createConnection();

/**
 * Express REST Methods - GET, POST, and DELETE are below
 */ 


/**
 * GET Method for URL '/accounts' where it will return all of the accounts in the database.
 * 
 * Example of it in console browser:
 *  fetch("http://localhost:3000/accounts", {method: "GET"}).then(a=>a.json()).then(console.log)
 */
server.get("/accounts", async(request, response) => {
    try {
        const results = await database.showAllAccounts();                // stores the results of that information into this variable 'results
        response.setHeader('Content-Type', 'application/json'); // Tells the browser that the content that is being sent to it is JSON format and not text/html;
        response.send(JSON.stringify(results));                 // returns results into JSON format 
        results.success = true;                                 // .success is someting that's made on the spot (it isn't defined anywhere else but here)
    } catch (error) {
        results.success = false;                               
    }
 });

/**
 * POST Method for URL '/accounts' where it will expect JSON to add a user into the database given the username and password.
 * 
 * Example of it in console browser:
 *  fetch("http://localhost:3000/accounts", {method: "POST" , headers: {"content-type": "application/json"}, body: JSON.stringify({"username":"SomeRandomUser","userPassword":"pass123"}) }).then(a=>a.json()).then(console.log)
 */
server.post("/accounts", async(request, response) => {
    
    let results = {}; // Creates an empty JSON object to hold our results status (which is pretty much only true or false)

    try {
        const requestedJSON = request.body;                                                 // Body will be JSON but will not be parsed by express unless told to - it's told to on line 4
        await database.createAccountAndPerson(requestedJSON.username, requestedJSON.userPassword);   // the parameter being sent are coming from the browser console (IMPORTANT: the .username & .userPassword need to be named the same when doing the command in browser)
        results.success = true;                                                             // Just lets the system user know that it successfully completed its action
        
    }
    catch (error) {
        results.success=false;
        console.log(`Failed POST request - details: ${error}`);
    }
    finally {
        response.setHeader('Content-Type', 'application/json'); // Tells the browser that the content that is being sent to it is JSON format and not text/html;
        response.send(JSON.stringify(results));                 // returns results into JSON format (true or false)
    }

 })

 /**
  * DELETE Method for URL '/accounts' where it will remove a user given the username.
  * 
  * Example of it in console browser:
  *     fetch("http://localhost:3000/accounts", {method: "DELETE" , headers: {"content-type": "application/json"}, body: JSON.stringify({"username":"abc123"}) }).then(a=>a.json()).then(console.log)
  */
 server.delete("/accounts", async(request, response) => {
     
    let results = {}; // Creates an empty JSON object to hold our results (which is pretty much only true or false)

    try {
        const requestedJSON = request.body
        await database.deleteAccount(requestedJSON.username);   // the parameter being sent are coming from the browser console (IMPORTANT: the .username need same when doing the command in browser)
        results.success = true;                                 // Just lets the system user know that it successfully completed its action
    } 
    catch (error) {
        results.success=false;
        console.log(`Failed DELETE request - details: ${error}`);
    } 
    finally {
        response.setHeader('Content-Type', 'application/json'); // Tells the browser that the content that is being sent to it is JSON format and not text/html;
        response.send(JSON.stringify(results));                 // returns results into JSON format
    }
 });
