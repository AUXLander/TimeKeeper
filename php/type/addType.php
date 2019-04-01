<?
    require('../auth/auth.php');

    //if(!isset($_POST['type_name'])){ die('пуста'); }
    $type_name = 'Учебный';

    $sql = 'INSERT INTO `type_data`(userID, type_name) 
            VALUES(?s, ?s, ?s)';

    $result = $db->query($sql, $_SESSION['userID'], $type_name);

    if (!($result)) {
        die('Ошибка запроса: ' . $db->error);
    }
    else {
        $sql = 'SELECT * FROM `type_data` WHERE typeID=?s';
        $result = $db->getRow($sql, $db->insertId());
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }

?>