var Application;


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
    Application.ToolBar.updateDate(el.getAttribute('data-date'));
    Application.TaskList.getByDate(el.getAttribute('data-date'));
    el.classList.add('selected');
}

function addTask(el){
    let name = $('#task-name')[0].value;
    let proj = $('#task-project')[0].value;
    let type = $('#task-type')[0].value;
    let note = $('#task-notes')[0].value;
    let star = $('#task-start')[0].value;
    let dura = $('#task-dur')[0].value;

    Application.TaskList.add(
        name, proj, type, note, star * UTHou, dura
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