const expenseForm = document.getElementById("expenseForm")
const addBalanceForm = document.getElementById("addBalanceForm")
const balanceOutput = document.getElementById("balanceOutput")
const tableBody = document.getElementById("tableBody")
const modal2 = document.getElementById("modal2")
const addBalanceContainerEdit = document.getElementById("addBalanceContainerEdit")
const popupCloseBtnEdit = document.getElementById("popupCloseBtnEdit")
const savingsOutput = document.getElementById("savingsOutput")
const url = "https://expense-tracker-43zt.onrender.com/"


const userId = localStorage.getItem("userId")

if(userId === null){
    window.location.href = "index.html"
}

const userBalance = async () => {
    const balance = await fetch (`${url}balance`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        userId: userId
        })
    })
    const res = await balance.json()
    if (Number(res.balance) < 0){
        balanceOutput.style.color = "#f80101b4"
        balanceOutput.textContent =  `₱${res.balance}`
    }
    else if(Number(res.balance) >= 0){
        balanceOutput.style.color = "#0f3528"
        balanceOutput.textContent =  `₱${res.balance}`
    }
    
}

const getSavings = async () => {
    const savings = await fetch(`${url}getSavings/${userId}`)
    const res = await savings.json()
    savingsOutput.textContent = res.savings
}   
getSavings()

