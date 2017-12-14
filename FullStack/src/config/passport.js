import PassportLocal from 'passport-local';
import UserDB from '../data/user';
var LocalStrategy = PassportLocal.Strategy;


function PPConfig(passport) {
    const db = UserDB;
    passport.use(new LocalStrategy(
        {
            usernameField: 'email'
        },
        async function (username, password, done) {
            try {
                var user = await db.findByEmail(username);
                if (!user) {
                    console.log("User not found", username);
                    done(null, false, { message: "User not found" });
                }
                if (await db.isValidPassword(user, password)) {
                    console.log("success! User logged in", user);
                    done(null, { id: user.id, name: user.name, email: user.email });
                } else {
                    done(null, false, { message: "incorrect password" });
                }
            } catch (err) {
                done(err);
            }

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