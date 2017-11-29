import express from 'express';
import UserDB from '../data/user';
import bcrypt from 'bcrypt';
import { read } from 'fs';

function UserRouter(passport) {
    const db = new UserDB;
    const router = express.Router();
    router.get('/',
        async (req, res) => {
            console.log("getting user", req.user);
            res.send(req.user);
        })

    router.get('/login', async (req, res) => {
        console.log("login");
        // res.send("foo");
        res.render("login.njk");
    });
    router.post('/login',
        passport.authenticate('local', {
            successRedirect: '/user',
            failureRedirect: '/user/login',
            failureFlash: false
        })
    );
    router.get('/new', async (req, res) => {
        res.render("register.njk");
    });
    router.post('/new', async (req, res) => {
        console.log("post new", req.body)
        bcrypt.hash(req.body.password, 10).then((password) => {
            console.log("hashed new password", password)
            db.register({
                name: req.body.name,
                email: req.body.email,
                password: password
            }).then((result) => {
                console.log(result);
                res.redirect("/user/login")
            });
        });

    });


    router.get('/:id', async (req, res) => {
        // const db = new UserDB();
        // const user = await db.findById(req.params.id);
        // res.send(user);
        // res.send("foo");
        res.send("bar")
    })
    return router;
}
module.exports = UserRouter;