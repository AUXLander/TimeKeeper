<?php
    //http://localhost/php/auth.php?e=auxlander.1000@gmail.com&p=wb8q3wi552
    session_start();
    include '../php.sys/safemysql.class.php';
    $db = new safemysql(['db' => 'timekeeper']);
    include 'auth_core.php';