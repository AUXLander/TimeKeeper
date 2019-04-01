var Application;
AOS.init();

function datelineOn(){
    $('#dateline')[0].classList.add('active');
    Application.addClick(datelineOff);
}

function datelineOff(){
    $('#dateline')[0].classList.remove('active');
}

function selectDate(el){
    if(Application === undefined){return false}

    $('.date.selected')[0].classList.remove('selected');
    Application.DateControl.selectedDate = el.getAttribute('data-date');
    Application.ToolBar.updateDate(el.getAttribute('data-date'));
    Application.TaskList.getByDate(el.getAttribute('data-date'));
    el.classList.add('selected');
}

function addTask(el){
    let name = $('#task-name')[0].value;
    let projectID = $('#task-project')[0].value;
    let typeID = $('#task-type')[0].value;
    let description = $('#task-description')[0].value
    let noteID = 0;
    let time_s = $('#task-start')[0].value;
    let time_d = $('#task-dur')[0].value;
    let time_r;

    Application.TaskList.add(
        name, projectID, typeID, description, noteID, time_s, time_d, time_r = 0
    );
}

function closeLayer(){
    if(Application === undefined){return false}
    $('.layer.show')[0].classList.remove('show');
}

function openLayer(el){
    if(Application === undefined){return false}
    $(`[layer-data="${el.getAttribute('layer-call')}"]`)[0].classList.add('show');
}

function choosePage(toolbutton){
    if(Application === undefined){return false}
    Application.openPage(toolbutton.getAttribute('for-page'));
}

function toggleNoteblock(el){
    el.parentElement.classList.toggle('show');
}

document.addEventListener("DOMContentLoaded", function(){
    Application = new TimeKeeper(Application);
    

});