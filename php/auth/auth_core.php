<?php
    if (isset($_GET['e'])) {
        $sql = "SELECT * FROM user_data WHERE email=?s";
        $result = $db->getRow($sql, $_GET['e']);
        if($result && $result['confirmed']){
            if(password_verify($_GET['p'], $result['pass'])){
                $_SESSION['userID'] = $result['userID'];
                exit;
            }
        }
        //echo 'Session: '.$_SESSION['userID'];
    }

    if (isset($_GET['action']) AND $_GET['action']=="logout") {
        session_start();
        session_destroy();
        //header("Location: http://".$_SERVER['HTTP_HOST']."/");
        exit;
    }

    if (!isset($_SESSION['userID'])) {
        echo '
        <form method="GET">
            <input type="text" name="e">
            <input type="password" name="p">
            <input type="submit">
        </form>
        ';
        exit;
    }
    //echo 'Session auth: '.$_SESSION['userID'];
?>