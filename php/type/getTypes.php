<?php 
    require('../auth/auth.php');

    $sql = 'SELECT * FROM `type_data` WHERE userID=?s';

    $result = $db->getAll($sql, $_SESSION['userID']);

    if (!($result)) {
        die('Ошибка запроса: ' . $db->error);
    }
    else{
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }
?>