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
        this.TypesAndOptions = false;

        this.QRCam;
        this.ToolBar;
        this.TaskList;
        this.DateControl;
        this.SmartFridge;
        this.NoteManager;

        this.isAuth();

        //Callbacks for click
        this.waitClick = [];
        document.addEventListener('click', function(){
            while(Application.waitClick.length){
                (Application.waitClick.pop())();
            }
        }, true);

        this.email = '';
        this.password ='';
        this.isAuthTrigger = false;
    }
    isAuth(){
        var isAuth = new XMLHttpRequest();
        isAuth.onreadystatechange = function(){
            if (this.readyState == 4) { 
                if(this.status == 200) {
                    Application.isAuthTrigger = false;
                    if(this.responseText == '1'){
                        Application.isAuthTrigger = true;
                    }
                    if(!Application.isAuthTrigger){
                        auth_open();
                    }
                    else{
                        auth_close();
                        Application.afterAuth();
                    }
                    this.abort();
                    return;
                }
            }
        }

        isAuth.open('GET', '/php/auth/auth.php?action=isauth', true);
        isAuth.send(null);
    }
    auth(email = '', password = ''){
        if(!email.length && password.length || email.length && !password.length){
            //TO DO
            alert('Error!');
            return;
        }
        if(!email.length && !password.length){
            email = this.email;
            password = this.password;
        }

        var auth = new XMLHttpRequest();
        auth.onreadystatechange = function(){
            if (this.readyState == 4) { 
                if(this.status == 200) { 
                    Application.isAuthTrigger = false;
                    if(this.responseText == '1'){
                        Application.isAuthTrigger = true;
                    }
                    if(!Application.isAuthTrigger){
                        auth_open();
                    }
                    else{
                        auth_close();
                        Application.afterAuth();
                    }
                    this.abort();
                    return;
                }
            }
        }

        email       = encodeURIComponent(email);
        password    = encodeURIComponent(password);

        let body = `email=${email}&password=${password}`;
        console.log(body)
        auth.open('POST', '/php/auth/auth.php?action=login', true); 
        auth.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        auth.send(body);
    }
    afterAuth(){
        //Загружаем компоненты
        if(this.DateControl === undefined){
            this.DateControl = new DateControl(this.Application);
        }
        if(this.ToolBar === undefined){
            this.ToolBar = new ToolBar(this.Application);
        }
        if(this.TaskList === undefined){
            this.TaskList = new TaskList(this.Application);
        }
        if(this.SmartFridge === undefined){
            this.SmartFridge = new SmartFridge();
        }
        if(this.QRCam == undefined){
            this.QRCam = new QRCam();
        }
        if(this.NoteManager == undefined){
            this.NoteManager = new NoteManager();
        }
        
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
    updateProjects(callback = undefined){
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

                    //projectData.length = 0;
                    //TO DO
                    while(json.length){
                        projectData.push(json.pop());
                    }

                    Application.setProjectOptions();

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

                    //typeData.length = 0;
                    //TO DO
                    while(json.length){
                        typeData.push(json.pop());
                    }
                    
                    Application.setTypeOptions();

                    this.abort();
                }
            }
        }
        updTypes.open('GET', '/php/type/getTypes.php', true); 
        updTypes.send(null);
    }
    setProjectOptions(){
        let elements = $('.project-selector');
        for(let i = 0; i < elements.length; i++){
            let options = [];
            elements[i].innerHTML = null;
            for(let j = 0; j < projectData.length; j++){
                options.push(document.createElement('option'));
                options[j].setAttribute('value', projectData[j].projectID);
                options[j].innerHTML = projectData[j].project_name;
                elements[i].appendChild(options[j]);
            }
            if(options.length > 0){
                options[0].setAttribute('selected', '');
            }
        }
        this.setNotes();
    }
    setTypeOptions(){
        let elements = $('.type-selector');
        for(let i = 0; i < elements.length; i++){
            let options = [];
            elements[i].innerHTML = null;
            for(let j = 0; j < typeData.length; j++){
                options.push(document.createElement('option'));
                options[j].setAttribute('value', typeData[j].typeID);
                options[j].innerHTML = typeData[j].type_name;
                elements[i].appendChild(options[j]);
            }
            if(options.length > 0){
                options[0].setAttribute('selected', '');
            }
        }
        this.setNotes();
    }
    setNotes(){
        if(this.TypesAndOptions){
            this.TypesAndOptions = false;
            return Application.NoteManager.dload();
        }
        this.TypesAndOptions = true;
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
            console.warn('ToolBar: Invalide Date Detected!');
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

        //this.getByDate(Date.now());
		//this.loadByDate(Date.now());

		//DO TO save in local storage
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
                            console.log(this.responseText);
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
        var addTaskReq = new XMLHttpRequest();
        
        addTaskReq.onreadystatechange = function(){
            if (this.readyState == 4) { 
                if(this.status == 200) { 
                    let json;
                    try{
                        json = JSON.parse(this.responseText);
                    }
                    catch(e){
                        console.log(e);
                        console.log(this.responseText);
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
                    for(let i = taskData.length - 1; i >= 0; i++){
                        if(taskData[i].taskID == -1){
                            taskData[i].taskID = tempTask.taskID;
                            tempTask = {};
                        }
                    }
                    if(Object.keys(tempTask).length > 0){
                        taskData.push(tempTask);
                        Application.TaskList.scrollToTask(
                            Application.TaskList.draw(tempTask)
                        );
                    }

                    this.abort();
                }
            }
        }

        time_s = Application.DateControl.timeToFloat(time_s) * UTHou;
        time_d = Application.DateControl.timeToFloat(time_d) * UTHou;


        let tempTask = {
            date : Application.DateControl.selectedDate,
            description : descript,
            name : name,
            noteID : noteID,
            projectID : projectID,
            taskID : -1,
            time_d : time_d,
            time_r : time_r,
            time_s : time_s,
            typeID : typeID,
            taskID : -1
        }
        console.log(tempTask);
        taskData.push(tempTask);
        Application.TaskList.scrollToTask(
            Application.TaskList.draw(tempTask)
        );

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

class SmartFridge{
    constructor(){
        //Количество испортившихся продуктов
        this.overdue = 0;// TO DO подгрузка из кэша.
        this.checkCache();
        this.cleanCache();
        this.tableConteiner = $('#product-table-conteiner')[0];

        this.dload();
    }
    //Синхронизирует данные между сервером и кэшем
    synch(){
        this.checkCache();
        this.cleanCache();
        //TO DO
    }
    //Получает данные от сервера и добавляет их в кеш
    dload(){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function(){
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
                    
                    Application.SmartFridge.clean();

                    let isset = false;
                    let object = null;
                    let origin_len = productData.length;
                    
                    for(let j, i = 0; i < json.length; i++){
                        isset = false;
                        //TO DO бинарный поиск
                        for(j = 0; j < origin_len; j++){
                            if(productData[j].productID == json[i].productID){
                                isset = true;
                                break;
                            }
                        }
                        object = {
                            productID: parseInt(json[i].productID),
                            userID : userData.userID,
                            productName : json[i].productName,
                            productTypeID : parseInt(json[i].productTypeID),
                            productTime_s : json[i].productTime_s,
                            productTime_d : parseInt(json[i].productTime_d),
                            productOverdue : 
                                Date.now() > DateAddDays(json[i].productTime_s, json[i].productTime_d).getTime(),
                            confirmed : false
                        };
                        if(!isset){
                            productData.push(object);
                        }
                        else{
                            productData[j] = object;
                        }
                    }

                    Application.SmartFridge.draw();

                    this.abort();
                    return;
                }
            }
        }
        
        ajax.open('GET', '/php/product/getProducts.php', true);
        ajax.send();
    }
    //Отправляет данные на сервер 
    uload(){
        //TO DO
    }
    //Проверяет продукты на испорченность, изменяет их статус и возвращает количество новых испорченных
    checkCache(){
        let dateToday = new Date(Date.now());
        let countOverdue = 0;
        for(let i=0;i<productData.length;i++){
            if(!productData[i].productOverdue){
                if(dateToday >= DateAddDays(productData[i].productTime_s, productData[i].productTime_d)){
                    productData[i].productOverdue = true;
                    countOverdue++;
                }
            }
        }
        this.overdue += countOverdue;
        return countOverdue;
    }
    //Удаляет из кеша продукты, которое были отмечены, как удаленные.
    cleanCache(){
        for(let i=0;i<productData.length;i++){
            if(productData[i].productOverdue && productData[i].confirmed){
                productData[i] = [];
            }
        }
    }
    //добавляет все строки в таблицу
    draw(){
        let items = $('#product-table-conteiner > .table__row');
        for(let i = 1; i < items.length; i++){
            items[i].remove();
        }
        for(let i = 0; i < productData.length; i++){
            this.drawLine(
                productData[i].productID,
                productData[i].productName,
                productData[i].productTypeID,
                productData[i].productTime_s,
                productData[i].productTime_d,
                productData[i].productOverdue,
                0
            );
        }
    }
    //добавляет строку в таблицу
    drawLine(intID, name, intType, strDate, intDuration, boolOverdated, price){
        let overdate = DateAddDays(strDate, intDuration);
        overdate = `${overdate.getFullYear()}-${tcor(overdate.getMonth() + 1)}-${overdate.getDate()}`;
        
        this.tableConteiner.appendChild(
            tTableRow(intID, name, productType[intType], strDate, overdate, boolOverdated, price)
        );
    }
    //Разбивает строку с чека на массив с данными 
    parseStringOFD(strQRString){
        let array = strQRString.split('&');
        for(let i = 0; i < array.length; i++){
            array[i] = array[i].split('=');
            array[i].splice(0,1);
            array[i] = array[i][0];
        }
        return array;
    }
    //Очищает вывод в таблице
    clean(){
        let elements = $('#product-table-conteiner > div');
        for(let i = 1; i < elements.length; i++){
            elements[i].remove();
        }
    }
    //Демонстрационное добавление продуктов с заранее выбранным чеком
    demoOFDproduct(arrstrOFDData){
        var ofd = new XMLHttpRequest();
        ofd.onreadystatechange = function() {
            if (this.readyState == 4) {
                if(this.status == 200) {

                    if(this.responseText != 'false'){
                        tempScanned.push(this.responseText);
                        Application.SmartFridge.dload();
                    }
                    
                    this.abort();
                    return;
                }
            }
        }
        console.log(arrstrOFDData);
        ofd.open('GET', '/php/product/addProduct.php?fp=' + arrstrOFDData[4], true);
        ofd.send();
    }
}

