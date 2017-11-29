import PassportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import UserDB from '../data/user';
var LocalStrategy = PassportLocal.Strategy;


function PPConfig(passport) {
    const db = new UserDB;
    passport.use(new LocalStrategy({
        usernameField: 'email'
    },
        function (username, password, done) {
            console.log("local strategy")
            db.findByEmail(username)
                .then((user) => {
                    if (!user) {
                        console.log("user not found");
                        return done(null, false, { message: "User not found" })
                    }
                    return user;
                }).then((user) => {
                    bcrypt.compare(password, user.password)
                        .then((result) => {
                            if (!result) {
                                console.log("incorrect password")
                                return done(null, false, { message: "Incorrect password" });
                            }
                            console.log("success")
                            return done(null, { id: user.id, name: user.name, email: user.email });
                        })
                })
                .catch((err) => done(err));
        }
    ));
    passport.serializeUser(function (user, done) {
        console.log("serializing user")
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        console.log("deserializing user")
        db.findById(id)
            .then((user) => {
                done(null, { id: user.id, name: user.name, email: user.email });
            }).catch((err) => {
                done(err, null);
            });
    });
}

module.exports = PPConfig;