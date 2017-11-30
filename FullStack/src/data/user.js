import sqlite from 'sqlite';
import { error } from 'util';
const dbPromise = sqlite.open('./test.db', { Promise }).then(async (db) => { await db.run("PRAGMA foreign_keys = ON;"); return db; });

function UserDB() {
}

UserDB.prototype.findById = async function ($id) {
    const db = await dbPromise;
    // console.log(db)
    const user = await db.get("SELECT * FROM USERS WHERE id = $id;", { $id });
    return user;
}
UserDB.prototype.findByEmail = async function ($email) {
    const db = await dbPromise;
    const user = await db.get("SELECT * FROM USERS WHERE email = $email", { $email });
    return user;
}

UserDB.prototype.register = async function (user) {
    console.log("db register user")
    if (this.findByEmail(user.email)) {
        throw "user already exists";
    }
    const db = await dbPromise;
    const result = await db.run(`
    INSERT INTO USERS (
        name,
        email,
        password
    )
    VALUES (
        $name,
        $email,
        $password
    );`, {
            $name: user.name,
            $email: user.email,
            $password: user.password
        }
    )
    return result
}

module.exports = UserDB;