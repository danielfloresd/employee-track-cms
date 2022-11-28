const express = require('express');
const app = express();
// Import path package
const path = require('path');

const employees = require('./routes/employees');
const departments = require('./routes/departments');
const roles = require('./routes/roles');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/api/employees', employees);
app.use('/api/departments', departments);
app.use('/api/roles', roles);

// GET route for notes.html
app.get('/employees', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/employees.html'));
});

// GET route for index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// GET route to database url
app.get('/api/database_url', (req, res) => {
    res.json(process.env.DATABASE_URL || "mysql://root:mysql@localhost/employee_track_cms");
});



module.exports = app;