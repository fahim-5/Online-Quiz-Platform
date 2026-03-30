<!doctype html>
<div class="container">
    <div class="card">
        <h2>Register</h2>
        <form id="registerForm" method="post" action="/register">
            <div class="row">
                <div class="field">
                    <label for="name">Full Name</label>
                    <input type="text" name="name" id="name" placeholder="Your full name" required>
                </div>
                <div class="field">
                    <label for="user_id">ID</label>
                    <input type="text" name="user_id" id="user_id" placeholder="Student/Teacher ID" required>
                </div>
            </div>
            <div class="row">
                <div class="field">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="Choose a password" required>
                </div>
                <div class="field">
                    <label for="password_confirm">Confirm Password</label>
                    <input type="password" name="password_confirm" id="password_confirm" placeholder="Repeat password"
                        required>
                </div>
            </div>
            <div class="row">
                <div class="field role-group">
                    <label>Role</label>
                    <div><label><input type="radio" name="role" value="student" checked> Student</label></div>
                    <div><label><input type="radio" name="role" value="teacher"> Teacher</label></div>
                </div>
            </div>
            <div style="margin-top:12px">
                <button type="submit" class="btn">Register</button>
                <a href="/login" class="btn secondary">Back to login</a>
            </div>
        </form>
    </div>
</div>
<link rel="stylesheet" href="/assets/css/style.css">
<script src="/assets/js/validation.js"></script>