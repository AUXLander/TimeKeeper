var WDayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var MonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Sep", "Oct", "Nov", "Dec"];


var tStamp = function(tObject){
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

var TObject = function(UTValue){
    let h = UTValue/UTHou|0;
    let m = UTValue%UTHou/UTMin|0;
    return {'h' : h, 'm' : m};
}

var tTask = function(dataObject){
    let TODuration = TObject(dataObject.time_d);
    let height = dataObject.time_d*(150/UTHou);//TO DO BUG /2 - fix
    let tdiv = document.createElement('div');
    
    tdiv.setAttribute('data-aos', 'fade-up');
    tdiv.setAttribute('data-aos-anchor-placement', 'top-bottom');

    tdiv.style.height = height;
    tdiv.style.maxHeight = height;
    tdiv.style.top = (dataObject.time_s - data.time.start) / UTHou * 150;
    tdiv.classList.add('task');

    for(let i = 0; i < projectData.length; i++){
        //console.log(projectData[i].projectID);
        if(projectData[i].projectID == dataObject.projectID){
            dataObject.projectID = projectData[i].project_name;
            break;
        }
    }

    for(let i = 0; i < typeData.length; i++){
        //console.log(typeData[i].typeID);
        if(typeData[i].typeID == dataObject.typeID){
            dataObject.typeID = typeData[i].type_name;
            break;
        }
    }

    tdiv.innerHTML = `
    <div class="task__info">
        <div class="task__wrap">
            <div class="task__name">
                ${dataObject.name} <span>${dataObject.projectID}, ${dataObject.typeID}</span>
            </div>
            <div class="task__notes">
                <p>
                    ${dataObject.description}
                </p>
            </div>
        </div>
    </div>
    <time class="task__tinfo" datetime="${TODuration.h}h ${TODuration.m}m">
        ${TODuration.h}h ${TODuration.m}m
    </time>`;

    return tdiv;
}

var tDate = function(dayName, date, fulldate=""){
    let tdiv = document.createElement('div');
    tdiv.classList.add('date');
    tdiv.setAttribute("onclick", "selectDate(this)");
    tdiv.setAttribute("data-date", fulldate);
    tdiv.innerHTML = `
        <div class="date__wrap">
            <span class="date__wday">${dayName}</span>
            <span class="date__day">${date}</span>
        </div>`;
    return tdiv;
}

var tNoteblock = function(name, icon, levelEntry = undefined){
    let tdiv = document.createElement('div');
    tdiv.classList.add('noteblock', 'flexlist');

    let twrap = document.createElement('div');
    twrap.classList.add('noteblock__wrap', 'flexlist');

    tdiv.appendChild(tNote(name, icon));
    tdiv.appendChild(twrap);

    if(levelEntry !== undefined){
        levelEntry.next = twrap;
    }

    return tdiv;
}

var tNote = function(name, icon){
    let tlab = document.createElement('label');
    tlab.setAttribute('onclick', 'toggleNoteblock(this)');
    tlab.innerHTML = `<span class="icon ${icon}"></span><span>${name}</span>`;
    return tlab;
}

var tTableRow = function(id, strName, strType, strDate, strOverdate, boolOverdated, intPrice = 0){
    let tdiv = document.createElement('div');
    tdiv.setAttribute('data-product-id', id);
    tdiv.innerHTML = 
        `<div class="table__row${(boolOverdated ? ' red': '')}">
            <div class="table__cell">${strName}</div>
            <div class="table__cell">${strType}</div>
            <div class="table__cell">${strDate}</div>
            <div class="table__cell">${strOverdate}</div>
            <div class="table__cell">${intPrice}$</div>
        </div>`;

    return tdiv;
}