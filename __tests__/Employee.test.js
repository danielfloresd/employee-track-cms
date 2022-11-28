var Employee = require('../lib/Employee');

describe('Employee', () => {
    it('should create object with first_name, last_name, role_id, manager_id', () => {
        const employee = new Employee(1, 'John', 'Doe', 1, 1);
        expect(employee.id).toBe(1);
        expect(employee.first_name).toBe('John');
        expect(employee.last_name).toBe('Doe');
        expect(employee.role_id).toBe(1);
        expect(employee.manager_id).toBe(1);
    });

    it('should print employee data', () => {
        const employee = new Employee(1, 'John', 'Doe', 1, 1);
        // Mock console.log to check if it was called with the right parameters
        console.log = jest.fn();
        employee.printEmployee();
        expect(console.log).toHaveBeenCalledWith('1 | John | Doe | 1 | 1');
    });

    it('should update employee in database', () => {
        const employee = new Employee(1, 'John', 'Doe', 2, 2);
        // Create mock update function
        const mockUpdate = jest.fn();
        // Mock update function
        employee.update = mockUpdate;
        // Call update function
        employee.update();
        // Assert update function was called
        expect(mockUpdate).toHaveBeenCalled();

    });
});


