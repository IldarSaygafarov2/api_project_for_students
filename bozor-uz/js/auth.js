/* =========================================================
   Auth pages logic.
   ---------------------------------------------------------
   Google sign-in note: in production, replace handleGoogleClick()
   with Google Identity Services:
     <script src="https://accounts.google.com/gsi/client" async></script>
     google.accounts.id.initialize({ client_id: YOUR_CLIENT_ID, callback: onGoogleCredential });
     function onGoogleCredential(resp){
       fetch(`${API_BASE}/auth/google/`, { method:'POST', body: JSON.stringify({ id_token: resp.credential })})
         .then(r=>r.json()).then(data => { ... store session, redirect ... });
     }
   That requires a real Google Cloud OAuth Client ID, which is why this
   demo simulates the resulting session instead of loading the real SDK.

   The Google button label, role icons, and the region <select> options
   on register.html are baked directly into the markup now — this file
   only handles form submission and the (session-specific) redirect.
   ========================================================= */

function redirectAfterAuth(){
  const next = qsGet('next');
  window.location.href = next || 'account-dashboard.html';
}

async function handleGoogleClick(btn){
  btn.disabled = true;
  btn.textContent = 'Подключение к Google…';
  const { ok } = await apiLoginWithGoogle();
  if (ok){ toast('Вход выполнен через Google'); redirectAfterAuth(); }
}

function initLoginPage(){
  document.getElementById('googleLoginBtn').addEventListener('click', (e) => handleGoogleClick(e.currentTarget));

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    let hasError = false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      document.getElementById('emailError').textContent = 'Введите корректный email';
      hasError = true;
    }
    if (password.length < 6){
      document.getElementById('passwordError').textContent = 'Пароль должен быть не короче 6 символов';
      hasError = true;
    }
    if (hasError) return;

    const submitBtn = e.target.querySelector('button[type=submit]');
    submitBtn.disabled = true; submitBtn.textContent = 'Входим…';
    const { ok, error } = await apiLogin(email, password);
    if (ok){ toast('Добро пожаловать!'); redirectAfterAuth(); }
    else { submitBtn.disabled = false; submitBtn.textContent = 'Войти'; document.getElementById('passwordError').textContent = error; }
  });
}

function initRegisterPage(){
  document.getElementById('googleLoginBtn').addEventListener('click', (e) => handleGoogleClick(e.currentTarget));

  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()){ form.reportValidity(); return; }

    const data = {
      role: form.role.value,
      name: form.name.value.trim(),
      phone: '+998' + form.phone.value.trim(),
      regionId: form.regionId.value,
      email: form.email.value.trim(),
      password: form.password.value,
    };
    const submitBtn = form.querySelector('button[type=submit]');
    submitBtn.disabled = true; submitBtn.textContent = 'Создаём аккаунт…';
    const { ok } = await apiRegister(data);
    if (ok){
      setCurrentRegionId(data.regionId);
      toast('Аккаунт создан!');
      redirectAfterAuth();
    }
  });
}
