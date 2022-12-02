var Role = require('../lib/Role');

describe('Role', () => {
    it('should create object with title, salary, department', () => {
        const role = new Role(1, 'Manager', 100000, 'Department');
        expect(role.id).toBe(1);
        expect(role.title).toBe('Manager');
        expect(role.salary).toBe(100000);
        expect(role.department).toBe('Department');
    });
});
