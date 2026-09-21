const addbalance = document.getElementById("addbalance")
const modal = document.getElementById("modal")
const CloseBtn = document.getElementById("popupCloseBtn")




addbalance.addEventListener("click", ()=>{
    if(modal.classList.contains("close")){
        modal.classList.remove("close")
        modal.classList.add("popupWindowContainer")
    }
    else{
        modal.classList.remove("popupWindowContainer")
        modal.classList.add("close")
    }
})  

CloseBtn.addEventListener("click", ()=>{
        modal.classList.remove("popupWindowContainer")
        modal.classList.add("close")
})



