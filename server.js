const { Client } = require('pg'); // Library ('pg') needed to have Postgres, make sure to npm install pg in the command line
const express = require ("express");
const server = express();
server.use(express.json()); // This will tell us that .body will be a JSON and should expect it

/**
 * User, host, and port can be check in pgAdmin4 by clicking on PostgreSQL (ver. #) and 'properties' tab.
 *  Adjust these values based on the database it's trying to connect to.
 */
const USER = "postgres";
const PASSWORD = "password";    // The password set during installation of PostgreSQL or initializing of the database
const HOST = "localhost";       // Can also check by running: SELECT boot_val,reset_val FROM pg_settings WHERE name='listen_addresses'; on database
const PORT = 5432;              // The port that has PostgreSQL installed on
const DATABASE = "UnityTestDB"; // Name of the database under the 'Databases' tab in PgAdmin4

const database = new Client({
    user: USER,
    password: PASSWORD,  
    host: HOST,    
    port: PORT,             
    database: DATABASE
});

/**
 * Express REST Methods - GET, POST, and DELETE are below
 */ 
// GET method
// If you go on the browser and type in the URL 'http://localhost:3000/accounts' it will return our query which has the accounts information
/**
 * Example of it in console browser:
 *  fetch("http://localhost:3000/accounts", {method: "GET"}).then(a=>a.json()).then(console.log)
 */
server.get("/accounts", async(request, response) => {
    try {
        const results = await showAllAccounts();                // stores the results of that information into this variable 'results
        response.setHeader('Content-Type', 'application/json'); // Tells the browser that the content that is being sent to it is JSON format and not text/html;
        response.send(JSON.stringify(results));                 // returns results into JSON format 
        results.success = true;                                 // .success is someting that's made on the spot (it isn't defined anywhere else but here)
    } catch (error) {
        results.success = false;                               
    }
 });


// POST method
/**
 * Example of it in console browser:
 *  fetch("http://localhost:3000/accounts", {method: "POST" , headers: {"content-type": "application/json"}, body: JSON.stringify({"username":"abc123","userPassword":"xyz321"}) }).then(a=>a.json()).then(console.log)
 */
server.post("/accounts", async(request, response) => {
    
    let results = {}; // Creates an empty JSON object to hold our results status (which is pretty much only true or false)

    try {
        const requestedJSON = request.body;                                        // Body will be JSON but will not be parsed by express unless told to - it's told to on line 4
        await createAccount(requestedJSON.username, requestedJSON.userPassword);   // the parameter being sent are coming from the browser console (IMPORTANT: the .username & .userPassword need to be named the same when doing the command in browser)
        results.success = true;                                                    // Just lets the system user know that it successfully completed its action
        
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

 // DELETE method
 /**
  * Example of it in console browser:
  *     fetch("http://localhost:3000/accounts", {method: "DELETE" , headers: {"content-type": "application/json"}, body: JSON.stringify({"username":"abc123"}) }).then(a=>a.json()).then(console.log)
  */
 server.delete("/accounts", async(request, response) => {
     
    let results = {}; // Creates an empty JSON object to hold our results (which is pretty much only true or false)

    try {
        const requestedJSON = request.body
        await deleteAccount(requestedJSON.username);  // the parameter being sent are coming from the browser console (IMPORTANT: the .username need same when doing the command in browser)
        results.success = true;                       // Just lets the system user know that it successfully completed its action
    } 
    catch (error) {
        results.success=false;
        console.log(`Failed DELETE request - details: ${error}`);
    } 
    finally {
        response.setHeader('Content-Type', 'application/json'); // Tells the browser that the content that is being sent to it is JSON format and not text/html;
        response.send(JSON.stringify(results));                 // returns results into JSON format
    }

 })

 
server.listen(3000, () => console.log("Web server is listening on Port 3000")); 

// --------------------------------------------------- QUERIES  --------------------------------------------------- //

/**
 * Creates a connection with the PostgreSQL Database - MUST establish a connection before querying.
 */
const createConnection = async() => {
    try {
        await database.connect(); 
        console.log(`Successfully connected on Port ${PORT}.`);

        return true;
    } 
    catch (error) {
        console.error(`Failed to connect ${e}`);

        return false;
    }
} 

/**
 * Ends the connection to the database - should always call this once all transactions are done.
 */
const endConnection = async() => {
    try {
        await database.end();
        console.log(`Successfully disconnected from Port ${PORT}!`);

        return true;
    }
    catch (error) {
        console.error(`Failed to disconnect from Port ${PORT} - details: ${error}`);

        return false;
    }
}

/**
 * Inserts a user into the Accounts table in the the database.
 * @param {VARCHAR(50)} username 
 * @param {VARCHAR(50)} userPassword 
 */
const createAccount = async(username, userPassword) => {
    try {
        await database.query("INSERT INTO accounts(username, user_password) VALUES ($1, $2)", [username, userPassword]);
        console.log(`Succesfully added user: ${username} with the password: ${userPassword} to ${DATABASE}.`);

        return true;
    }
    catch(error) {
        console.error(`Failed to add ${username} and ${userPassword} - details: ${error}`);

        return false;
    }
}

/**
 * Returns all of the rows from our accounts tables.
 */
const showAllAccounts = async() => {
    try {
        var results = await database.query("SELECT * FROM accounts");
        console.table(results.rows);
        
        return results.rows;
    }
    catch(error) {
        console.error(`Could not return all acounts - deailts: ${error}`);

        return false;
    }
}

/**
 * Removes a specified user from the accounts table based on the given username.
 * @param {VARCHAR(50)} username 
 */
const deleteAccount = async(username) => {

    try{
        await database.query("DELETE FROM accounts WHERE username = $1", [username]);
        console.log(`Successfully removed user ${username} from 'Accounts' table in ${DATABASE}.`)

        return true;
    }
    catch(error){
        console.error(`Failed to remove ${username} - details: ${error}`)

        return false;
    }
}

createConnection();
