var tstamp = function(h, m){
    let tdiv = document.createElement('div');
    tdiv.classList.add('timestamp');
    tdiv.innerHTML = `<span>${h}:${m < 10 ?'0'+m:m}</span>`;
    return tdiv;
}
var tObject = function(h,m){
    return {'h' : h, 'm' : m};
}
var tnote = function(dataObject){
    let tdiv = document.createElement('div');
    tdiv.classList.add('task');
    tdiv.innerHTML = `<div class="task__info"><div class="task__name">${dataObject.name} <span>${dataObject.project}, ${dataObject.type}</span></div></div><div class="task__tinfo">3h 30m</div>`;

    return tdiv;
}