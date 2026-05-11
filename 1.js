// ==================== STATE MANAGEMENT ====================
const Storage = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

const Auth = {
  getUser() {
    return Storage.get('dld_user');
  },
  isLoggedIn() {
    return !!this.getUser();
  },
  login(user) {
    Storage.set('dld_user', user);
    updateHeader();
  },
  logout() {
    Storage.remove('dld_user');
    updateHeader();
    window.location.href = 'index.html';
  },
  signup(userData) {
    const users = Storage.get('dld_users') || [];
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    Storage.set('dld_users', users);
    this.login(newUser);
    return { success: true };
  },
  validateLogin(email, password) {
    const users = Storage.get('dld_users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      this.login(user);
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  }
};

const Orders = {
  getAll() {
    return Storage.get('dld_orders') || [];
  },
  getByUser(userId) {
    return this.getAll().filter(o => o.userId === userId);
  },
  create(orderData) {
    const orders = this.getAll();
    const newOrder = {
      id: Date.now(),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    Storage.set('dld_orders', orders);
    return newOrder;
  }
};

// ==================== HEADER & FOOTER INJECTION ====================
const headerHTML = `
  <header class="site-header">
    <div class="nav-container">
      <a href="index.html" class="logo">DLD Projects</a>
      <nav>
        <ul class="nav-links">
          <li><a href="index.html" data-page="index">Home</a></li>
          <li><a href="detail.html" data-page="detail">Projects</a></li>
          <li><a href="contact.html" data-page="contact">Contact</a></li>
          <li id="auth-link"><a href="auth.html" data-page="auth">Login</a></li>
          <li id="profile-link" class="hidden"><a href="profile.html" data-page="profile">Profile</a></li>
          <li id="logout-link" class="hidden"><a href="#" onclick="Auth.logout(); return false;">Logout</a></li>
        </ul>
      </nav>
    </div>
  </header>
`;

const footerHTML = `
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>DLD Projects</h3>
        <p>Premium digital logic design projects for students and professionals.</p>
      </div>
      <div class="footer-section">
        <h3>Quick Links</h3>
        <a href="index.html">Home</a>
        <a href="detail.html">Projects</a>
        <a href="contact.html">Contact</a>
      </div>
      <div class="footer-section">
        <h3>Contact</h3>
        <a href="mailto:support@dldprojects.com">support@dldprojects.com</a>
        <a href="tel:+1234567890">+1 (234) 567-890</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 DLD Projects. All rights reserved.</p>
    </div>
  </footer>
`;

function injectLayout() {
  const body = document.body;
  const main = document.querySelector('main');

  if (!document.querySelector('.site-header')) {
    const headerDiv = document.createElement('div');
    headerDiv.innerHTML = headerHTML;
    body.insertBefore(headerDiv.firstElementChild, body.firstChild);
  }

  if (!document.querySelector('.site-footer')) {
    const footerDiv = document.createElement('div');
    footerDiv.innerHTML = footerHTML;
    body.appendChild(footerDiv.firstElementChild);
  }

  updateHeader();
  highlightCurrentPage();
}

function updateHeader() {
  const user = Auth.getUser();
  const authLink = document.getElementById('auth-link');
  const profileLink = document.getElementById('profile-link');
  const logoutLink = document.getElementById('logout-link');

  if (!authLink) return;

  if (user) {
    authLink.classList.add('hidden');
    profileLink.classList.remove('hidden');
    logoutLink.classList.remove('hidden');
  } else {
    authLink.classList.remove('hidden');
    profileLink.classList.add('hidden');
    logoutLink.classList.add('hidden');
  }
}

function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// ==================== VALIDATION ====================
const Validators = {
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
  required(value) {
    return value.trim().length > 0;
  },
  minLength(value, len) {
    return value.trim().length >= len;
  },
  phone(value) {
    return /^[\d\s\-\+\(\)]{10,}$/.test(value);
  }
};

function showError(input, message) {
  const group = input.closest('.form-group');
  group.classList.add('error');
  const errorEl = group.querySelector('.error-message');
  if (errorEl) errorEl.textContent = message;
}

function clearError(input) {
  const group = input.closest('.form-group');
  group.classList.remove('error');
}

function clearAllErrors(form) {
  form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
}

function showAlert(message, type = 'success') {
  const alert = document.querySelector('.alert');
  if (!alert) return;
  alert.className = `alert alert-${type} show`;
  alert.innerHTML = `<span>${message}</span>`;
  setTimeout(() => alert.classList.remove('show'), 5000);
}

// ==================== PAGE INITIALIZERS ====================
const Pages = {
  init() {
    injectLayout();
    const page = document.body.dataset.page;
    if (page && this[page]) this[page]();
  },

  index() {
    const ctaBtn = document.getElementById('cta-signup');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        if (Auth.isLoggedIn()) {
          window.location.href = 'order.html';
        } else {
          window.location.href = 'auth.html#signup';
        }
      });
    }
  },

  auth() {
    const hash = window.location.hash;
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');

    function showForm(type) {
      if (type === 'signup') {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
      } else {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
      }
    }

    loginTab.addEventListener('click', () => showForm('login'));
    signupTab.addEventListener('click', () => showForm('signup'));

    if (hash === '#signup') showForm('signup');
    else showForm('login');

    // Signup
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllErrors(signupForm);

      const name = document.getElementById('signup-name');
      const email = document.getElementById('signup-email');
      const password = document.getElementById('signup-password');
      const confirm = document.getElementById('signup-confirm');
      let valid = true;

      if (!Validators.required(name.value)) {
        showError(name, 'Full name is required');
        valid = false;
      }

      if (!Validators.email(email.value)) {
        showError(email, 'Please enter a valid email');
        valid = false;
      }

      if (!Validators.minLength(password.value, 6)) {
        showError(password, 'Password must be at least 6 characters');
        valid = false;
      }

      if (password.value !== confirm.value) {
        showError(confirm, 'Passwords do not match');
        valid = false;
      }

      if (!valid) return;

      const result = Auth.signup({
        name: name.value.trim(),
        email: email.value.trim(),
        password: password.value
      });

      if (result.success) {
        showAlert('Account created successfully! Redirecting...');
        setTimeout(() => window.location.href = 'profile.html', 1000);
      } else {
        showAlert(result.message, 'error');
      }
    });

    // Login
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllErrors(loginForm);

      const email = document.getElementById('login-email');
      const password = document.getElementById('login-password');
      let valid = true;

      if (!Validators.email(email.value)) {
        showError(email, 'Please enter a valid email');
        valid = false;
      }

      if (!Validators.required(password.value)) {
        showError(password, 'Password is required');
        valid = false;
      }

      if (!valid) return;

      const result = Auth.validateLogin(email.value.trim(), password.value);

      if (result.success) {
        showAlert('Welcome back! Redirecting...');
        setTimeout(() => window.location.href = 'profile.html', 1000);
      } else {
        showAlert(result.message, 'error');
      }
    });
  },

  profile() {
    if (!Auth.isLoggedIn()) {
      window.location.href = 'auth.html';
      return;
    }

    const user = Auth.getUser();
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-avatar').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('profile-date').textContent = new Date(user.createdAt).toLocaleDateString();

    const ordersList = document.getElementById('orders-list');
    const orders = Orders.getByUser(user.id);

    if (orders.length === 0) {
      ordersList.innerHTML = `
        <div class="empty-state">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
          <h3>No orders yet</h3>
          <p>You haven't ordered any projects yet.</p>
          <a href="detail.html" class="btn btn-primary mt-2">Browse Projects</a>
        </div>
      `;
    } else {
      ordersList.innerHTML = orders.map(order => `
        <div class="order-item">
          <div>
            <h4>${order.projectTitle}</h4>
            <p style="color: var(--gray); font-size: 0.9rem;">Ordered on ${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <span class="order-status status-${order.status}">${order.status}</span>
        </div>
      `).join('');
    }
  },

  order() {
    if (!Auth.isLoggedIn()) {
      window.location.href = 'auth.html';
      return;
    }

    const form = document.getElementById('order-form');
    const projectSelect = document.getElementById('project-select');

    // Populate projects
    const projects = [
      { id: 1, title: '4-Bit ALU Design', price: '$49' },
      { id: 2, title: '8-Bit Microprocessor', price: '$99' },
      { id: 3, title: 'Traffic Light Controller', price: '$39' },
      { id: 4, title: 'Vending Machine FSM', price: '$59' },
      { id: 5, title: 'UART Communication Module', price: '$79' }
    ];

    projects.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.title;
      opt.textContent = `${p.title} - ${p.price}`;
      projectSelect.appendChild(opt);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllErrors(form);

      const project = document.getElementById('project-select');
      const requirements = document.getElementById('order-requirements');
      const deadline = document.getElementById('order-deadline');
      const phone = document.getElementById('order-phone');
      let valid = true;

      if (!Validators.required(project.value)) {
        showError(project, 'Please select a project');
        valid = false;
      }

      if (!Validators.required(requirements.value)) {
        showError(requirements, 'Please describe your requirements');
        valid = false;
      }

      if (!Validators.required(deadline.value)) {
        showError(deadline, 'Please select a deadline');
        valid = false;
      }

      if (!Validators.phone(phone.value)) {
        showError(phone, 'Please enter a valid phone number');
        valid = false;
      }

      if (!valid) return;

      const user = Auth.getUser();
      Orders.create({
        userId: user.id,
        projectTitle: project.value,
        requirements: requirements.value.trim(),
        deadline: deadline.value,
        phone: phone.value.trim()
      });

      showAlert('Order placed successfully! Redirecting to profile...');
      setTimeout(() => window.location.href = 'profile.html', 1500);
    });
  },

  contact() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllErrors(form);

      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const message = document.getElementById('contact-message');
      let valid = true;

      if (!Validators.required(name.value)) {
        showError(name, 'Name is required');
        valid = false;
      }

      if (!Validators.email(email.value)) {
        showError(email, 'Please enter a valid email');
        valid = false;
      }

      if (!Validators.minLength(message.value, 10)) {
        showError(message, 'Message must be at least 10 characters');
        valid = false;
      }

      if (!valid) return;

      showAlert('Message sent successfully! We will get back to you soon.');
      form.reset();
    });
  },

  detail() {
    // Project detail page is mostly static, but we could load dynamic content here
    const orderBtn = document.getElementById('detail-order-btn');
    if (orderBtn) {
      orderBtn.addEventListener('click', () => {
        if (Auth.isLoggedIn()) {
          window.location.href = 'order.html';
        } else {
          window.location.href = 'auth.html';
        }
      });
    }
  }
};

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
  Pages.init();
});




//---------------
