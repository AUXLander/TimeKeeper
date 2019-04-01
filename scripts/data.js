const UTWee = 604800;
const UTDay = 86400;
const UTHou = 3600;
const UTMin = 60;
const UTSec = 60;

var taskData =
[
    
]
var noteData = [
    {
        
    }
]
var projectData = [
    {
        projectID: 0,
        name: '',
        description: ''
    }
]
var typeData = [
    {
        typeID: 0,
        userID: 0,
        type_name: ''
    }
]

var userData = {
    'userName' : 'Denis',
    'taskData' : {
        '1-14-2019' : [
            {
                'name'      :   'Задача145',
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