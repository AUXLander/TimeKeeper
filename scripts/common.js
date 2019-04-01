document.addEventListener('touchstart',function(){}, true);
document.addEventListener('gesturestart',function (e){e.preventDefault()});

function tcor(key){
	if(key.length == 1 || key < 10){
		return `0${key}`;
	}
	return key;
}

class TimeKeeper{
    constructor(app){
        this.Application = app;
        this.DateControl = new DateControl(app);
        this.ToolBar = new ToolBar(app);
        this.TaskList = new TaskList(app);
        this.Ajax = new Ajax();
        //this.CheckScan = new CheckScan(app);
        //Callbacks for click

        this.afterAuth()

        this.waitClick = [];
        document.addEventListener('click', function(){
            while(Application.waitClick.length){
                (Application.waitClick.pop())();
            }
        }, true);
    }

    afterAuth(){
        //Обновляем данные
        this.updateProjects();
        this.updateTypes();
    }
    addClick(callback){
        if (typeof callback !== "function"){
            return false;
        }
        this.waitClick.push(callback);
        return true;
    }
    openPage(page){
        let pageBlocks;
        if(document.body.getAttribute('current-page') == page){
            return;
        }
        pageBlocks = $(`[page]:not(${page})`);
        for(let i=0;i<pageBlocks.length;i++){
            pageBlocks[i].setAttribute('hidden','');
        }
        pageBlocks = $(`[page="${page}"]`);
        for(let i=0;i<pageBlocks.length;i++){
            pageBlocks[i].removeAttribute('hidden');
        }
        document.body.setAttribute('current-page', page);
    }
    updateProjects(){
        var updProjects = new XMLHttpRequest();
        updProjects.onreadystatechange = function(){
            if (this.readyState == 4) { 
                if(this.status == 200) { 
                    let json;
                    try{
                        json = JSON.parse(this.responseText);
                    }
                    catch(e){
                        console.log(e);
                        this.abort();
                        return;
                    }

                    if(json.length < 1 || json[0].projectID === undefined){
                        this.abort();
                        return;
                    }

                    projectData.length = 0;
                    while(json.length){
                        projectData.push(json.pop());
                    }

                    this.abort();
                }
            }
        }
        updProjects.open('GET', '/php/project/getProjects.php', true); 
        updProjects.send(null);
    }
    updateTypes(){
        var updTypes = new XMLHttpRequest();
        updTypes.onreadystatechange = function(){
            if (this.readyState == 4) { 
                if(this.status == 200) {
                    
                    let json;
                    try{
                        json = JSON.parse(this.responseText);
                    }
                    catch(e){
                        console.log(e);
                        this.abort();
                        return;
                    }

                    if(json.length < 1 || json[0].typeID === undefined){
                        this.abort();
                        return;
                    }

                    typeData.length = 0;
                    while(json.length){
                        typeData.push(json.pop());
                    }
                    
                    this.abort();
                }
            }
        }
        updTypes.open('GET', '/php/type/getTypes.php', true); 
        updTypes.send(null);
    }
}

class DateControl{
    constructor(app){
        this.Application = app;
        this.dateLine = $('#dateline')[0];
        this.selectedDate;
        
        this.loadDate();
    }
    addDate(timestamp){
        let day = new Date(timestamp).getDay();
        dateLine.appendChild(tDate(WDayName[day],day));
    }
    loadDate(){
        let date = new Date(Date.now() - UTWee*1000);
        let dayName = date.getDay();
        for(let i=0;i<14;i++) {
            this.dateLine.appendChild(
                tDate(
                    WDayName[(dayName + i) % 7],
                    date.getDate(),
                    `${date.getFullYear()}-${tcor(date.getMonth() + 1)}-${tcor(date.getDate())}`
                )
            );
            date = new Date(date.getTime() + UTDay*1000);
        }

        let today = $('#dateline .date')[7];
        today.classList.add('today', 'selected');
        this.selectedDate = today.getAttribute('data-date');

        let hWrapEl = $('.header__date')[0];
        hWrapEl.scrollLeft = hWrapEl.offsetWidth / 2 - 42;
    }
    timeToFloat(s_time){
        if(typeof(s_time) !== "string" || !s_time.length){
            return 0;
        }
        s_time = s_time.split(':');
        return parseInt(s_time[0])%24 + parseInt(s_time[1])/60;
    }
}

class ToolBar{
    constructor(app){
        this.date;
        this.Application = app;
        this.updateDate();
    }
    updateDate(timestring){
        this.date = new Date(timestring + 'T00:00:00');
        if(this.date == "Invalid Date"){
			this.date = new Date();
            timestring = `${this.date.getFullYear()}-${tcor(this.date.getMonth())}-${tcor(this.date.getDate())}T00:00:00`;
            this.date = new Date(timestring);// Bug Fix
            console.log('%cToolBar: Invalide Date Detected!', 'background: #222; color: #bada55');
        }
        this.setDate(
            WDayName[this.date.getDay()],
            this.date.getDate(),
            MonthName[this.date.getMonth()]
        );
    }
    setDate(wday, date, month){
        $('#sel-date')[0].innerHTML = `${wday}, ${month} ${date}`;
    }
    setCost(cost){
        $('#sel-date-cost')[0].innerHTML = `, $${cost}`;
    }
    setShortPlan(){
        $('#day-short-plan')[0].innerHTML = `${count} meetings`;
    }
    setAddictionData(data){
        $('#day-addc-data')[0].innerHTML = `, ${data}h free`;
    }
}

