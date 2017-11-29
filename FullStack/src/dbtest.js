import express from 'express';
import Promise from 'bluebird';
import sqlite from 'sqlite';
import nunjucks from 'nunjucks';
import bodyparser from 'body-parser';
import cookieparser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';

const app = express();
const dbPromise = sqlite.open('./test.db', { Promise });

import UserRouter from './routes/user';
import PPConfig from './config/passport';

app.use(cookieparser());
app.use(bodyparser.urlencoded({ extended: false }));

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true,
    watch: true
})

app.enable('trust proxy');
app.use(session({ secret: 'bunnies' }));
app.use(passport.initialize());
app.use(passport.session());
PPConfig(passport);
app.use('/user', UserRouter(passport));

async function initDb() {
    const db = await dbPromise;
    await db.run(`PRAGMA foreign_keys = ON;`)
    return db;
}

app.get('/', async (req, res, next) => {
    try {
        console.log(req.user);
        const db = await initDb();
        const [comments, users] = await Promise.all([
            db.all(
                `SELECT 
                COMMENTS.id as id,
                USERS.name AS author,
                COMMENTS.message AS message 
            FROM COMMENTS 
            INNER JOIN USERS on USERS.id = COMMENTS.user`
            ), db.all(
                `SELECT id, name FROM USERS`
            )]);
        console.log(comments.length);
        res.render('comments.njk', { comments, users, user: req.user });
    } catch (err) {
        next(err);
    }
});
app.post('/comment', async (req, res, next) => {
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
                $user: req.user.id,
                $message: req.body.message
            })
        res.redirect('/');
    }
    catch (err) {
        next(err);
    }
})

app.listen(8000);