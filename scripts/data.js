const UTWee = 604800;
const UTDay = 86400;
const UTHou = 3600;
const UTMin = 60;
const UTSec = 60;
var userData = {
    'userName' : 'Denis',
    'taskData' : {
        '1-10-2019' : [
            {
                'name'      :   'Задача1',
                'project'   :   'Проект',
                'type'      :   'Работа',
                'notes'     :   '',
                'start'     :   (UTHou*8),
                'dur'       :   (UTHou)
            },
            {
                'name'      :   'Задача2',
                'project'   :   'Проект',
                'type'      :   'Работа',
                'notes'     :   '',
                'start'     :   (UTHou*11),
                'dur'       :   (UTHou)
            }
        ],
        '1-20-2019' : [
            {
                'name'      :   'Задача1',
                'project'   :   'Проект',
                'type'      :   'Работа',
                'notes'     :   '',
                'start'     :   (UTHou*6),
                'dur'       :   (UTHou)
            },
            {
                'name'      :   'Задача2',
                'project'   :   'Проект',
                'type'      :   'Работа',
                'notes'     :   '',
                'start'     :   (UTHou*8),
                'dur'       :   (UTHou)
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