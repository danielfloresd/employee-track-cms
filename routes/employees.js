// require express package
const express = require('express');
const Employee = require('../lib/Employee');

// Create router
const router = express.Router();

router.get('/', (req, res) => {
    Employee.getAll().then((employees) => {
        res.send(employees);
    });
});

// Add a new employee
router.post('/', (req, res) => {
    // Deconstruct the request body
    let { first_name, last_name, role_id, manager_id } = req.body;
    
    Employee.create(first_name, last_name, role_id, manager_id).then((employee) => {
        res.send(employee);
    }
    );
});

// Edit an employee
router.put('/:id', (req, res) => {
    // Deconstruct the request body
    let { id, first_name, last_name, manager, title } = req.body;
   
    Employee.updateById(id, first_name, last_name, title, manager).then((results) => {
        res.send(results);
    });
});

// Add delete route for employees
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    Employee.deleteById(id).then((result) => {
        res.send(result);
    });
});


module.exports = router;