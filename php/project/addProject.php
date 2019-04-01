<?
    require('../auth/auth.php');

    //if(!isset($_POST['project_name'])){ die('пуста'); }
    $project_name = 'УЧЕБА';
    $project_desc = 'No description';

    if(isset($_POST['project_desc'])) $project_desc = $_POST['project_desc'];

    $sql = 'INSERT INTO `project_data`(userID, project_name, project_desc) 
            VALUES(?s, ?s, ?s)';

    $result = $db->query($sql, $_SESSION['userID'], $project_name, $project_desc);

    if (!($result)) {
        die('Ошибка запроса: ' . $db->error);
    }
    else {
        $sql = 'SELECT * FROM `project_data` WHERE projectID=?s';
        $result = $db->getRow($sql, $db->insertId());
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }

?>