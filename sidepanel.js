const backBtn = document.getElementById("backBtn")
const sidePanelHeader = document.getElementById("sidePanelHeader")
const list = document.querySelectorAll("#list")
// side panel collapse togglle
backBtn.addEventListener("click", ()=>{
    sidePanelHeader.classList.toggle("hide")
    list.forEach((item)=>{
        item.classList.toggle("hide")
    })
})