document.addEventListener("touchstart", function(){}, true);
class TimeKeeper{
    constructor(){
        this.DateControl = new DateControl();
        this.ToolBar = new ToolBar();
        this.TaskList = new TaskList();
    }
    openPage(page){
        let pageBlocks;

        if(document.body.getAttribute(`current-page`) == page){
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
    }
}

class DateControl{
    constructor(){
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
                    `${date.getFullYear()}-${date.getMonth()}-${dateVal + i}`
                    )
            );
        }
        $('#dateline .date')[7].classList.add('today', 'selected');
        let hWrapEl = $('.header__date')[0];
        hWrapEl.scrollLeft = hWrapEl.offsetWidth / 2 - 42;
    }
}

class ToolBar{
    constructor(){
        this.updateDate();
    }
    updateDate(timestring = ""){
        let tempDate = new Date(timestring);
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
        return $('#sel-date')[0].innerHTML = `${wday}, ${month} ${date}`;
    }
    setCost(cost){
        return $('#sel-date-cost')[0].innerHTML = `, $${cost}`;
    }
    setShortPlan(){
        return $('#day-short-plan')[0].innerHTML = `${count} meetings`;
    }
    setAddictionData(data){
        return $('#day-addc-data')[0].innerHTML = `, ${data}h free`;
    }
}

class TaskList{
    constructor(){
        this.loadTimestamps();
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
    addTask(){
        return $('#tasklist')[0].appendChild(
            tNote({
                'name'      :   'Задача',
                'project'   :   'Проект',
                'type'      :   'Работа',
                'notes'     :   '',
                'start'     :   (UTHou*8),
                'end'       :   (UTHou*10.3)
            })
        );
    }
}



var Application = new TimeKeeper();