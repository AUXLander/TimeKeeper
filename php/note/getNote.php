<?php 
    require('../auth/auth.php');

    $sql = 'SELECT * FROM `note_data` WHERE userID = ?s AND noteID=?s';

    $result = $db->query($sql, $_SESSION['userID'], $_GET['noteID']);

    if (!($result)) {
        die('Ошибка запроса: ' . $db->error);
    }
    else{
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }
?>