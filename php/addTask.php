<?php
include "connect.php";

    $sql = 'INSERT INTO 
        `task_data`(userID, noteID, date/* add optional */, name, description, time_s, time_d, time_r)
        VALUES('.$userID.',' .$noteID.',' .$date.',' .$desc.',' .$t_s.',' .$t_d.',' .$t_r.')';

    if (!($result = $mysqli->query($sql))) {
        die('Ошибка запроса: ' . $mysqli->error);
    }




$mysqli->close();
?>