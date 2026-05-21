import { authService } from '../services/authService.js';

export class AdminLoginController {
  constructor() {
    // Initialización movida a init() para asegurar que el DOM esté listo
  }

  init() {
    this.form = document.getElementById('admin-login-form');
    this.usernameInput = document.getElementById('admin-username');
    this.passwordInput = document.getElementById('admin-password');
    this.errorDiv = document.getElementById('login-error');
    this.cancelBtn = document.getElementById('cancel-login-btn');
    this.togglePasswordBtn = document.getElementById('toggle-password');

    this.form?.addEventListener('submit', e => this.handleLogin(e));
    this.cancelBtn?.addEventListener('click', () => window.location.hash = '#/home');
    
    if (this.togglePasswordBtn) {
      this.togglePasswordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.togglePasswordVisibility();
      });
    }
  }

  togglePasswordVisibility() {
    if (!this.passwordInput || !this.togglePasswordBtn) return;
    
    const isPassword = this.passwordInput.type === 'password';
    this.passwordInput.type = isPassword ? 'text' : 'password';
    this.togglePasswordBtn.textContent = isPassword ? '🙈' : '👁️';
  }

  async handleLogin(e) {
    e.preventDefault();

    const username = this.usernameInput?.value || '';
    const password = this.passwordInput?.value || '';

    try {
      authService.login(username, password);
      window.location.hash = '#/admin';
    } catch (error) {
      if (this.errorDiv) {
        this.errorDiv.textContent = error.message;
        this.errorDiv.classList.remove('d-none');
      }
      if (this.passwordInput) this.passwordInput.value = '';
    }
  }
}

let adminLoginController;
export function getAdminLoginController() {
  if (!adminLoginController) {
    adminLoginController = new AdminLoginController();
  }
  return adminLoginController;
}
