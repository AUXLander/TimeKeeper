document.addEventListener('touchstart',function(){}, true);
document.addEventListener('gesturestart',function (e){e.preventDefault()});
class TimeKeeper{
    constructor(app){
        this.Application = app;
        this.DateControl = new DateControl(app);
        this.ToolBar = new ToolBar(app);
        this.TaskList = new TaskList(app);
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
        this.Application = app;
        this.updateDate();
    }
    updateDate(timestring){
        let tempDate = new Date(timestring + ' 00:00:00');
        if(tempDate == "Invalid Date"){
            tempDate = new Date();
            console.log('%cToolBar: Invalide Date Detected!', 'background: #222; color: #bada55');
        }
        this.setDate(
            WDayName[tempDate.getDay()],
            tempDate.getDate(),
            MonthName[tempDate.getMonth()]
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
        this.loadTasklist(Date.now());
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
    loadTasklist(date){
        let stObjDate = new Date(date);
        let stDate = `${stObjDate.getMonth()}-${stObjDate.getDate()}-${stObjDate.getFullYear()}`;
        let arrData = Object.keys(userData.taskData);
        let len = arrData.length;

        for(let i=0;i<len;i++) {
            if(arrData[i] == stDate) {
                let cTasks = userData.taskData[arrData[i]].length;
                for(let j=0;j<cTasks;j++){
                    this.addTask(userData.taskData[arrData[i]][j]);
                }
                return;
            }
        }

    }
    addTask(objectTask){
        return $('#tasklist')[0].appendChild(
            tTask(objectTask)
        );
    }
}
