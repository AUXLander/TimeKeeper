document.addEventListener('touchstart',function(){}, true);
document.addEventListener('gesturestart',function (e){e.preventDefault()});

class TimeKeeper{
    constructor(app){
        this.Application = app;
        this.DateControl = new DateControl(app);
        this.ToolBar = new ToolBar(app);
        this.TaskList = new TaskList(app);
        this.Ajax = new Ajax();
        this.CheckScan = new CheckScan(app);
        //Callbacks for click
        this.waitClick = [];
        document.addEventListener('click', function(){
            while(Application.waitClick.length){
                (Application.waitClick.pop())();
            }
        }, true);
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

}

class DateControl{
    constructor(app){
        this.Application = app;
        this.dateLine = $('#dateline')[0];
        this.loadDate();
    }
    addDate(timestamp){
        let day = new Date(timestamp).getDay();
        dateLine.appendChild(tDate(WDayName[day],day));
    }
    loadDate(){
        let date = new Date(Date.now() - UTWee*1000);
        let dateVal = date.getDate();
        let dayName = date.getDay();
        for(let i=0;i<14;i++) {
            this.dateLine.appendChild(
                tDate(
                    WDayName[(dayName + i) % 7],
                    dateVal + i,
                    `${date.getFullYear()}/${date.getMonth()}/${dateVal + i}`
                )
            );
        }
        $('#dateline .date')[7].classList.add('today', 'selected');
        let hWrapEl = $('.header__date')[0];
        hWrapEl.scrollLeft = hWrapEl.offsetWidth / 2 - 42;
    }
    
}

class ToolBar{
    constructor(app){
        this.date;
        this.Application = app;
        this.updateDate();
    }
    updateDate(timestring){
        this.date = new Date(timestring + ' 00:00:00');
        if(this.date == "Invalid Date"){
            this.date = new Date();
            let timestring = `${MonthName[this.date.getMonth()-1]} ${this.date.getDate()} ${this.date.getFullYear()} 00:00:00`;
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
        this.loadByDate(Date.now());
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
    loadByDate(date){
        this.clear();

        let stObjDate = new Date(date);
        let stDate = `${stObjDate.getMonth()}-${stObjDate.getDate()}-${stObjDate.getFullYear()}`;
        let arrData = Object.keys(userData.taskData);
        
        let len = arrData.length;

        for(let i=0;i<len;i++) {
            if(arrData[i] == stDate) {
                let cTasks = userData.taskData[arrData[i]].length;
               
                this.scrollToTask(
                    this.draw(userData.taskData[arrData[i]][0])
                );
                //Пропускаем первый, чтобы заскроллиться к нему
                for(let j=1;j<cTasks;j++){
                    this.draw(userData.taskData[arrData[i]][j]);
                }
                return;
            }
        }
        
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
    add(name, project, type, notes, start, duration){
        if(!name.length && !type.length && !project.length && !notes.length && !duration){
            return;
        }

        duration = parseInt(duration);
        start = parseInt(start);

        if(!name.length){
            name = "Задача";
        }
        if(!duration){
            duration = UTHou;
        }

        start = Math.max(data.time.start, start);
        
        let tempObject = {
            'name'      :   name,
            'project'   :   project,
            'type'      :   type,
            'notes'     :   notes,
            'start'     :   start,
            'dur'       :   duration
        }

        let oDate = Application.ToolBar.date;
        let sDate =  `${oDate.getMonth()}-${oDate.getDate()}-${oDate.getFullYear()}`;

        console.log(sDate)

        if(userData.taskData[sDate] === undefined){
            userData.taskData[sDate] = [];
        }
        userData.taskData[sDate].push(tempObject);

        let newTask = this.draw(tempObject);

        this.scrollToTask(newTask);
    }
    scrollToTask(taskEl){
        if(taskEl === undefined){
            return $('main')[0].scrollTop = 0;
        }

        return $('main')[0].scrollTop = (parseInt(taskEl.style.top) - 20);
    }
}

const LOGIN_PATH = "/v1/mobile/users/login";
const RESTORE_PATH = "v1/mobile/users/restore";
const SIGN_UP = "/v1/mobile/users/signup";

class Ajax{
    constructor(){
        this.requests = [];
    }
    getXmlHttp(){
        var xmlhttp;
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
            console.log('Msxml2.XMLHTTP');
        }
        catch (e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                console.log('Microsoft.XMLHTTP');
            }
            catch (E) {
                xmlhttp = false;
            }
        }
        if (!xmlhttp && typeof XMLHttpRequest !== undefined) {
            xmlhttp = new XMLHttpRequest();
            console.log('XMLHttpRequest');
        }
        return xmlhttp;
    }
    vote() {
        var req = this.getXmlHttp()  
        var statusElem = document.getElementById('day-addc-data') 
        
        req.onreadystatechange = function() {  
            if (req.readyState == 4) { 
                // если запрос закончил выполняться
                //statusElem.innerHTML = req.statusText // показать статус (Not Found, ОК..)
                if(req.status == 200) { 
                    // если статус 200 (ОК)
                    //alert("Ответ сервера: " + req.responseText);
                    console.log(req.responseText);
                }
            }
        }

        // (3) задать адрес подключения
        req.open('GET', '/req.php', true); 
        req.send(null);  // отослать запрос
        statusElem.innerHTML = 'Ожидаю ответа сервера...' 
    }
}

class CheckScan{
    constructor(app){
        this.Application = app;
    }
    signUp(email, name, phone){

    }
}