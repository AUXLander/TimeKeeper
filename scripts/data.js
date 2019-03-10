const UTWee = 604800;
const UTDay = 86400;
const UTHou = 3600;
const UTMin = 60;
const UTSec = 60;
var userData = {
    'userName' : 'Denis',
    'taskData' : {
        '2-10-2019' : [
            {
                'name'      :   'Задача1',
                'project'   :   'Проект',
                'type'      :   'Работа',
                'notes'     :   '',
                'start'     :   (UTHou*8),
                'end'       :   (UTHou*10.3)
            },
            {
                'name'      :   'Задача2',
                'project'   :   'Проект',
                'type'      :   'Работа',
                'notes'     :   '',
                'start'     :   (UTHou*11),
                'end'       :   (UTHou*12)
            }
        ],
        '2-20-2019' : [
            {
                'name'      :   'Задача1',
                'project'   :   'Проект',
                'type'      :   'Работа',
                'notes'     :   '',
                'start'     :   (UTHou*8),
                'end'       :   (UTHou*10.3)
            },
            {
                'name'      :   'Задача2',
                'project'   :   'Проект',
                'type'      :   'Работа',
                'notes'     :   '',
                'start'     :   (UTHou*8),
                'end'       :   (UTHou*10.3)
            }
        ]
    },
    'noteData' : {
        
    }
}
var data = 
    {
        'tasks':{
            'currentLoadedCount' : 0
        },
        'time' : {
            'start' : UTHou * 5,
            'end'   : UTHou * 24,
            'split' : UTHou,
            'height': 150,
            'scale' : 150 / UTHou
        }

    }