const renderTransaction = async () =>{
    tableBody.innerHTML = ``
    const transactions = await fetch(`${url}renderTransaction/${userId}`)
    const res = await transactions.json()   
    for (let i = res.length-1; res.length-13 < i; i--){
        const row = document.createElement("tr")

        const tdAmount = document.createElement("td")
        tdAmount.textContent = res[i].amount
        const arrowImg = document.createElement("img")
        if (res[i].amount > 0){
            arrowImg.src = "icons/arrowUp.svg"
        }else{
            arrowImg.src = "icons/arrowDown.svg"
        }
        tdAmount.appendChild(arrowImg)
        row.appendChild(tdAmount)

        const tdDesc = document.createElement("td")
        tdDesc.textContent = res[i].description
        row.appendChild(tdDesc)

        const tdDate = document.createElement("td")
        tdDate.textContent = res[i].date.split('T')[0]
        row.appendChild(tdDate)

        const editBtn = document.createElement("button")
        const dltBtn = document.createElement("button")
        const dltImg = document.createElement("img")
        const editImg = document.createElement("img")
        dltBtn.classList.add("editBtn")
        editBtn.classList.add("editBtn")
        editBtn.id = "editBtn"
        dltImg.src = "icons/delete.svg"
        editImg.src = "icons/edit.svg"
        dltBtn.appendChild(dltImg)
        editBtn.appendChild(editImg)

        dltBtn.addEventListener("click", async() => {
            const deleteTran = await fetch(`${url}deleteTransaction/${res[i]._id}/${userId}`, {
                method: "DELETE"
            })
            const dltData = await deleteTran.json() 
            console.log(dltData)
            renderTransaction()
            userBalance()
        })

        editBtn.addEventListener("click" , async () => {
            addBalanceContainerEdit.innerHTML = ""
            const addBalanceFormEdit = document.createElement("form")
            addBalanceFormEdit.id = "addBalanceFormEdit"

            //input
            const editHeader = document.createElement("p")
            editHeader.id = "addBalanceHeaderEdit"
            editHeader.textContent = "Edit Transaction"

            const balanceInput = document.createElement("input") 
            balanceInput.id = "balanceInputEdit" 
            balanceInput.type = "number"
            balanceInput.value = res[i].amount
            balanceInput.name = "amount"
            balanceInput.required = true

            const descriptionInputLabel = document.createElement("label")
            descriptionInputLabel.id = "descriptionInputLabelEdit"
            descriptionInputLabel.setAttribute("for", "descriptionInput")
            descriptionInputLabel.textContent = "Description:"

            const descriptionInput = document.createElement("input") 
            descriptionInput.id = "descriptionInputEdit" 
            descriptionInput.type = "text"
            descriptionInput.value = res[i].description
            descriptionInput.name = "description"
            descriptionInput.required = true
            //dateContainer
            const balanceDateContainerEdit= document.createElement("div")
            balanceDateContainerEdit.id = "balanceDateContainerEdit"

            const todayRdbtnEdit = document.createElement("input")
            todayRdbtnEdit.name = "todayRdbtnEdit"
            todayRdbtnEdit.type = "radio"
            todayRdbtnEdit.name = "dateRdBtn"
            todayRdbtnEdit.value = "dateToday"
            todayRdbtnEdit.required = true

            const todayDateLabel = document.createElement("label")
            todayDateLabel.setAttribute("for", "todayRdbtnEdit")
            todayDateLabel.textContent = "today"

            const chooseDateRdBtn = document.createElement("input")
            chooseDateRdBtn.type = "radio"
            chooseDateRdBtn.name = "dateRdBtn"
            chooseDateRdBtn.value = "chooseDate"
            chooseDateRdBtn.required = true

            const editDate = document.createElement("input")
            editDate.type = "date"
            editDate.name = "date"

            const addBalanceBtnEdit = document.createElement("button")
            addBalanceBtnEdit.id = "addBalanceBtnEdit"
            addBalanceBtnEdit.type ="submit"
            addBalanceBtnEdit.textContent = "Add"

            addBalanceFormEdit.appendChild(editHeader)
            addBalanceFormEdit.appendChild(balanceInput)
            addBalanceFormEdit.appendChild(descriptionInputLabel)
            addBalanceFormEdit.appendChild(descriptionInput)
            balanceDateContainerEdit.appendChild(todayRdbtnEdit)
            balanceDateContainerEdit.appendChild(todayDateLabel)
            balanceDateContainerEdit.appendChild(chooseDateRdBtn)
            balanceDateContainerEdit.appendChild(editDate)
            addBalanceFormEdit.appendChild(balanceDateContainerEdit)
            addBalanceFormEdit.appendChild(addBalanceBtnEdit)
            addBalanceContainerEdit.appendChild(addBalanceFormEdit)

            if (modal2.classList.contains("closeEdit")){
                modal2.classList.remove("closeEdit")
                modal2.classList.add("editPopupWindowContainer")
            }
            popupCloseBtnEdit.addEventListener("click", ()=>{
                modal2.classList.remove("editPopupWindowContainer")
                modal2.classList.add("closeEdit")
            })

            
            addBalanceFormEdit.addEventListener("submit", async(e) => {
                e.preventDefault()
                const editForms = new FormData(addBalanceFormEdit)

                let date
                if (editForms.get("dateRdBtn") === "dateToday"){
                    const today = new Date()

                    const year = today.getFullYear()
                    const mm = String(today.getMonth() + 1).padStart(2, '0');
                    const dd = String(today.getDate()).padStart(2, '0'); 

                    date = `${year}-${mm}-${dd}`
                }
                else if(editForms.get("dateRdBtn") === "chooseDate"){
                    date = editForms.get("date")
                }

                const editTran = await fetch(`${url}editTransaction/${res[i]._id}/${userId}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        amount: editForms.get("amount"),
                        description: editForms.get("description"),
                        date: date,
                    })

                })
                renderTransaction()
                userBalance()
            })

        })
        row.addEventListener("mouseenter", () => {
            tdDate.appendChild(editBtn)
            tdDate.appendChild(dltBtn)
            row.style.background = "gray"
        })

        row.addEventListener("mouseleave", () => {
            tdDate.removeChild(editBtn)
            tdDate.removeChild(dltBtn)
            row.style.background = "#25282E"
        })

        tableBody.appendChild(row)

    }
}
renderTransaction()
userBalance()

expenseForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const form = new FormData(expenseForm)
    let date
    if (form.get("dateRdBtn") === "dateToday"){
         const today = new Date()

         const year = today.getFullYear()
         const mm = String(today.getMonth() + 1).padStart(2, '0');
         const dd = String(today.getDate()).padStart(2, '0'); 

         date = `${year}-${mm}-${dd}`
    }
    else if(form.get("dateRdBtn") === "chooseDate"){
        date = form.get("date")
    }
    const amount = String(`-${form.get("amount")}`)
    const negativeAmount = Number(amount)

    const addExpense = await fetch(`${url}expense`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            amount: negativeAmount,
            description: form.get("description"),
            date: date,
            userId: userId,
        })
    })
    const res = await addExpense.json()
    console.log(res)
    userBalance()
    renderTransaction()

})

addBalanceForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const balanceForm = new FormData(addBalanceForm)
    let date
    if (balanceForm.get("dateRdBtn") === "dateToday"){
         const today = new Date()

         const year = today.getFullYear()
         const mm = String(today.getMonth() + 1).padStart(2, '0');
         const dd = String(today.getDate()).padStart(2, '0'); 

         date = `${year}-${mm}-${dd}`
    }
    else if(balanceForm.get("dateRdBtn") === "chooseDate"){
        date = balanceForm.get("date")
        
    }

    const addExpense = await fetch(`${url}addBalance`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            amount: balanceForm.get("amount"),
            description: balanceForm.get("description"),
            date: date,
            userId: userId,
        })
    })
    userBalance()  
    renderTransaction()     
})

const addsavingsbtn = document.getElementById("addsavings")
const savingsModal = document.getElementById("savingsModal")
const savingsForm = document.getElementById("savingsForm")
const invalidSavingsContainer = document.getElementById("invalidSavingsContainer")
const invalidSavingsBtn = document.getElementById("invalidSavingsBtn")
const savingsAmount = document.getElementById("savingsAmount")


addsavingsbtn.addEventListener("click", () =>{
    if(savingsModal.classList.contains("close")){
        savingsModal.classList.remove("close")
        savingsModal.classList.add("popupSavingsContainer")
    }
    else if(savingsModal.classList.contains("popupSavingsContainer")){
        savingsModal.classList.remove("popupSavingsContainer")
        savingsModal.classList.add("close")
    }
})

savingsForm.addEventListener("submit", async (e) => {

    e.preventDefault()
    const savings = new FormData(savingsForm)

    const addSavings = await fetch(`${url}savings/${userId}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            savings: savings.get("savingsAmount")
        })
    })
    const res = await addSavings.json()
    if (res.ok === true){
        userBalance()
        getSavings()
        savingsAmount.value = ""
        savingsModal.classList.remove("popupSavingsContainer")
        savingsModal.classList.add("close")
    }else{
        savingsModal.classList.remove("popupSavingsContainer")
        savingsModal.classList.add("close")
        invalidSavingsContainer.classList.remove("close")
        invalidSavingsContainer.classList.add("popupInvalidSavingContainer")
        savingsAmount.value = ""
    }
    

})

invalidSavingsBtn.addEventListener("click", () => {
    invalidSavingsContainer.classList.remove("popupInvalidSavingContainer")
    invalidSavingsContainer.classList.add("close")
})

const withdrawSavings = document.getElementById("withdrawSavings")
const withdrawModal = document.getElementById("withdrawModal")
const withdrawForm = document.getElementById("withdrawForm")
const invalidWithdrawContainer = document.getElementById("invalidWithdrawContainer")
const invalidWithdrawBtn = document.getElementById("invalidWithdrawBtn")
const withdrawAmount = document.getElementById("withdrawAmount")

withdrawSavings.addEventListener("click", () =>{
    if(withdrawModal.classList.contains("close")){
        withdrawModal.classList.remove("close")
        withdrawModal.classList.add("popupSavingsContainer")
    }
    else if(withdrawModal.classList.contains("popupSavingsContainer")){
        withdrawModal.classList.remove("popupSavingsContainer")
        withdrawModal.classList.add("close")
    }
})

withdrawForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const withdraw = new FormData(withdrawForm)
    
    const addWithdraw = await fetch(`${url}withdrawSavings/${userId}`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            amount: withdraw.get("withdrawAmount")
        })
    })
    const res = await addWithdraw.json()
    if(res.ok === true){
        userBalance()
        getSavings()
        withdrawModal.classList.remove("popupSavingsContainer")
        withdrawModal.classList.add("close")
        withdrawAmount.value = ""
    }else{
        withdrawModal.classList.remove("popupSavingsContainer")
        withdrawModal.classList.add("close")
        invalidWithdrawContainer.classList.remove("close")
        invalidWithdrawContainer.classList.add("popupInvalidWithdrawContainer")
        withdrawAmount.value = ""
    }

})

invalidWithdrawBtn.addEventListener("click", () => {
    invalidWithdrawContainer.classList.remove("popupInvalidWithdrawContainer")
    invalidWithdrawContainer.classList.add("close")
})
