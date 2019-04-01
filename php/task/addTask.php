<?php
    require('../auth/auth.php');

    $ltID = 0;
    $projectID = 0;
    $typeID = 0;
    $noteID = 0;
    $date = date('Y-m-d');
    $name = 'Без названия';
    $desc = 'Без описания';
    $t_s = 0;
    $t_d = 0;
    $t_r = 0;

    if(isset($_POST['localTaskID']))    $ltID = $_POST['localTaskID'];
    if(isset($_POST['projectID']))      $projectID = $_POST['projectID']; 
    if(isset($_POST['typeID']))         $typeID = $_POST['typeID'];
    if(isset($_POST['noteID']))         $noteID = $_POST['noteID'];
    if(isset($_POST['date']))           $date = $_POST['date'];
    if(isset($_POST['name']))           $name = $_POST['name'];
    if(isset($_POST['desc']))           $desc = $_POST['desc'];
    if(isset($_POST['time_s']))         $t_s = $_POST['time_s'];
    if(isset($_POST['time_d']))         $t_d = $_POST['time_d'];
    if(isset($_POST['time_r']))         $t_r = $_POST['time_r'];

    $sql = 'INSERT INTO `task_data`(userID, localTaskID, noteID, date, name, description, time_s, time_d, time_r) VALUES(?s, ?s, ?s, ?s, ?s, ?s, ?s, ?s, ?s)';
    $result = $db->query($sql, $_SESSION['userID'], $ltID, $noteID, $date, $name, $desc, $t_s, $t_d, $t_r);

    if (!($result)) {
        die('Ошибка запроса: ' . $db->error);
    }
    else {
        $sql = 
            'SELECT taskID, projectID, typeID, DATE(date) as date, name, description, noteID, time_s, time_d, time_r
                FROM `task_data`
                    JOIN note_data      USING(userID, noteID)
                    JOIN project_data   USING(userID, projectID)
                    JOIN type_data      USING(userID, typeID)
                WHERE userID=?s AND taskID=?s';

        $result = $db->getAll($sql, $_SESSION['userID'], $db->insertId());

        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }

?>