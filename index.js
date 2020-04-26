const { Client } = require('pg'); // Library ('pg') needed to have Postgres, make sure to npm install pg in the command line

/**
 * User, host, and port can be check in pgAdmin4 by clicking on PostgreSQL (ver. #) and 'properties' tab
 *  Adjust these values based on the database it's trying to connect to
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
 * Creates a connection with the PostgreSQL Database - MUST establish a connection before querying
 */
const createConnection = () => {
    database.connect()
    .catch( (error) => console.log(error) )
    .finally( () => console.log("Connected successfully on Port " + PORT + "..."));
} 

/**
 * Ends the connection to the database - should always call this once all transactions are done
 */
const endConnection = () => {
    database.end()
    .finally(console.log("Successfully disconnected from " + DATABASE + "."));
}

/**
 * Inserts a user into the Accounts table in the the database
 * @param {VARCHAR(50)} username 
 * @param {VARCHAR(50)} userPassword 
 */
const createAccount = (username, userPassword) => {
    database.query("INSERT INTO accounts(username, user_password) VALUES ($1, $2)", [username, userPassword])
    .catch( (error) => console.log(error) )
    .finally ( () => console.log("Successfully added user: " + username + " and password: " + userPassword + " to " + DATABASE + "."));
}

/**
 * Returns all of the rows from our accounts tables
 */
const showAllAccounts = () => {
    database.query("SELECT * FROM accounts")
    .then(results => console.table(results.rows))   // results.rows returns an array of our query results 
    .catch( (error) => console.log(error) )
}

/**
 * Removes a specified user from the accounts table based on the given username
 * @param {VARCHAR(50)} username 
 */
const deleteAccount = (username) => {
    database.query("DELETE FROM accounts WHERE username = $1", [username])
    .catch( (error) => console.log(error) )
    .finally( () => console.log("Successfully removed user: " + username + " from " + DATABASE + "."));
}

createConnection();
createAccount("TestUser1", "pass1234");
showAllAccounts();
deleteAccount("TestUser1");
showAllAccounts();


/**
 *  This promise will chain things together because it is async.for as long as it is successful it will 
 *      keep call the next 'then' in the .then.then.then call. Once it fails a call or runs out of 'thens'
 *      it will end. Once a query is executed it defer to the next 'then' where you can access the results.
 *  The return value of the querires will always be returned in an object called 'Results'.
 *      Results have have different properties than can be accessed such as '.rows', '.rowCount', .oid', etc.
 *      The rows property is an array that will return all the rows
 * 
 **/ 

// database.connect()
// .then( () => console.log("Connected succesfully!") )
// .then( () => database.query("BEGIN") )
// .then( () => database.query("INSERT INTO accounts(username, user_password) VALUES ($1, $2)", ['SomeRandomUser', 'NotTheBestPassword123']) ) // This is a single atomic transaction where we are inserting one thing on this run, should we want to insert multiple things we need to make a BEGIN and COMMIT transaction (added it in to the top abd bottom to show how to do it)
// .then( () => database.query("COMMIT") )
// .then( () => database.query("SELECT * FROM accounts where username = $1", ["SomeRandomUser"]) ) // The "$1" is a parameter that will take the value at the first index of the array after the comma - This helps prevent SQL Injection
// .then( results => console.table(results.rows))
// .catch( error => console.log(error))
// .finally( () => database.end());
