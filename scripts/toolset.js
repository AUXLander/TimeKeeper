function $(qSelector){
    return document.querySelectorAll(qSelector);
}
function click(qSelector, func){
    let els = $(qSelector);
    for(let i=0;i<els.length;i++){
        els[i].addEventListener("click", func, true);
    }
}