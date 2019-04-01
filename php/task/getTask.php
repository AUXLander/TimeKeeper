<?php
    require('../auth/auth.php');

    $taskDate = date('Y-m-d');
    
    if(isset($_GET['date'])){
        $taskDate = $_GET['date'];
    }
    
    $sql =
        'SELECT taskID, projectID, typeID, DATE(date) as date, name, description, noteID, time_s, time_d, time_r
            FROM task_data 
                JOIN note_data      USING(userID, noteID)
                JOIN project_data   USING(userID, projectID)
                JOIN type_data      USING(userID, typeID)
            WHERE userID=?s AND DATE(date) = ?s';

    $result = $db->getAll($sql, $_SESSION['userID'], $taskDate);

    if (!$result) {
        die('NULL');
    }
    else{
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }
?>