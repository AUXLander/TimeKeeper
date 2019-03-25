<?php
    $mysqli = mysqli_connect('localhost', 'user', '123QWEasd!', 'timekeeper');
    if (!$mysqli) {
        die('Ошибка соединения: ' . mysqli_error());
    }
    /* SETTINGS */
    $mysqli->set_charset("utf8");
    

    //$mysqli->close();
?>