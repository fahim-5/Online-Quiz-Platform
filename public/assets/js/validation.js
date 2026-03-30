document.addEventListener("DOMContentLoaded", function () {
  // Create Quiz validation
  const createForm = document.getElementById("createQuizForm");
  if (createForm) {
    createForm.addEventListener("submit", function (e) {
      clearErrors(createForm);
      let valid = true;
      const title = createForm.querySelector('input[name="title"]');
      if (!title.value || title.value.trim().length < 3) {
        showError(title, "Title is required (min 3 chars)");
        valid = false;
      }
      const time = createForm.querySelector('input[name="time_limit"]');
      if (
        time &&
        (!time.value || isNaN(time.value) || Number(time.value) < 1)
      ) {
        showError(time, "Enter a valid time limit in minutes");
        valid = false;
      }
      if (!valid) e.preventDefault();
    });
  }

  // Take Quiz validation
  const takeForm = document.getElementById("takeQuizForm");
  if (takeForm) {
    takeForm.addEventListener("submit", function (e) {
      clearErrors(takeForm);
      let allAnswered = true;
      const questions = takeForm.querySelectorAll(".question");
      questions.forEach((q) => {
        const name = q.getAttribute("data-name");
        const checked = takeForm.querySelector(
          'input[name="' + name + '"]:checked',
        );
        if (!checked) {
          showError(q, "Please answer this question");
          allAnswered = false;
        }
      });
      if (!allAnswered) e.preventDefault();
    });
  }

  // Register validation (name, id, role)
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      clearErrors(registerForm);
      let valid = true;
      const name = registerForm.querySelector('input[name="name"]');
      const userId = registerForm.querySelector('input[name="user_id"]');
      const roleChecked = registerForm.querySelector(
        'input[name="role"]:checked',
      );
      if (!name || !name.value || !name.value.trim()) {
        showError(name, "Name is required");
        valid = false;
      }
      if (!userId || !userId.value || !userId.value.trim()) {
        showError(userId, "ID is required");
        valid = false;
      }
      if (!roleChecked) {
        const roleGroup =
          registerForm.querySelector(".role-group") || registerForm;
        showError(roleGroup, "Select a role (teacher or student)");
        valid = false;
      }
      // password checks
      const password = registerForm.querySelector('input[name="password"]');
      const passwordConfirm = registerForm.querySelector(
        'input[name="password_confirm"]',
      );
      if (!password || !password.value || password.value.length < 6) {
        showError(password || registerForm, "Password required (min 6 chars)");
        valid = false;
      }
      if (
        password &&
        passwordConfirm &&
        password.value !== passwordConfirm.value
      ) {
        showError(passwordConfirm, "Passwords do not match");
        valid = false;
      }
      if (!valid) e.preventDefault();
    });
  }

  // Login validation (id + password)
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      clearErrors(loginForm);
      let valid = true;
      const userId = loginForm.querySelector('input[name="user_id"]');
      const password = loginForm.querySelector('input[name="password"]');
      if (!userId || !userId.value || !userId.value.trim()) {
        showError(userId, "ID is required");
        valid = false;
      }
      if (!password || !password.value) {
        showError(password, "Password is required");
        valid = false;
      }
      if (!valid) e.preventDefault();
    });
  }

  function showError(el, msg) {
    let target = el.closest(".field") || el;
    let span = document.createElement("div");
    span.className = "error-msg";
    span.textContent = msg;
    span.style.display = "block";
    target.parentNode.appendChild(span);
  }
  function clearErrors(form) {
    form.querySelectorAll(".error-msg").forEach((e) => e.remove());
  }
});
