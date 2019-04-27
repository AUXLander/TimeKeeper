<?php
    //http://localhost/php/auth.php?e=auxlander.1000@gmail.com&p=wb8q3wi552
    session_start();
    include '../php.sys/safemysql.class.php';
    include '../php.sys/conn.data.php';

    $db = new safemysql(SQLDATACONNECT);
    //dauxlander_timek
    //rTBxGYJe
    include 'auth_core.php';