import express from 'express';
import Promise from 'bluebird';
import sqlite from 'sqlite';
import nunjucks from 'nunjucks';
import bodyparser from 'body-parser';

const app = express();
const dbPromise = sqlite.open('./test.db', { Promise });

async function init() {
    const db = await dbPromise;
    await db.run("PRAGMA foreign_keys = ON;");
}

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true,
    watch: true
})

app.use(bodyparser.urlencoded());

async function initDb() {
    const db = await dbPromise;
    await db.run(`PRAGMA foreign_keys = ON;`)
    return db;
}

app.get('/', async (req, res, next) => {
    try {
        const db = await initDb();
        const comments = await db.all(
            `SELECT 
                COMMENTS.id as id,
                USERS.name AS author,
                COMMENTS.message AS message 
            FROM COMMENTS 
            INNER JOIN USERS on USERS.id = COMMENTS.user`
        )
        console.log(comments.length);
        res.render('comments.njk', { comments });
    } catch (err) {
        next(err);
    }
});
app.post('/comment', async (req, res, next) => {
    console.log("user", req.body.userid);
    console.log("message", req.body.message);
    try {
        const db = await initDb();
        const result = await db.run(`
        INSERT INTO "COMMENTS" (
            user,
            message
        )
        VALUES (
            $user,
            $message
        );`, {
                $user: req.body.userid,
                $message: req.body.message
            })
        // console.log("result", result);
        res.redirect('/');
    }
    catch (err) {
        next(err);
    }
})

app.enable('trust proxy');
app.listen(8000);