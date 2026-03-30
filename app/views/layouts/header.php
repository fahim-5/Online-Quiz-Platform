<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>
        <?= isset($pageTitle) ? htmlspecialchars($pageTitle) . ' - Online Quiz' : 'Online Quiz Platform' ?>
    </title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>

<body>
    <header style="background:transparent;padding:14px 0">
        <div class="container" style="display:flex;align-items:center;justify-content:space-between;gap:12px">
            <a href="/" style="display:flex;align-items:center;text-decoration:none;color:var(--accent)">
                <img src="/assets/images/logo.png" alt="Logo" style="height:36px;margin-right:10px;object-fit:contain">
                <strong style="font-size:18px">Online Quiz</strong>
            </a>
            <nav>
                <?php if (!empty($_SESSION['user'])): ?>
                    <span style="margin-right:12px;color:#374151">Hello,
                        <?= htmlspecialchars($_SESSION['user']['name']) ?>
                    </span>
                    <a href="/dashboard" style="margin-right:8px;color:var(--accent);text-decoration:none">Dashboard</a>
                    <a href="/logout" style="color:#ef4444;text-decoration:none">Logout</a>
                <?php else: ?>
                    <a href="/login" style="margin-right:12px;color:var(--accent);text-decoration:none">Login</a>
                    <a href="/register" style="color:var(--accent);text-decoration:none">Register</a>
                <?php endif; ?>
            </nav>
        </div>
    </header>