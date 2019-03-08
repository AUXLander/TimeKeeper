var tstamp = function(tObject){
    let tdiv = document.createElement('div');
    tdiv.classList.add('timestamp');
    tdiv.innerHTML = `
        <span>
            ${tObject.h}
        </span>
            <sup>
                ${tObject.m < 10 ?'0'+tObject.m:tObject.m}
            </sup>`;
    return tdiv;
}
var tObject = function(UTValue){
    let h = UTValue/UTHou|0;
    let m = UTValue%UTHou/UTMin|0;
    return {'h' : h, 'm' : m};
}
var tnote = function(dataObject){
    dataObject.notes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    let UTDuration = dataObject.end - dataObject.start;
    let TODuration = tObject(UTDuration);
    let height = UTDuration*(150/UTHou);
    let tdiv = document.createElement('div');

    tdiv.style.height = height;
    tdiv.style.maxHeight = height;
    tdiv.style.top = (dataObject.start - data.time.start) / UTHou * 150;

    tdiv.classList.add('task');
    tdiv.innerHTML = `
    <div class="task__info">
        <div class="task__wrap">
            <div class="task__name">
                ${dataObject.name} <span>${dataObject.project}, ${dataObject.type}</span>
            </div>
            <div class="task__notes">
                <p>
                    ${dataObject.notes}
                </p>
            </div>
        </div>
    </div>
    <div class="task__tinfo">${TODuration.h}h ${TODuration.m}m</div>`;

    return tdiv;
}