class NoteManager{
    constructor() {
        this.noteDataTemp;
        this.notelist = $('#notelist')[0];
    }
    //Сохраняем локально заметку
    saveNote(){
        //TO DO
    }
    //Синхронизируем данные
    synch(){
        //TO DO
    }
    //Загружаем все записи
    dload() {
        var ajaxNote = new XMLHttpRequest();
        ajaxNote.onreadystatechange = function() {
            if (this.readyState == 4) {
                if(this.status == 200) {
                    let json;
                    try{
                        json = JSON.parse(this.responseText);
                    }
                    catch(e){
                        if(this.responseText != "NULL"){ console.log(e); }
                        this.abort();
                        return;
                    }

                    while(json.length){
                        noteData.push(json.pop());
                    }
                    
                    Application.NoteManager.clear();
                    Application.NoteManager.draw();

                    this.abort();
                    return;
                }
            }
        }
        ajaxNote.open('GET', '/php/note/getNote.php', true);
        ajaxNote.send();
    }
    //Отправляем записи
    uload() {
        //TO DO
    }
    //Очищаем вывод
    clear(){
        for(let i = 1; i < this.notelist.childElementCount; i++){
            this.notelist.children[i].remove();
        }
    }
    //Отображаем дерево тип-проект-заметка
    draw() {
        this.noteDataTemp = [...noteData];
        this.projectDataTemp = [...projectData];
        for(let i = 0; i < typeData.length; i++) {
            this.notelist.appendChild(
                this.drawType(typeData[i].type_name, typeData[i].typeID)
            );
        }
        for(let i = 0; i < this.noteDataTemp; i++){
            this.notelist.appendChild(
                this.drawNote(this.noteDataTemp[i].noteID, "Note ID: " + this.noteDataTemp[i].noteID)
            );
        }
        this.noteDataTemp.length = 0;
        this.projectDataTemp.length = 0;
    }
    //Строим дерево тип-проект-заметка
    drawType(name, typeID) {
        let nextType = {next : null};
        let parent = tNoteblock(name, 'notegr', nextType);
        for(let i = 0; i < this.projectDataTemp.length; i++){
            if(this.projectDataTemp[i].typeID == typeID){
                nextType.next.appendChild(
                    this.drawProject(
                        this.projectDataTemp[i].project_name,
                        typeID,
                        this.projectDataTemp[i].projectID
                    )
                );
                this.projectDataTemp.slice(i, 1);
            }
        }
        return parent;
    }
    //Строим дерево проект-заметка
    drawProject(name, typeID, projectID) {
        let nextType = {next : null};
        let parent = tNoteblock(name, 'notebl', nextType);
        for(let i = 0; i < this.noteDataTemp.length; i++){
            if(this.noteDataTemp[i].typeID == typeID && this.noteDataTemp[i].projectID == projectID){
                nextType.next.appendChild(
                    this.drawNote(this.noteDataTemp[i].noteID, this.noteDataTemp[i].note.slice(0, 20))
                );
                this.noteDataTemp.splice(i, 1);
            }
        }
        return parent;
    }
    //Строим дерево заметка
    drawNote(noteID, name) {
        let parent = tNoteblock(name, 'note');

        parent.setAttribute('onclick', 'openNote(this);openLayer(this)');
        parent.setAttribute('layer-call', 'note');
        parent.setAttribute('note-id', noteID);

        return parent;
    }
    //Получаем текст из заметки
    getNoteTextByID(ID){
        for(let i = 0; i < noteData.length; i++){
            if(noteData[i].noteID == ID){
                return noteData[i].note;
            }
        }
        return null;
    }
}

