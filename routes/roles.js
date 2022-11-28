// Require Role class
const Role = require('../lib/Role');
// Require express
const express = require('express');
// Create router
const router = express.Router();


router.get('/', (req, res) => {
    Role.getAll().then((roles) => {
        res.send(roles);
    });
});

router.put('/:id', (req, res) => {
    let { title, salary, department } = req.body;
    Role.update(id, title, salary, department).then((results) => {
        res.send(results);
    });
});

router.post('/', (req, res) => {
    let { title, salary, department } = req.body;
    Role.create(title, salary, department).then((role) => {
        res.send(role);
    });
});

router.delete('/:id', (req, res) => {
    let id = req.params.id;
    Role.deleteById(id).then((result) => {
        res.send(result);
    });
});

module.exports = router;
