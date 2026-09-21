const form = document.getElementById("form")
const errorContainer = document.getElementById("errorContainer")c
const url = "https://expense-tracker-43zt.onrender.com/"

form.addEventListener("submit", async (e) =>{
    e.preventDefault()
    const forms = new FormData(form)
    const username = forms.get("username")
    const password = forms.get("password")
    const login = await fetch(`${url}login`, {
        method: "POST",
        headers:{"content-type": "application/json"},
        body: JSON.stringify({
            userName: username,
            password: password
        })
    })
    const data = await login.json()
    console.log(data)
    if (data.ok === true){
        localStorage.setItem("userId", data.userId)
        window.location.href = "dashboard.html"
    }
    else if (data.ok === false){
        errorContainer.innerHTML = ""
        const message = document.createElement("p")
        message.textContent = ""
        message.style.margin = 0
        message.textContent = data.message
        errorContainer.appendChild(message)
    }
})  