var video           = $('#qr-video')[0];
var camHasCamera    = $('#cam-has-camera')[0];
var camQrResult     = $('#cam-qr-result')[0]; 
var fileSelector    = $('#file-selector')[0];
var fileQrResult    = $('#file-qr-result')[0];

class QRScanner {
    static hasCamera() {
        return navigator.mediaDevices.enumerateDevices()
            .then(devices => devices.some(device => device.kind === 'videoinput'))
            .catch(() => false);
    }
    constructor(video, onDecode, canvasSize = QRScanner.DEFAULT_CANVAS_SIZE) {
        this.$video = video;
        this.$canvas = document.createElement('canvas');
        this._onDecode = onDecode;
        this._active = false;
        this._paused = false;

        this.$canvas.width = canvasSize;
        this.$canvas.height = canvasSize;
        this._sourceRect = {
            x: 0,
            y: 0,
            width: canvasSize,
            height: canvasSize
        };

        this._onCanPlay = this._onCanPlay.bind(this);
        this._onPlay = this._onPlay.bind(this);
        this._onVisibilityChange = this._onVisibilityChange.bind(this);

        this.$video.addEventListener('canplay', this._onCanPlay);
        this.$video.addEventListener('play', this._onPlay);
        document.addEventListener('visibilitychange', this._onVisibilityChange);

        this._qrWorker = new Worker(QRScanner.WORKER_PATH);
    }
    destroy() {
        this.$video.removeEventListener('canplay', this._onCanPlay);
        this.$video.removeEventListener('play', this._onPlay);
        document.removeEventListener('visibilitychange', this._onVisibilityChange);

        this.stop();
        this._qrWorker.postMessage({
            type: 'close'
        });
    }
    start() {
        if (this._active && !this._paused) {
            return Promise.resolve();
        }
        if (window.location.protocol !== 'https:') {
            console.warn('The camera stream is only accessible if the page is transferred via https.');
        }
        this._active = true;
        this._paused = false;
        if (document.hidden) {
            return Promise.resolve();
        }
        clearTimeout(this._offTimeout);
        this._offTimeout = null;
        if (this.$video.srcObject) {
            // camera stream already/still set
            this.$video.play();
            return Promise.resolve();
        }

        let facingMode = 'environment';
        return this._getCameraStream('environment', true)
            .catch(() => {
                facingMode = 'user';
                return this._getCameraStream();
            })
            .then(stream => {
                this.$video.srcObject = stream;
                this._setVideoMirror(facingMode);
            })
            .catch(e => {
                this._active = false;
                throw e;
            });
    }
    stop() {
        this.pause();
        this._active = false;
    }
    pause() {
        this._paused = true;
        if (!this._active) {
            return;
        }
        this.$video.pause();
        if (this._offTimeout) {
            return;
        }
        this._offTimeout = setTimeout(() => {
            const track = this.$video.srcObject && this.$video.srcObject.getTracks()[0];
            if (!track) return;
            track.stop();
            this.$video.srcObject = null;
            this._offTimeout = null;
        }, 300);
    }
    static scanImage(imageOrFileOrUrl, sourceRect=null, worker=null, canvas=null, fixedCanvasSize=false,
                     alsoTryWithoutSourceRect=false) {
        let createdNewWorker = false;
        let promise = new Promise((resolve, reject) => {
            if (!worker) {
                worker = new Worker(QRScanner.WORKER_PATH);
                createdNewWorker = true;
                worker.postMessage({ type: 'inversionMode', data: 'both' });
            }
            let timeout, onMessage, onError;
            onMessage = event => {
                if (event.data.type !== 'qrResult') {
                    return;
                }
                worker.removeEventListener('message', onMessage);
                worker.removeEventListener('error', onError);
                clearTimeout(timeout);
                if (event.data.data !== null) {
                    resolve(event.data.data);
                } else {
                    reject('QR code not found.');
                }
            };
            onError = (e) => {
                worker.removeEventListener('message', onMessage);
                worker.removeEventListener('error', onError);
                clearTimeout(timeout);
                const errorMessage = !e ? 'Unknown Error' : (e.message || e);
                reject('Scanner error: ' + errorMessage);
            };
            worker.addEventListener('message', onMessage);
            worker.addEventListener('error', onError);
            timeout = setTimeout(() => onError('timeout'), 3000);
            QRScanner._loadImage(imageOrFileOrUrl).then(image => {
                const imageData = QRScanner._getImageData(image, sourceRect, canvas, fixedCanvasSize);
                worker.postMessage({
                    type: 'decode',
                    data: imageData
                }, [imageData.data.buffer]);
            }).catch(onError);
        });

        if (sourceRect && alsoTryWithoutSourceRect) {
            promise = promise.catch(() => QRScanner.scanImage(imageOrFileOrUrl, null, worker, canvas, fixedCanvasSize));
        }

        promise = promise.finally(() => {
            if (!createdNewWorker) return;
            worker.postMessage({
                type: 'close'
            });
        });

        return promise;
    }
    setGrayscaleWeights(red, green, blue, useIntegerApproximation = true) {
        this._qrWorker.postMessage({
            type: 'grayscaleWeights',
            data: { red, green, blue, useIntegerApproximation }
        });
    }
    setInversionMode(inversionMode) {
        this._qrWorker.postMessage({
            type: 'inversionMode',
            data: inversionMode
        });
    }
    _onCanPlay() {
        this._updateSourceRect();
        this.$video.play();
    }
    _onPlay() {
        this._updateSourceRect();
        this._scanFrame();
    }
    _onVisibilityChange() {
        if (document.hidden) {
            this.pause();
        } else if (this._active) {
            this.start();
        }
    }
    _updateSourceRect() {
        const smallestDimension = Math.min(this.$video.videoWidth, this.$video.videoHeight);
        const sourceRectSize = Math.round(2 / 3 * smallestDimension);
        this._sourceRect.width = this._sourceRect.height = sourceRectSize;
        this._sourceRect.x = (this.$video.videoWidth - sourceRectSize) / 2;
        this._sourceRect.y = (this.$video.videoHeight - sourceRectSize) / 2;
    }
    _scanFrame() {
        if (!this._active || this.$video.paused || this.$video.ended) return false;
        requestAnimationFrame(() => {
            QRScanner.scanImage(this.$video, this._sourceRect, this._qrWorker, this.$canvas, true)
                .then(this._onDecode, error => {
                    if (this._active && error !== 'QR code not found.') {
                        console.error(error);
                    }
                })
                .then(() => this._scanFrame());
        });
    }
    _getCameraStream(facingMode, exact = false) {
        const constraintsToTry = [{
            width: { min: 1024 }
        }, {
            width: { min: 768 }
        }, {}];

        if (facingMode) {
            if (exact) {
                facingMode = { exact: facingMode };
            }
            constraintsToTry.forEach(constraint => constraint.facingMode = facingMode);
        }
        return this._getMatchingCameraStream(constraintsToTry);
    }
    _getMatchingCameraStream(constraintsToTry) {
        if (constraintsToTry.length === 0) {
            return Promise.reject('Camera not found.');
        }
        return navigator.mediaDevices.getUserMedia({
            video: constraintsToTry.shift()
        }).catch(() => this._getMatchingCameraStream(constraintsToTry));
    }
    _setVideoMirror(facingMode) {
        const scaleFactor = facingMode==='user'? -1 : 1;
        this.$video.style.transform = 'scaleX(' + scaleFactor + ')';
    }
    static _getImageData(image, sourceRect=null, canvas=null, fixedCanvasSize=false) {
        canvas = canvas || document.createElement('canvas');
        const sourceRectX = sourceRect && sourceRect.x? sourceRect.x : 0;
        const sourceRectY = sourceRect && sourceRect.y? sourceRect.y : 0;
        const sourceRectWidth = sourceRect && sourceRect.width? sourceRect.width : image.width || image.videoWidth;
        const sourceRectHeight = sourceRect && sourceRect.height? sourceRect.height : image.height || image.videoHeight;
        if (!fixedCanvasSize && (canvas.width !== sourceRectWidth || canvas.height !== sourceRectHeight)) {
            canvas.width = sourceRectWidth;
            canvas.height = sourceRectHeight;
        }
        const context = canvas.getContext('2d', { alpha: false });
        context.imageSmoothingEnabled = false;
        context.drawImage(image, sourceRectX, sourceRectY, sourceRectWidth, sourceRectHeight, 0, 0, canvas.width, canvas.height);
        return context.getImageData(0, 0, canvas.width, canvas.height);
    }
    static _loadImage(imageOrFileOrUrl) {
        if (imageOrFileOrUrl instanceof HTMLCanvasElement || imageOrFileOrUrl instanceof HTMLVideoElement
            || window.ImageBitmap && imageOrFileOrUrl instanceof window.ImageBitmap
            || window.OffscreenCanvas && imageOrFileOrUrl instanceof window.OffscreenCanvas) {
            return Promise.resolve(imageOrFileOrUrl);
        } else if (imageOrFileOrUrl instanceof Image) {
            return QRScanner._awaitImageLoad(imageOrFileOrUrl).then(() => imageOrFileOrUrl);
        } else if (imageOrFileOrUrl instanceof File || imageOrFileOrUrl instanceof URL
            ||  typeof(imageOrFileOrUrl)==='string') {
            const image = new Image();
            if (imageOrFileOrUrl instanceof File) {
                image.src = URL.createObjectURL(imageOrFileOrUrl);
            } else {
                image.src = imageOrFileOrUrl;
            }
            return QRScanner._awaitImageLoad(image).then(() => {
                if (imageOrFileOrUrl instanceof File) {
                    URL.revokeObjectURL(image.src);
                }
                return image;
            });
        } else {
            return Promise.reject('Unsupported image type.');
        }
    }
    static _awaitImageLoad(image) {
        return new Promise((resolve, reject) => {
            if (image.complete && image.naturalWidth!==0) {
                resolve();
            } else {
                let onLoad, onError;
                onLoad = () => {
                    image.removeEventListener('load', onLoad);
                    image.removeEventListener('error', onError);
                    resolve();
                };
                onError = () => {
                    image.removeEventListener('load', onLoad);
                    image.removeEventListener('error', onError);
                    reject('Image load error');
                };
                image.addEventListener('load', onLoad);
                image.addEventListener('error', onError);
            }
        });
    }
}
QRScanner.DEFAULT_CANVAS_SIZE = 400;
QRScanner.WORKER_PATH = 'scripts/qr-scanner-worker.min.js';

