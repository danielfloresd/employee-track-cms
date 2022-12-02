const request = require('supertest');
const app = require('../app');

describe('app', () => {
    describe("Initializations", () => {
        it("should initialize the app", () => {
            expect(app).toBeDefined();
        });
    });

    describe("GET /", () => {
        it("should return a 200 response", () => {
            return request(app).get("/").expect(200);
        });
    });

    describe("GET /api/employees", () => {
        it("should return a 200 response", () => {
            return request(app).get("/api/employees").expect(200);
        });
    });

    describe("GET /api/roles", () => {
        it("should return a 200 response", () => {
            return request(app).get("/api/roles").expect(200);
        });
    });

    describe("GET /api/departments", () => {
        it("should return a 200 response", () => {
            return request(app).get("/api/departments").expect(200);
        });
    });

    describe("POST /api/employees", () => {
        // Create mock post response
        const mockPost = {
            first_name: "John",
            last_name: "Doe",
            role_id: 1,
            manager_id: 1
        };
        // Test post route
        





        it("should return a 200 response", () => {
            return request(app).post("/api/employees").expect(200);
        });
    });

    describe("POST /api/roles", () => {
        it("should return a 200 response", () => {
            return request(app).post("/api/roles").expect(200);
        });
    });

    describe("POST /api/departments", () => {
        it("should return a 200 response", () => {
            return request(app).post("/api/departments").expect(200);
        });
    }
    );

    describe("PUT /api/employees/:id", () => {
        it("should return a 200 response", () => {
            return request(app).put("/api/employees/1").expect(200);
        });
    }
    );

    describe("PUT /api/roles/:id", () => {
        it("should return a 200 response", () => {
            return request(app).put("/api/roles/1").expect(200);
        });
    }   
    );

    describe("PUT /api/departments/:id", () => {
        it("should return a 200 response", () => {
            return request(app).put("/api/departments/1").expect(200);
        });
    }
    );

    describe("DELETE /api/employees/:id", () => {
        it("should return a 200 response", () => {
            return request(app).delete("/api/employees/1").expect(200);
        });
    }
    );

    describe("DELETE /api/roles/:id", () => {
        it("should return a 200 response", () => {
            return request(app).delete("/api/roles/1").expect(200);
        });
    }
    );

    describe("DELETE /api/departments/:id", () => {
        it("should return a 200 response", () => {
            return request(app).delete("/api/departments/1").expect(200);
        });
    }
    );


});