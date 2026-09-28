const userName = document.getElementById("userName")
const logOutBtn = document.getElementById("logOutBtn")
const userId = localStorage.getItem("userId")
const url = "https://expense-tracker-43zt.onrender.com/"




const getName = async () => {
    const name = await fetch(`${url}name/${userId}`)
    const res = await name.json()
    console.log(res)
    userName.textContent = res.name
}
getName()

logOutBtn.addEventListener("click", () => {
    localStorage.removeItem("userId")
    window.location.href = "index.html"
})
