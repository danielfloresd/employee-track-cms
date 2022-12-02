var Department = require('../lib/Department');

describe('Department', () => {
    it('should create object with name', () => {
        const department = new Department(1, 'Department');
        expect(department.id).toBe(1);
        expect(department.name).toBe('Department');
    });
});
