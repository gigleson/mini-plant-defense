const API_URL = "http://localhost:3000/api/auth";
export class AuthSystem {
    constructor() {
        this.token = sessionStorage.getItem("authToken");
        this.user = null;
    }
    async register(username, password) {
        return this.authenticate("/register", username, password);
    }
    async login(username, password) {
        return this.authenticate("/login", username, password);
    }
    async authenticate(endpoint, username, password) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Authentication failed.");
        }
        this.token = result.token;
        this.user = result.user;
        sessionStorage.setItem("authToken", result.token);
        return result;
    }
    getToken() {
        return this.token;
    }
    getUser() {
        return this.user;
    }
    logout() {
        this.token = null;
        this.user = null;
        sessionStorage.removeItem("authToken");
    }
}
