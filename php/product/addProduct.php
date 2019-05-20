<?php
    require('../auth/auth.php');

    $FP = $_GET['fp'];

    /*
    $types = [
        'Молочный',
        'Фрукты',
        'Овощи'
    ];
    */

    $products = [
        'кефир',
        'творог',
        'сметана'
    ];

    switch($FP){
        case '985297909':
        $products = [
            'Молоко наша корова'
        ];
        break;

        case '1556515712':
        $products = [
            'кабачки',
            'баклажаны'
        ];
        break;

        case '2783541425':
        $products = [
            'молоко цельное',
            'сметана шахунья'
        ];
        break;

        case '1325754440':
        $products = [
            'кефир'
        ];
        break;

        case '1411331431':
        $products = [
            'кефир'
        ];
        break;

        case '3282960892':
        $products = [
            'кефир',
        ];
        break;

        case '3602068913':
        $products = [
            'сыр',
        ];
        break;

        case '320556524':
        $products = [
            'творог',
            'творог'
        ];
        break;

        case '1377076613':
        $products = [
            'биойогурт',
            'кефир'
        ];
        break;

        default: 
            die('false');
    }

    $regexp_array = [
        //Milk
        [
            "/моло/ui", // 7
            "/йогурт/ui", // 7 
            "/сыр/ui", // 6 
            "/твор/ui", // 4 
            "/кефир/ui", // 5
            "/сметана/ui" // 6
        ],
        //Meat
        [
            "/утка/ui", // 7
            "/куриц/ui", // 8 
            "/индейк/ui", // 9 
            "/цыпл/ui", // 10
            "/говя/ui", //  11
            "/свин/ui", // 12
            "/баран/ui", // 13
            "/рыб/ui" // 14
        ],
        //Fruts
        [
            "/клубн/ui", // 15 
            "/виногр/ui", // 16
            "/апельсин/ui", // 17
            "/мандар/ui", // 18
            "/лимон/ui" // 19
        ],
        //Vegetables
        [
            "/помид/ui", // 20
            "/баклажа/ui", // 21
            "/тыкв/ui", // 22
            "/кабач/ui", // 23
            "/морковь/ui", // 24
            "/свекл/ui", // 25
            "/картоф/ui",//the same 26
            "/картош/ui",// 27
            "/шпин/ui", // 28
            "/капуст/ui", // 29
            "/салат/ui", // 30
            "/броккол/ui", //  31
            "/лук/ui", // 32
            "/чесно/ui", // 33
            "/спарж/ui" // 34
        ],
        //Exceptions
        [
            "/яйц/ui", // 35
            "/икр/ui" // 36
        ]
    ];

    $overdue_array = [
        //Milk
        [7,10,6,4,5,6],
        //Meat
        [7,8,9,10,11,12,13,14],
        //Fruts
        [15,16,17,18,19],
        //Vegetables
        [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34],
        //Exceptions
        [35,36]
    ];


    $groupInd = 0;
    $productInd = 0;
    $loggedCount = 0;
    $loggedList = [];

    $time_s = '2019-05-21';
    
    $sql = 'INSERT INTO product_data(userID, productName, productTypeID, productTime_s, productTime_d, productOverdue) VALUES';

    foreach($regexp_array as $regex_group){
        array_push($loggedList, []);

        if(count($products) == 0){
            break;
        }

        $productInd = 0;
        foreach($regex_group as $regex_product){
            array_push($loggedList[$groupInd], []);
            for($i = 0; $i < count($products); $i++){
                if(preg_match($regex_product, $products[$i])){
                    $sql .= '(' .$_SESSION['userID'] .', "' .$products[$i].'", ' .$groupInd .', "' .$time_s .'", ' .$overdue_array[$groupInd][$productInd] .', false),';

                    array_push($loggedList[$groupInd][$productInd], $products[$i]);
                    array_splice($products, $i, 1);

                    $loggedCount++;
                    $i--;
                }
            }
            $productInd++;
            
        }
        
        $groupInd++;
    }
    $sql = rtrim($sql, ",");
    //echo $sql .'<br>';
    
    $result = $db->query($sql);

    if (!($result)) {
        die('Ошибка запроса: ' . $db->error);
    }
    else{
        //TO DO
        die($FP);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    /*
    echo "Количество продуктов: {$loggedCount}<br><br>";
    
    echo '<pre>';
        print_r($loggedList);
    echo '</pre>';

    echo '<br>';
    var_dump($products);
    */
?>