<?php
// Basic session/auth middleware placeholder
session_start();

function is_logged_in()
{
    return !empty($_SESSION['user_id']);
}
