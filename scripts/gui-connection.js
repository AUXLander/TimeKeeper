var Application;

function datelineOn(){
    //$('#dateline')[0].classList.add('active');
    //Application.addClick(datelineOff);
}

function datelineOff(){
    $('#dateline')[0].classList.remove('active');
}

function auth(){
    if(Application === undefined){return}

    Application.auth(
        $('#auth-email')[0].value,
        $('#auth-password')[0].value
    );
}
function auth_close(){
    $('#auth-form')[0].classList.add('an_close');
    setTimeout(function(){
        let auth_form = $('#auth-form')[0].classList;
        auth_form.remove('an_close');
        auth_form.add('close');
    }, 200);
}

function auth_open(){
    $('#auth-form')[0].classList.remove('close', 'an_close');
}

function selectDate(element){
    if(Application === undefined){return}

    $('.date.selected')[0].classList.remove('selected');
    Application.DateControl.selectedDate = element.getAttribute('data-date');
    Application.ToolBar.updateDate(element.getAttribute('data-date'));
    Application.TaskList.getByDate(element.getAttribute('data-date'));
    element.classList.add('selected');
}

function addTask(){
    let name        = $('#task-name')[0].value;
    let projectID   = $('#task-project')[0].value;
    let typeID      = $('#task-type')[0].value;
    let description = $('#task-description')[0].value;
    let time_s      = $('#task-start')[0].value;
    let time_d      = $('#task-dur')[0].value;
    let noteID      = 0;//TO DO
    let time_r      = 0;//TO DO

    Application.TaskList.add(
        name, projectID, typeID, description, noteID, time_s, time_d, time_r
    );

    $('#task-name')[0].value        = null;
    $('#task-project')[0].value     = null;
    $('#task-type')[0].value        = null;
    $('#task-description')[0].value = null;
    $('#task-start')[0].value       = null;
    $('#task-dur')[0].value         = null;
}

function closeLayer(){
    if(Application === undefined){return}
    $('.layer.show')[0].classList.remove('show');
}

function openLayer(element){
    if(Application === undefined){return}
    $(`[layer-data="${element.getAttribute('layer-call')}"]`)[0].classList.add('show');
}

function choosePage(toolbutton){
    if(Application === undefined){return}
    Application.openPage(toolbutton.getAttribute('for-page'));
}

function toggleNoteblock(element){
    element.parentElement.classList.toggle('show');
}

document.addEventListener("DOMContentLoaded", function(){
    Application = new TimeKeeper(Application);
});

function openNote(element){
    if(Application === undefined){return}
    let noteArea = $('.note-area')[0];
    noteArea.innerText = null;
    noteArea.innerText = Application.NoteManager.getNoteTextByID(element.getAttribute('note-id'));

    $('[layer-data=note] .layer__title span')[0].innerText = element.querySelector('label span:last-child').innerText;
    $('[layer-data=note]')[0].setAttribute('note-id', element.getAttribute('note-id'));
    $('[layer-data=note] button')[0].setAttribute('note-id', element.getAttribute('note-id'));
}
function saveNote(element){
    for(let i = 0; i < noteData.length; i++){
        if(noteData[i].noteID == element.getAttribute('note-id')){
            noteData[i].note = $(`[note-id="${noteData[i].noteID}"] .note-area`)[0].innerText;
        }
    }
}