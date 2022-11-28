// Require Department class
const Department = require('../lib/Department');
// Require express
const express = require('express');
// Create router
const router = express.Router();

// Add delete route for employees
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    
    Department.deleteById(id).then((result) => {
        res.send(result);
    });
});

router.get('/', (req, res) => {
    Department.getAll().then((departments) => {
        res.send(departments);
    });
});

router.post('/', (req, res) => {
    let { name } = req.body;
    Department.create(name).then((department) => {
        res.send(department);
    });
});

router.put('/:id', (req, res) => {
    let { id, name } = req.body;
    Department.updateById(id, name).then((results) => {
        res.send(results);
    });
});

module.exports = router;