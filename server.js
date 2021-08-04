const express = require('express');
const bcrypt = require('bcrypt')
const session = require('express-session');
const cors = require('cors');
const db = require('knex')({
    client: 'pg',
    connection: {
      // host : '127.0.0.1',
      // user : 'postgres',
      // password : 'ZTM',
      // database : 'planner'
      connectionString: process.env.DATABASE_URL,
      ssl: true
    }
  });

const additem = require('./controllers/additem.js');
const loaditems = require('./controllers/loaditems.js');
const deleteitem = require('./controllers/deleteitem.js');
const transferitem = require('./controllers/transferitem.js');
const edititem = require('./controllers/edititem.js');
const reorderitems = require('./controllers/reorderitems.js');
const reorderallitems = require('./controllers/reorderallitems.js');
const signin = require('./controllers/signin.js');
const register = require('./controllers/register.js');
const loadcalendaritems = require('./controllers/loadcalendaritems.js');
const loadcalendaritem = require('./controllers/loadcalendaritem.js');
const profile = require('./controllers/profile.js');
const signout = require('./controllers/signout.js');
const scheduleitem = require('./controllers/scheduleitem.js');
const updatecalendaritem = require('./controllers/updatecalendaritem.js');
const transfercalendaritem = require('./controllers/transfercalendaritem.js');
const deletecalendaritem = require('./controllers/deletecalendaritem.js');
const syncfromgcal = require('./controllers/syncfromgcal.js');
const signincalendar = require('./controllers/signincalendar.js');
const savetogcal = require('./controllers/savetogcal.js');

const app = express();
app.use(express.json());
app.use(cors({
  origin : 'http://localhost:3001', 
  credentials: true
}));
app.use(session({
  secret: "secret",
  saveUninitialized: false,
  resave: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    maxAge: 86400000
  }
})
);

app.get('/', (req, res) => {
  console.log("process.env: ", process.env);
})

app.post('/loaditems', (req, res) => loaditems.handleLoaditems(req, res, db));

app.delete('/deleteitem', (req, res) => deleteitem.handleDeleteitem(req, res, db));

app.post('/additem', (req, res) => additem.handleAdditem(req, res, db));

app.post('/transferitem', (req, res) => transferitem.handleTransferitem(req, res, db));

app.put('/edititem', (req, res) => edititem.handleEdititem(req, res, db));

app.put('/reorderitems', (req, res) => reorderitems.handleReorderitems(req, res, db));

app.put('/reorderallitems', (req, res) => reorderallitems.handleReorderallitems(req, res, db));

app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));

app.post('/loadcalendaritems', (req, res) => loadcalendaritems.handleLoadcalendaritems(req, res, db));

app.post('/loadcalendaritem', (req, res) => loadcalendaritem.handleLoadcalendaritem(req, res, db));

app.post('/profile', (req, res) => profile.handleProfile(req, res));

app.post('/signout', (req, res) => signout.handleSignout(req, res));

app.post('/scheduleitem', (req, res) => scheduleitem.handleScheduleitem(req, res, db));

app.post('/updatecalendaritem', (req, res) => updatecalendaritem.handleUpdatecalendaritem(req, res, db));

app.post('/transfercalendaritem', (req, res) => transfercalendaritem.handleTransfercalendaritem(req, res, db));

app.post('/deletecalendaritem', (req, res) => deletecalendaritem.handleDeletecalendaritem(req, res, db));

app.post('/syncfromgcal', (req, res) => syncfromgcal.handleSyncfromgcal(req, res, db))

app.post('/signincalendar', (req, res) => signincalendar.handleSignincalendar(req, res));

app.post('/savetogcal', (req, res) => savetogcal.handleSavetogcal(req, res));

app.listen(process.env.PORT || 3000);
