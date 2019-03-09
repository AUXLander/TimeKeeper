function selectDate(el){
    $(`.date.selected`)[0].classList.remove(`selected`);
    Application.ToolBar.updateDate(el.getAttribute("data-date"));
    return el.classList.add(`selected`);
}

function closeBPanel(){
    return $('.bpanel.show')[0].classList.remove('show');
}

function openBPanel(el){
    return $(`[bpan-data=${el.getAttribute('bpan-call')}`)[0].classList.add('show');
}

function choosePage(toolbutton){
    return Application.openPage(toolbutton.getAttribute('for-page'))
}