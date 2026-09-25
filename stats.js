const userId = localStorage.getItem("userId")
const barChart = document.getElementById("barChart")
const filter = document.querySelectorAll(".cir-tabs__r")
const url = "https://expense-tracker-43zt.onrender.com/"
const balance = document.getElementById("balance")
const overAllIncome = document.getElementById ("income")
const overAllExpense = document.getElementById("overAllExpense")
const savings = document.getElementById("savings")

const today = new Date()

const dateWeek = new Date()
const lastWeek= new Date(dateWeek.setDate(dateWeek.getDate() - 7))

const dateMonth = new Date()
const lastMonth = new Date(dateMonth.setMonth(dateMonth.getMonth() -1))

const dateYear = new Date()
const lastYear = new Date(dateYear.setMonth(dateYear.getMonth() -12))

const dltPopupBtnContainer = document.getElementById("dltPopupBtnContainer")
const deleteCard = document.getElementById("deleteCard")
const tableBody =document.getElementById("tableBody")

const renderCard = async () => {
    balance.innerHTML = ""
    overAllIncome.innerHTML = ""
    overAllExpense.innerHTML = ""
    savings.innerHTML = 0

    let income = 0
    let expense = 0
    const userBalance = await fetch(`${url}balance`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            userId: userId
        })
    })
    const res = await userBalance.json()
    balance.textContent = res.balance
    const userTransaction = await fetch (`${url}renderTransaction/${userId}`)
    const response = await userTransaction.json()
    for(let i = 0; i < response.length;i++){
        if (response[i].amount > 0){
            income += response[i].amount
        }
        else{
            expense += Math.abs(response[i].amount)
        }
    }
    overAllIncome.textContent = income
    overAllExpense.textContent = expense
}

renderCard()


const bar = 
    new Chart(barChart, {
    type: "bar",
    data: {
        labels: ["income" ,"expense"],
        datasets:[{
            data: [],
            backgroundColor: ["#10b72c", "#ef4444"],
            borderRadius: 8,
            borderColor: ["#8bff9f", "#ff9a9a"],
            borderWidth: 2,
            
        }]
    },
    options: {
        responsive: true
    }


})



const renderTransactionsChart = async () => {
    const transactions = await fetch(`${url}renderTransaction/${userId}`)
    const res = await transactions.json()
    let income = 0
    let expense = 0
    for (let i = 0; i < res.length; i++){
        if (res[i].amount > 0){
                income += res[i].amount
        }else{
            expense += Math.abs(Number(res[i].amount))
        }
    }   
    bar.data.datasets[0].data = [income, expense]
    bar.update()


    filter.forEach( (rdBtn) => {
    rdBtn.addEventListener("change", (e)=>{     
        if(e.target.id === "cir-r-all"){
            let income = 0
            let expense = 0
            for (let i = 0; i < res.length; i++){
                if (res[i].amount > 0){
                        income += res[i].amount
                }else{
                    expense += Math.abs(Number(res[i].amount))
                }
            }   
            bar.data.datasets[0].data = [income, expense]
            bar.update()
        }
        else if(e.target.id === "cir-r-year"){
            let income= 0
            let expense = 0
            for (let i = 0; i < res.length; i++){
                if(new Date(lastYear) < new Date(res[i].date)){
                    if (res[i].amount > 0){
                        income += res[i].amount
                    }else{
                        expense += Math.abs(Number(res[i].amount))
                    }
                }
            }
            bar.data.datasets[0].data = [income, expense]
            bar.update()

        }
        else if(e.target.id === "cir-r-month"){
            let income= 0
            let expense = 0
            for (let i = 0; i < res.length; i++){
                if(new Date(lastMonth) < new Date(res[i].date)){
                    if (res[i].amount > 0){
                        income += res[i].amount
                    }else{
                        expense += Math.abs(Number(res[i].amount))
                    }
                }
            }
            bar.data.datasets[0].data = [income, expense]
            bar.update()
        }
        else if(e.target.id === "cir-r-week"){
            let income= 0
            let expense = 0
            for (let i = 0; i < res.length; i++){
                if(new Date(lastWeek) < new Date(res[i].date)){
                    if (res[i].amount > 0){
                        income += res[i].amount
                    }else{
                        expense += Math.abs(Number(res[i].amount))
                    }
                }
            }
            bar.data.datasets[0].data = [income, expense]
            bar.update()
        }
        else if(e.target.id === "cir-r-day"){
            let income= 0
            let expense = 0
            for (let i = 0; i < res.length; i++){
                if(new Date(today).toDateString() === new Date(res[i].date).toDateString()){
                    if (res[i].amount > 0){
                        income += res[i].amount
                    }else{
                        expense += Math.abs(Number(res[i].amount))
                    }
                }
            }
            bar.data.datasets[0].data = [income, expense]
            bar.update()
        }
        
    })
})
}

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
        dltImg.classList.add("btnImg")
        editImg.classList.add("btnImg")
        dltBtn.appendChild(dltImg)
        editBtn.appendChild(editImg)

        dltBtn.addEventListener("click", async() => {
            dltPopupBtnContainer.innerHTML = ""
            const dltExtBtn = document.getElementById("dltExtBtn")
            const confirmDltBtn = document.createElement("button")
            confirmDltBtn.classList.add("card-button")
            confirmDltBtn.textContent = "Delete"

            if(deleteCard.classList.contains("dltHide")){
                deleteCard.classList.remove("dltHide")
                deleteCard.classList.add("dltShow")
                dltPopupBtnContainer.appendChild(confirmDltBtn)
            }
            else if(deleteCard.classList.contains("dltShow")){
                deleteCard.classList.remove("dltShow")
                deleteCard.classList.add("dltHide")
            }

            confirmDltBtn.addEventListener("click", async ()=>{
                const deleteTran = await fetch(`${url}${res[i]._id}/${userId}`, {
                method: "DELETE"
                })
                deleteCard.classList.remove("dltShow")
                deleteCard.classList.add("dltHide")
                renderTransaction()
                renderCard()
                renderTransactionsChart()
            })

            dltExtBtn.addEventListener("click", () => {
                deleteCard.classList.remove("dltShow")
                deleteCard.classList.add("dltHide")
            })
            
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

                const editTran = await fetch(`${url}${res[i]._id}/${userId}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        amount: editForms.get("amount"),
                        description: editForms.get("description"),
                        date: date,
                    })

                })
                renderTransaction()
                renderCard()
                renderTransactionsChart()
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


renderTransactionsChart()




