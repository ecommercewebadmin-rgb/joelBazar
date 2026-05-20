class AuthService {
  constructor() {
    this.storageKey = 'admin_token';
    this.userKey = 'admin_user';
  }

  generateToken(username) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        username,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600 * 2,
      })
    );
    const signature = btoa(`${header}.${payload}`);

    return `${header}.${payload}.${signature}`;
  }

  validateCredentials(username, password) {
    const expectedUsername = import.meta.env.VITE_ADMIN_USERNAME?.trim();
    const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD?.trim();

    if (!expectedUsername || !expectedPassword) {
      throw new Error('El servidor no tiene configuradas las credenciales de admin (.env)');
    }

    return username.trim() === expectedUsername && password.trim() === expectedPassword;
  }



  login(username, password) {
    if (!this.validateCredentials(username, password)) {
      throw new Error('Credenciales inválidas');
    }

    const token = this.generateToken(username);
    localStorage.setItem(this.storageKey, token);
    localStorage.setItem(this.userKey, username);

    return {
      token,
      username,
      expiresIn: 7200,
    };
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.userKey);
  }

  getToken() {
    return localStorage.getItem(this.storageKey);
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);

      return payload.exp > now;
    } catch {
      return false;
    }
  }

  getCurrentUser() {
    return localStorage.getItem(this.userKey);
  }
}

export const authService = new AuthService();
