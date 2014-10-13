var express       = require('express');
var app           = express();
var server        = require('http').createServer(app);
var path          = require('path');
var session       = require('express-session')({
                        secret: process.env.SESSION_SECRET || 'secret',
                        resave: false,
                        saveUninitialized: false
                    });
var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser')();
var passport      = require('passport');
var flash         = require('connect-flash')();
var mongoose      = require('mongoose');
var configDB      = require('../config/site.json').database.url;
var engine        = require('ejs-locals');

//configure app
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', '../views');

mongoose.connect(configDB);
require('../config/passport.js')(passport);

//use middleware
app.use(express.static(path.join('../components')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser);
app.use(session);
app.use(flash);

app.use(passport.initialize());
app.use(passport.session());

//setup helper functions for ejs
require('../install/install.js')(app);
require('../server/helpers.js')(app);

//define api web services
require('../server/api/shelby.js')(app);
require('../server/api/blog.js')(app);

//define routes
require('../server/customroutes.js')(app);
require('../server/routes.js')(app, passport);

//start server
var port = process.env.PORT || 80;
server.listen(port, function () {
   console.log('The magic happens on port ' + port);
});