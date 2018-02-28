const app = require('express')();
let config = require('./config/env-config');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');


const connectToDb=require('./helper/dbModules');
connectToDb();

require('./config/passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(session({
    secret: 'thisissecret',
    resave: true,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

let loadRoutes=require('./helper/routes');
loadRoutes(app);

app.listen(config.port, () => {
    console.log(`app is running at port ${config.port}`);
});


