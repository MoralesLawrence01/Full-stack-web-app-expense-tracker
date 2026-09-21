const form = document.getElementById("form")
const submitButton = document.getElementById("submitButton")

form.addEventListener("submit", async (e)=>{
    e.preventDefault()
    const forms = new FormData(form)
    console.log(forms.get("username"))
    if(forms.get("password") === forms.get("cPassword")){

        const register = await fetch("http://localhost:3000/register",{
            
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({
                userName: forms.get("username"),
                password: forms.get("password")
            })
        })
    }
    
})