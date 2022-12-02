var Employee = require('../lib/Employee');

describe('Employee', () => {
    it('should create object with first_name, last_name, role, manager', () => {
        const employee = new Employee(1, 'John', 'Doe','Title','Manager',10000,'Department');
        expect(employee.id).toBe(1);
        expect(employee.first_name).toBe('John');
        expect(employee.last_name).toBe('Doe');
        expect(employee.title).toBe('Title');
        expect(employee.manager).toBe('Manager');
        expect(employee.department).toBe('Department');
        expect(employee.salary).toBe(10000);
    });
  
    });



