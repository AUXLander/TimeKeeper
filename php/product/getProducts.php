<?php
    require('../auth/auth.php');

    $sql = 
        'SELECT productID, productName, productTypeID, productTime_s, productTime_d
            FROM `product_data`
            WHERE userID=?s';

    $result = $db->getAll($sql, $_SESSION['userID']);

    if (!($result)) {
        die('Ошибка запроса: ' . $db->error);
    }
    else{
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }
?>