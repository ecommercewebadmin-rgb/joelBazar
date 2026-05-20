class AuthService {
  constructor() {
    this.storageKey = 'admin_token';
    this.userKey = 'admin_user';
  }

  // Generar JWT simple (sin librerías)
  generateToken(username) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        username,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600 * 2, // 2 horas
      })
    );
    const signature = btoa(`${header}.${payload}`); // Simulado

    return `${header}.${payload}.${signature}`;
  }

  // Validar credenciales
  validateCredentials(username, password) {
    const expectedUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    return username === expectedUsername && password === expectedPassword;
  }

  // Login
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
      expiresIn: 7200, // 2 horas en segundos
    };
  }

  // Logout
  logout() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.userKey);
  }

  // Obtener token actual
  getToken() {
    return localStorage.getItem(this.storageKey);
  }

  // Verificar si está autenticado
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

  // Obtener usuario actual
  getCurrentUser() {
    return localStorage.getItem(this.userKey);
  }
}

export const authService = new AuthService();
