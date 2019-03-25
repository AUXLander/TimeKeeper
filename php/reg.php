<?php
include "connect.php";
    $login  = $_GET['l'];
    $pass   = $_GET['p'];
    $name   = $_GET['n'] || '';
    $subn   = $_GET['s'] || '';

    /*
    if (!isset($_POST['username'], $_POST['password'], $_POST['email'])) {
        // Could not get the data that should have been sent.
        die ('Please complete the registration form!');
    }
    // Make sure the submitted registration values are not empty.
    if (empty($_POST['username']) || empty($_POST['password']) || empty($_POST['email'])) {
        // One or more values are empty.
        die ('Please complete the registration form');
    }

    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        die ('Email is not valid!');
    }

    if (preg_match('/[A-Za-z0-9]+/', $_POST['username']) == 0) {
        die ('Username is not valid!');
    }

    if (strlen($_POST['password']) > 20 || strlen($_POST['password']) < 5) {
        die ('Password must be between 5 and 20 characters long!');
    }
    */

    $sql = 'INSERT INTO `user_data`(login, pass, name, subname) VALUES("'.$login .'","'.$pass.'","'.$name.'","'.$subn.'")';

    if (!($result = $mysqli->query($sql))) {
        die('Ошибка регистрации: ' . $mysqli->error);
    }

$mysqli->close();
?>