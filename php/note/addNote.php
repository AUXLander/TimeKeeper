<?
require('../auth/auth.php');

//if(!isset($_POST['note'])){ die('Заметка пуста'); }
$note = 'Заметка test_note';
$projectID = $_POST['projectID'] || 1;
$typeID = $_POST['typeID'] || 1;


$sql = 'INSERT INTO `note_data`(userID, projectID, typeID, note) VALUES(?s, ?s, ?s, ?s)';

$result = $db->query($sql, $_SESSION['userID'], $projectID, $typeID, $note);

if (!($result)) {
    die('Ошибка запроса: ' . $db->error);
}

//INSERT INTO `note_data`(userID, projectID, typeID, note) VALUES(0,0,0,"Заметка 0")