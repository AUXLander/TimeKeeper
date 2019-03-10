var Application;

function selectDate(el){
    if(Application === undefined){return false}

    $('.date.selected')[0].classList.remove('selected');
    Application.ToolBar.updateDate(el.getAttribute('data-date'));
    return el.classList.add('selected');
}

function closeBPanel(){
    if(Application === undefined){return false}

    return $('.bpanel.show')[0].classList.remove('show');
}

function openBPanel(el){
    if(Application === undefined){return false}
    return $(`[bpan-data=${el.getAttribute('bpan-call')}`)[0].classList.add('show');
}

function choosePage(toolbutton){
    if(Application === undefined){return false}

    return Application.openPage(toolbutton.getAttribute('for-page'));
}


document.addEventListener("DOMContentLoaded", function(event) {
    Application = new TimeKeeper(Application);

});