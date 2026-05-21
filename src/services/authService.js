class AuthService {
  constructor() {
    this.storageKey = 'admin_token';
    this.userKey = 'admin_user';
    this.failedAttemptsKey = 'admin_failed_attempts';
    this.lockoutKey = 'admin_lockout_until';
  }

  generateToken(username) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        username,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 30,
      })
    );
    const signature = btoa(`${header}.${payload}`);

    return `${header}.${payload}.${signature}`;
  }

  validateCredentials(username, password) {
    let expectedUsername = import.meta.env.VITE_ADMIN_USERNAME?.trim() || '';
    let expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD?.trim() || '';

    // Remove surrounding quotes if they exist
    if (expectedUsername.startsWith('"') && expectedUsername.endsWith('"')) {
      expectedUsername = expectedUsername.slice(1, -1);
    } else if (expectedUsername.startsWith("'") && expectedUsername.endsWith("'")) {
      expectedUsername = expectedUsername.slice(1, -1);
    }

    if (expectedPassword.startsWith('"') && expectedPassword.endsWith('"')) {
      expectedPassword = expectedPassword.slice(1, -1);
    } else if (expectedPassword.startsWith("'") && expectedPassword.endsWith("'")) {
      expectedPassword = expectedPassword.slice(1, -1);
    }

    if (!expectedUsername || !expectedPassword) {
      throw new Error('El servidor no tiene configuradas las credenciales de admin (.env)');
    }

    return username.trim() === expectedUsername && password.trim() === expectedPassword;
  }

  checkLockout() {
    const lockoutUntil = localStorage.getItem(this.lockoutKey);
    if (lockoutUntil) {
      const now = Date.now();
      if (now < parseInt(lockoutUntil)) {
        const remainingMinutes = Math.ceil((parseInt(lockoutUntil) - now) / 60000);
        throw new Error(`Cuenta bloqueada. Intente de nuevo en ${remainingMinutes} minuto(s).`);
      }
      localStorage.removeItem(this.lockoutKey);
      localStorage.removeItem(this.failedAttemptsKey);
    }
  }

  login(username, password) {
    this.checkLockout();

    if (!this.validateCredentials(username, password)) {
      let attempts = parseInt(localStorage.getItem(this.failedAttemptsKey) || '0');
      attempts++;
      localStorage.setItem(this.failedAttemptsKey, attempts.toString());

      if (attempts >= 5) {
        const lockoutUntil = Date.now() + 2 * 60 * 1000;
        localStorage.setItem(this.lockoutKey, lockoutUntil.toString());
        localStorage.removeItem(this.failedAttemptsKey);
        throw new Error('Demasiados intentos fallidos. Cuenta bloqueada por 2 minutos.');
      }

      throw new Error(`Credenciales inválidas. Intentos restantes: ${5 - attempts}`);
    }

    localStorage.removeItem(this.failedAttemptsKey);
    localStorage.removeItem(this.lockoutKey);

    const token = this.generateToken(username);
    localStorage.setItem(this.storageKey, token);
    localStorage.setItem(this.userKey, username);

    return {
      token,
      username,
      expiresIn: 1800,
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
