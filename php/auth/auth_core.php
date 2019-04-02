<?php
    if (isset($_POST['email'])) {
        $success = 0;
        $sql = "SELECT * FROM user_data WHERE email=?s";
        $result = $db->getRow($sql, $_POST['email']);
        if($result && $result['confirmed']){
            if(password_verify($_POST['password'], $result['pass'])){
                $_SESSION['userID'] = $result['userID'];
                $success = 1;
            }
        }
        if(isset($_GET['action']) && $_GET['action'] == 'login'){
            echo $success;
        }
        exit;
        //echo 'Session: '.$_SESSION['userID'];
    }

    if(isset($_GET['action']) && $_GET['action'] == 'isauth'){
        echo isset($_SESSION['userID']);
        exit;
    }
    

    if (isset($_GET['action']) && $_GET['action']=="logout") {
        session_start();
        session_destroy();
        //header("Location: http://".$_SERVER['HTTP_HOST']."/");
        exit;
    }

    if (!isset($_SESSION['userID'])) {
        echo '
        <form method="GET">
            <input type="text" name="email">
            <input type="password" name="password">
            <input type="submit">
        </form>
        ';
        exit;
    }
    //echo 'Session auth: '.$_SESSION['userID'];
?>