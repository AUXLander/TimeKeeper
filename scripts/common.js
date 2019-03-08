function getEls(qSelector){
    return document.querySelectorAll(qSelector);
}

function selectDate(el){
    getEls(`.date.selected`)[0].classList.remove(`selected`);
    return el.classList.add(`selected`);
}

function timeStandart(tObject){
    return tObject((tObject.h+m/60|0)%24,m%60);
}

function loadTimestamps(){
    let styleConteiner = getEls('.calendar-style')[0];
    styleConteiner.innerHTML += `
        .timestamp{
            height: ${data.time.height}px;
        }
    `;
    
    let countStamps = ((data.time.end - data.time.start)/data.time.split)|0;
    let timeline = getEls('#timeline')[0];
    for(let i = 0; i < countStamps; i++){
        timeline.appendChild(tstamp(tObject(data.time.start + data.time.split*i)));
    }
    return countStamps;
}


function loadTimeline(){

}

function addTask(){
    return getEls('#tasklist')[0].appendChild(
        tnote({
            'name'      :   'Задача',
            'project'   :   'Проект',
            'type'      :   'Работа',
            'notes'     :   '',
            'start'     :   (UTHou*8),
            'end'       :   (UTHou*10.3)
        })
    );
}

function closeBPanel(){
    return getEls('.bpanel.show')[0].classList.remove('show');
}

function openBPanel(el){
    return getEls(`[bpan-data=${el.getAttribute('bpan-call')}`)[0].classList.add('show');
}

function choosePage(toolbutton){
    let pageBlocks;
    let forPage = toolbutton.getAttribute('for-page');
    if(document.body.getAttribute(`current-page`) == forPage){
        return;
    }

    pageBlocks = getEls(`[page]:not(${forPage})`);
    for(let i=0;i<pageBlocks.length;i++){
        pageBlocks[i].setAttribute('hidden','');
    }
    pageBlocks = getEls(`[page="${forPage}"]`);
    for(let i=0;i<pageBlocks.length;i++){
        pageBlocks[i].removeAttribute('hidden');
    }
}

class ToolBar{
    setDate(timestamp){
        return getEls('#sel-date')[0].innerHTML = `${wday}, ${month} ${date}`;
    }
    setCost(cost){
        return getEls('#sel-date-cost')[0].innerHTML = `, $${cost}`;
    }
    setShortPlan(){
        return getEls('#day-short-plan')[0].innerHTML = `${count} meetings`;
    }
    setAddictionData(data){
        return getEls('#day-addc-data')[0].innerHTML = `, ${data}h free`;
    }
}