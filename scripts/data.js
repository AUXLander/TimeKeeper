const UTWee = 604800;
const UTDay = 86400;
const UTHou = 3600;
const UTMin = 60;
const UTSec = 60;

var taskData = [];
var noteData = [];

var tempScanned = [];

var projectData = [
    {
        projectID: -1,
        project_name: "No project",
        description: ''
    }
];
var typeData = [
    {
        typeID: -1,
        userID: 0,
        type_name: "Other"
    }
];

var productData = [];
var productType = ["Milk", "Meat", "Fruts", "Vegetables", "Exceptions"];

var userData = {
    userName : "Denis",
    userID   : 0
};

var data = {
    tasks: {
        currentLoadedCount : 0
    },
    time : {
        start   : UTHou * 5,
        end     : UTHou * 24,
        split   : UTHou,
        height  : 150,
        scale   : 150 / UTHou
    }
};