class QRCam{
    constructor(){
        this.scanner = undefined;
        this.scanCam();
        this.scanFile();
    }
    
    scanCam(){
        if(this.scanner == undefined){
            // ####### Web Cam Scanning #######
            QRScanner.hasCamera();//.then(hasCamera => camHasCamera.textContent = hasCamera);
            this.scanner = new QRScanner(video, result => setResult(camQrResult, result));
            this.scanner.start();
            $('#inversion-mode-select')[0].addEventListener('change', event => {
                this.scanner.setInversionMode(event.target.value);
            });
        }
        else{
            this.scanner.start();
        }
    }

    scanFile(){
        // ####### File Scanning #######
        //TO DO
        fileSelector.addEventListener('change', event => {
            const file = fileSelector.files[0];
            if (!file) {
                return;
            }
            QRScanner.scanImage(file)
                .then(result => setResult(fileQrResult, result))
                .catch(e => setResult(fileQrResult, e || 'No QR code found.'));
        });
    }

    stop(){
        if(this.scanner != undefined){
            this.scanner.stop();
        }
    }
}

function setResult(label, result) {
    //label.textContent = result;
    //alert(result);
    closeLayer();
    let array = Application.SmartFridge.parseStringOFD(result);

    for(let i = 0; i < tempScanned.length; i++){
        if(tempScanned[i] == array[4]){
            alert("Данный чек уже зарегистрирован!");
            return;
        }
    }
    

    Application.SmartFridge.demoOFDproduct(array);

}

function DateAddDays(strDate, intDays){
    return new Date(new Date(strDate).getTime() + UTDay*1000*intDays);
}