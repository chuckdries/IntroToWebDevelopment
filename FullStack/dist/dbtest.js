'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _sqlite = require('sqlite');

var _sqlite2 = _interopRequireDefault(_sqlite);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();
const dbPromise = _sqlite2.default.open('./test.db', { Promise: _bluebird2.default });

async function init() {
    const db = await dbPromise;
    await db.run("PRAGMA foreign_keys = ON;");
}

_nunjucks2.default.configure('views', {
    autoescape: true,
    express: app,
    noCache: true,
    watch: true
});

app.use(_bodyParser2.default.urlencoded());

async function initDb() {
    const db = await dbPromise;
    await db.run(`PRAGMA foreign_keys = ON;`);
    return db;
}

app.get('/', async (req, res, next) => {
    try {
        const db = await initDb();
        const comments = await db.all(`SELECT 
                COMMENTS.id as id,
                USERS.name AS author,
                COMMENTS.message AS message 
            FROM COMMENTS 
            INNER JOIN USERS on USERS.id = COMMENTS.user`);
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
        });
        // console.log("result", result);
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

app.enable('trust proxy');
app.listen(8000);