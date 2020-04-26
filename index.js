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
 * Attempts to create a connection with the PostgreSQL Database on specified port
 */
const createConnection = () => {
    database.connect()
    .catch( (error) => console.log(error) )
    .finally( () => console.log("Connected successfully on Port " + PORT + "..."));
} 

/**
 * Ends the connection to the database, should always call this once all transactions are done
 */
const endConnection = () => {
    database.end()
    .finally(console.log("Successfully disconnected from database."));
}

/**
 * Inserts a user into the Accounts table in the the database
 * @param {VARCHAR(50)} username 
 * @param {VARCHAR(50)} userPassword 
 */
const createAccount = (username, userPassword) => {
    database.query("INSERT INTO accounts(username, user_password) VALUES ($1, $2)", [username, userPassword])
    .catch( (error) => console.log(error) )
    .finally ( () => console.log("Successfully added user: " + username + " and password: " + userPassword + " to " + DATABASE + " ."));
}

/**
 * Returns all of the rows from our accounts tables
 */
const showAllAccounts = () => {
    database.query("SELECT * FROM accounts")
    .then(results => console.table(results.rows))   // results.rows returns an array of our query results 
    .catch( (error) => console.log(error) )
}
