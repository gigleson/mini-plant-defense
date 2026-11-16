const API_URL = "http://localhost:3000/api/auth";

export interface AuthUser {
    id: number;
    username: string;
}

interface AuthResponse {
    message: string;
    token: string;
    user: AuthUser;
}

export class AuthSystem {
    private token: string | null =
        sessionStorage.getItem("authToken");

    private user: AuthUser | null = null;

    async register(
        username: string,
        password: string
    ): Promise<AuthResponse> {
        return this.authenticate("/register", username, password);
    }

    async login(
        username: string,
        password: string
    ): Promise<AuthResponse> {
        return this.authenticate("/login", username, password);
    }

    private async authenticate(
        endpoint: string,
        username: string,
        password: string
    ): Promise<AuthResponse> {
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

        return result as AuthResponse;
    }

    getToken(): string | null {
        return this.token;
    }

    getUser(): AuthUser | null {
        return this.user;
    }

    logout(): void {
        this.token = null;
        this.user = null;

        sessionStorage.removeItem("authToken");
    }
}