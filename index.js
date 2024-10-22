const textEl = document.getElementById("text-el")
const saveBtn = document.getElementById("save-btn")

const deleteAllBtn = document.getElementById("delete-all-btn")
const printsEL = document.getElementById("prints-el")
const localStoragePrintsList = JSON.parse( localStorage.getItem("printsList") )
let printsList = []

/* Checks is list exists in local storage */
if (localStoragePrintsList) {
    printsList = localStoragePrintsList
    console.log(printsList)
    render(printsList)
} else {
    printsEL.innerHTML = "Add something..."
}

/* Saves page to local storage if a title is provided */
saveBtn.addEventListener("click", function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(textEl.value){
            printsList.push({title: textEl.value, url: tabs[0].url, id: uuidv4()})
            localStorage.setItem("printsList", JSON.stringify(printsList))
            render(printsList)
            textEl.value = ""
        } else {
            alert("Title input is empty!")
        }
    })
})

/* Removes printsList from loacl storage on double click of dealete all */
deleteAllBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    printsList = []
    render(printsList)
})

/* Renders printsList and delete button for each item */
function render(printsList) {
    let prints = ""
    printsList.forEach(print => {
        prints += `
            <div>
                <a target='_blank' href='${print.url}'>
                    ${print.title}
                </a>
                <button 
                    id="${print.id}" 
                    class="delete-item">
                x
                </button>
            </div>
        `
    })
    printsEL.innerHTML = prints

    const deleteItemBtn = document.querySelectorAll(".delete-item")
    deleteItemBtn.forEach(button => {
        button.addEventListener("click", function() {
            deleteItem(button.id)
        })
    })
}

/* Deletes item when its delete button is single clicked */
function deleteItem(id) {
    printsList = printsList.filter(print => print.id !== id)
    localStorage.setItem("printsList", JSON.stringify(printsList))
    render(printsList)
}

/* Generates unique id */
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}