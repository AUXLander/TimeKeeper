var Application;

function selectDate(el){
    if(Application === undefined){return false}

    $('.date.selected')[0].classList.remove('selected');
    Application.ToolBar.updateDate(el.getAttribute('data-date'));
    Application.TaskList.loadByDate(el.getAttribute('data-date'));
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

function closeBPanel(){
    if(Application === undefined){return false}
    $('.bpanel.show')[0].classList.remove('show');
}

function openBPanel(el){
    if(Application === undefined){return false}
    $(`[bpan-data="${el.getAttribute('bpan-call')}"]`)[0].classList.add('show');
}

function choosePage(toolbutton){
    if(Application === undefined){return false}
    Application.openPage(toolbutton.getAttribute('for-page'));
}

function toggleNoteblock(el){
    el.parentElement.classList.toggle('show');
}

document.addEventListener("DOMContentLoaded", function(event) {
    Application = new TimeKeeper(Application);

});