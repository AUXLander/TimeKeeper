<?php
    //http://localhost/php/reg.php?l=admin&p=wb8q3wi552&n=Denis&s=Nikolaev&e=auxlander.1000@gmail.com
    //http://dauxlander.beget.tech/php/auth/reg.php?l=test123&p=password123&n=test&s=test&e=test@mail.ru
    if(!isset($_GET['l'])){
        die('-1');//Не передан логин
    }
    if (preg_match('/[A-Za-z0-9]+/', $_GET['l']) == 0) {
        die ('-1.0');//Содержит знаки
    }
    if (strlen($_GET['l']) > 20 || strlen($_GET['l']) < 5) {
        die ('-1.1');
    }
    if(!isset($_GET['p'])){
        die('-2');//Не передан пароль
    }
    if (strlen($_GET['p']) > 20 || strlen($_GET['p']) < 5) {
        die ('-2.0');//Некорректная длина пароля
    }
    if(!isset($_GET['n'])){
        //die("-3");//Не указано имя
    }
    if(!isset($_GET['s'])){
        //die("-4");//Не указана фамилия
    }
    if(!isset($_GET['e'])){
        die('-5');//Не указано мыло
    }
    if (!filter_var($_GET['e'], FILTER_VALIDATE_EMAIL)) {
        die ('-5.0');// Некорректное мыло
    }

    include '../php.sys/safemysql.class.php';
    include '../php.sys/conn.data.php';
    
    $db = new safemysql(SQLDATACONNECT);
    $login = $_GET['l'];
    $pass = $_GET['p'];
    $name = $_GET['n'];
    $subn = $_GET['s'];
    $email = $_GET['e'];

    $sql = 'SELECT * FROM `user_data` WHERE email=?s';
    $result = $db->getRow($sql, $email);
    if($result !== NULL){
        die('-6');//Такой пользователь уже существует
    }

    $pass = password_hash($pass, PASSWORD_BCRYPT);
    $sql = 'INSERT INTO `user_data`(login, pass, name, subname, email) VALUES(?s,?s,?s,?s,?s)';

    $result = $db->query($sql, $login, $pass, $name, $subn, $email);
    if($result == true){
        echo "Successfully!";
    }
?>