function getEls(qSelector){
    return document.querySelectorAll(qSelector);
}

function selectDate(el){
    getEls(`.date.selected`)[0].classList.remove(`selected`);
    el.classList.add(`selected`);
}

function timeStandart(tObject){
    let h = tObject.h;
    let m = tObject.m;
    h = (h + m/60|0) % 24;
    m = m % 60;
    return tObject(h, m);
}

function loadTimestamps(){
    const hsta = data.time.start.h;
    const msta = data.time.start.m;
    const hspl = data.time.split.h;
    const mspl = data.time.split.m;
    let mins = (data.time.end.h - hsta)*60 + msta + data.time.end.m;
    let countStamps = mins/(hspl*60 + mspl);
    let timeline = getEls('#timeline')[0];
    for(let i = 0; i < countStamps; i++){
        timeline.appendChild(tstamp(hsta + i*hspl, msta + i*mspl));
    }
    return countStamps;
}


function loadTimeline(){

}

function addTask(){
    return getEls('#tasklist')[0].appendChild(
        tnote({'name':'Задача','project':'Проект','type':'Работа'})
    );
}

function closeBPanel(){
    return getEls('.bpanel.show')[0].classList.remove('show');
}

function openBPanel(el){
    return getEls(`[bpan-data=${el.getAttribute('bpan-call')}`)[0].classList.add('show');
}


class ToolSet{

    setDate(timestap){

    }

}