const { Client } = require('pg'); // Library ('pg') needed to have Postgres, make sure to npm install pg in the command line

/**
 * Fills out key information regarding our database and how to connect to it
 * 
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
const createAccountAndPerson = async(username, userPassword) => {
    
    var accountId;
    
    try {
        await database.query("INSERT INTO accounts(username, user_password) VALUES ($1, $2)", [username, userPassword]); // Insert the user in with the passed params
        console.log(`Succesfully added user: ${username} with the password: ${userPassword} to ${DATABASE}.`);           // Logs out that user has been inserted
        
        await database.query("SELECT account_id FROM Accounts WHERE username=$1", [username]);                           // Query for the account_id that has the given username
        accountId = results.rows;                                                                                        // Store the query result in accountId
        console.log(accountId);

        createPerson(accountId, firstName, lastName);
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

/**
 * We should have this setup where the person will create an account and then is FORCED to create a person right after it
 * @param {FOREIGN KEY from Accounts(account_id)} accountId 
 * @param {VARCHAR(50)} firstName 
 * @param {VARCHAR(50)} lastName 
 */
const createPerson = async(accountId, firstName, lastName) => {

    try{
        await database.query("INSERT INTO PersonInfo(account_id)")
    } 
    catch(error) {

    }
}

module.exports = {
    createConnection,
    endConnection,
    showAllAccounts,
    createAccountAndPerson,
    deleteAccount,
}


/**
 * Test local playground here 
 */
createConnection()