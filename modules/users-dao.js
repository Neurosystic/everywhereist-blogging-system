const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

//update SQL 
async function createUser(user){
    const db = await dbPromise;

    const result = await db.run(SQL`
        INSERT INTO users (fname, lname, username, hash_password, description, birth_date, email, avatar, authToken) VALUES 
            (${user.fname}, ${user.lname}, ${user.username}, ${user.hash_password}, ${user.description}, ${user.birth_date}, ${user.email}, ${user.avatar}, ${user.authToken})`);

    user.id = result.lastID;        
}

async function retrieveUserById(id) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        SELECT * FROM users WHERE id = ${id}`);

    return user;
}

async function retreiveUserByUsername(username){
    const db = await dbPromise;
    
    const user = await db.get(SQL`
        SELECT * FROM users WHERE username = ${username}`);
     
    return user;
}

//i dont seem to be using this function anywhere
async function retrieveUserWithCredentials(username, hash_password){
    const db = await dbPromise;

    const user = await db.get(SQL`
        SELECT * FROM users WHERE username = ${username} AND hash_password = ${hash_password}`);

    return user;
}

async function retrieveUserWithAuthToken(authToken){
    const db = await dbPromise;

    const user = await db.get(SQL`
        SELECT * FROM users
        WHERE authToken = ${authToken}`);

    return user;
}

async function retrieveAllUsers() {
    const db = await dbPromise;

    const users = await db.all(SQL`
        SELECT * FROM users`);

    return users;
}

//update SQL 
async function updateUser(user) {
    const db = await dbPromise;

    await db.run(SQL`
        UPDATE users SET 
            fname = ${user.fname},
            lname = ${user.lname}, 
            username = ${user.username}, 
            hash_password = ${user.hash_password},
            description = ${user.description},
            birth_date = ${user.birth_date},
            email = ${user.email},
            avatar = ${user.avatar},
            authToken = ${user.authToken}
        WHERE id = ${user.id}`);  
}

async function deleteUser(id){
    const db = await dbPromise;

    await db.run(SQL`
        DELETE from users WHERE id = ${id}`);
}

module.exports = {
    createUser,
    retrieveUserById,
    retrieveUserWithCredentials,
    retrieveUserWithAuthToken,
    retrieveAllUsers,
    updateUser,
    deleteUser,
    retreiveUserByUsername
}