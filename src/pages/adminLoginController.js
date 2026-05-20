import { authService } from '../services/authService.js';

export class AdminLoginController {
  constructor() {
    this.init();
  }

  init() {
    this.form = document.getElementById('admin-login-form');
    this.usernameInput = document.getElementById('admin-username');
    this.passwordInput = document.getElementById('admin-password');
    this.errorDiv = document.getElementById('login-error');
    this.cancelBtn = document.getElementById('cancel-login-btn');

    this.form?.addEventListener('submit', e => this.handleLogin(e));
    this.cancelBtn?.addEventListener('click', () => window.location.hash = '#/home');
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
