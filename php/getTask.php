<?php
include "connect.php";

    /* Get row */
    $userID = 0;
    $taskDate = '0000-00-00';

    if($_GET['date']){
        $taskDate = $_GET['date'];
    }

    $sql = 'SELECT * FROM `task_data` WHERE userID = '.$userID .' AND date = "'.$taskDate.'"';
    //echo $sql .'<br>';

    if (!($result = $mysqli->query($sql))) {
        die('Ошибка запроса: ' . $mysqli->error);
    }
    else{
        $userData = array();
        while ($row = $result->fetch_assoc()) {
            $objectRow = (object) array(
                $row['taskDate'] => array( 
                    (object) array(
                        'taskName' 		=>	$row['taskName'],
                        'taskProject' 	=>	$row['taskProject'],
                        'taskType' 		=>	$row['taskType'],
                        'taskNote' 		=>	$row['taskNote'],
                        'taskStart'		=>	$row['taskStart'],
                        'taskDuration' 	=>	$row['taskDuration']
                    )
                )
            ); 
            array_push($userData, $objectRow);
        }
        echo json_encode($userData, JSON_UNESCAPED_UNICODE);
    }


$mysqli->close();
?>