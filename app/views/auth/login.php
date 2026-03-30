<!doctype html>
<div class="container">
    <div class="card">
        <h2>Login</h2>
        <form id="loginForm" method="post" action="/login">
            <div class="row">
                <div class="field">
                    <label for="user_id">ID</label>
                    <input type="text" name="user_id" id="user_id" placeholder="Your ID" required>
                </div>
                <div class="field">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="Password" required>
                </div>
            </div>
            <div style="margin-top:12px">
                <button type="submit" class="btn">Login</button>
                <a href="/register" class="btn secondary">Register</a>
            </div>
        </form>
    </div>
</div>
<link rel="stylesheet" href="/assets/css/style.css">
<script src="/assets/js/validation.js"></script>
<h2>Login</h2>
<form method="post" action="/public/login.php">
    <!-- login form -->
</form>