class TaskList{
    constructor(app){
        this.Application = app;
        this.loadTimestamps();

        this.getByDate(Date.now());
		//this.loadByDate(Date.now());

		//To save in local storage
		this.localTaskID = 0;
    }
    loadTimestamps(){
        $('.calendar-style')[0].innerHTML += `.timestamp{height: ${data.time.height}px}`;
        
        let countStamps = ((data.time.end - data.time.start)/data.time.split)|0;
        let timeline = $('#timeline')[0];
        for(let i = 0; i < countStamps; i++){
            timeline.appendChild(tStamp(TObject(data.time.start + data.time.split*i)));
        }
        return countStamps;
    }
    getByDate(date){
        
        this.clear();

        let stObjDate = new Date(date);
        let stDate = `${stObjDate.getFullYear()}-${tcor(stObjDate.getMonth()+1)}-${stObjDate.getDate()}`;

        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState == 4) {
                if(this.status == 200) { 
                    let json;
                    try{
                        json = JSON.parse(this.responseText);
                    }
                    catch(e){
                        if(this.responseText != "NULL"){
                            console.log(e);
                        }
                        this.abort();
                        return;
                    }
                    
					let jNode;
					while(json.length){
                        jNode = json.pop();
                        let i = 0;
						for(;i<taskData.length;i++){
                            if(taskData[i].taskID == jNode.taskID){
                                taskData[i] = jNode;
                                break;
                            }
                        }
                        if(taskData.length == i){
                            taskData.push(jNode);
                            
                            Application.TaskList.scrollToTask(
                                Application.TaskList.draw(jNode)
                            );
                        }
                    }

                    Application.TaskList.loadByDate(
                        Application.DateControl.selectedDate
                    );
                    
                    this.abort();
                }
            }
        }
        console.log(stDate);
        req.open('GET', '/php/task/getTask.php?date='+stDate, true);
        req.setRequestHeader('Content-type', 'application/json');
        req.send(null);
    }
    loadByDate(date){
        this.clear();

        let stObjDate = new Date(date);
        let stDate = `${stObjDate.getFullYear()}-${tcor(stObjDate.getMonth()+1)}-${tcor(stObjDate.getDate())}`;
        
        let len = taskData.length;
        let min_time = UTHou * data.time.end;
        let min_obj;

        for(let i=0;i<len;i++){
            if(taskData[i].date == stDate){
                if(taskData[i].time_s < min_time){
                    min_time = taskData[i].time_s;
                    min_obj = this.draw(taskData[i]);
                }
                else {
                    this.draw(taskData[i]);
                }
            }
        }
        this.scrollToTask(min_obj);
    }
    draw(objectTask){
        if(objectTask === undefined){
            return;
        }
        return $('#tasklist')[0].appendChild(
            tTask(objectTask)
        );
    }
    clear(){
        let tasks = $('#tasklist .task');
        
        for(let i=0;i<tasks.length;i++){
            tasks[i].remove();
        }
    }
    add(name, projectID, typeID, descript, noteID, time_s, time_d, time_r = 0){
        var addTaskReq = Application.Ajax.getXmlHttp();
        addTaskReq.onreadystatechange = function(){
            if (this.readyState == 4) { 
                if(this.status == 200) { 
                    let json;
                    try{
                        json = JSON.parse(this.responseText);
                    }
                    catch(e){
                        console.log(e);
                        this.abort();
                        return;
                    }

                    if(json.length < 1){
                        this.abort();
                        return;
                    }
                    if(json[0].projectID === undefined){
                        this.abort();
                        return;
                    }


                    let tempTask = json.pop(); 
                    taskData.push(tempTask);

                    Application.TaskList.scrollToTask(
                        Application.TaskList.draw(tempTask)
                    );
                    
                    this.abort();
                }
            }
        }

        time_s = Application.DateControl.timeToFloat(time_s) * UTHou;
        time_d = Application.DateControl.timeToFloat(time_d) * UTHou;

        let date;

        projectID = encodeURIComponent(projectID);
        typeID    = encodeURIComponent(typeID);
        noteID    = encodeURIComponent(noteID);
        date      = encodeURIComponent(Application.DateControl.selectedDate);
        name      = encodeURIComponent(name);
        descript  = encodeURIComponent(descript);
        time_s    = encodeURIComponent(time_s);
        time_d    = encodeURIComponent(time_d);
        time_r    = encodeURIComponent(time_r);

        let body = `
            localTaskID=${this.localTaskID++}
            &projectID=${projectID}
            &typeID=${typeID}
            &noteID=${noteID}
            &date=${date}
            &name=${name}
            &desc=${descript}
            &time_s=${time_s}
            &time_d=${time_d}
            &time_r=${time_r}`;

        addTaskReq.open("POST", '/php/task/addTask.php', true);
        addTaskReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        addTaskReq.send(body);
    }
    scrollToTask(taskEl){
        if(taskEl === undefined){
            return $('main')[0].scrollTop = 0;
        }

        return $('main')[0].scrollTop = (parseInt(taskEl.style.top) - 20);
    }
}


class Ajax{
    constructor(){
        this.requests = [];
    }
    getXmlHttp(){
        return new XMLHttpRequest();
    }
}
    