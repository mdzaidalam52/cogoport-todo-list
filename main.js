let todos = []
let filterComplete = "All"
let filterPriority = "All"
let filterCategory
let filterTag
let filterTask

let sortBasis = "createdDate"

const randomKeyGenerator = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < charactersLength) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const filterIncompleteTasks = () => {
    const everytodo = JSON.parse(localStorage.getItem('todos'))
    todos = everytodo.filter(d => !d.completed)
}

const filterCompletedTasks = () => {
    const everyTodo = JSON.parse(localStorage.getItem('todos'))
    console.log('hey')
    todos = everyTodo.filter(d => d.completed)
}

const getCompleteAndIncompleteTasks = () => {
    todos = JSON.parse(localStorage.getItem("todos"))
}

const filterHighPriorityTasks = () => {
    todos = todos.filter(d => d.priority === "High")
}

const filterMediumPriorityTasks = () => {
    todos = todos.filter(d => d.priority === "Medium")
}

const filterLowPriorityTasks = () => {
    todos = todos.filter(d => d.priority === "Low")
}

const sortBasedOnDueDate = () => {
    todos.sort((a, b) => {
        let dueDate1 = a.dueDate.split("/")
        dueDate1 = new Date(dueDate1[2], dueDate1[1]-1, dueDate1[0])
        let dueDate2 = b.dueDate.split("/")
        dueDate2 = new Date(dueDate2[2], dueDate2[1]-1, dueDate2[0])
        return dueDate1 - dueDate2
    })

}

const sortBasedOnPriority = () => {
    todos.sort((a, b) => {
        if(a.priority === "High") {
            return -1
        } else if(b.priority === "High") {
            return 1
        } else if(a.priority === "Medium") {
            return -1
        } else if(b.priority === "Medium") {
            return 1
        } else {
            return 0
        }
    })
}

const sortBasedOnCrtdt = () => {
    todos.sort((a, b) => {
        let crtdDate1 = a.createdDate.split("/")
        crtdDate1 = new Date(crtdDate1[2], crtdDate1[1]-1, crtdDate1[0])
        let crtdDate2 = b.createdDate.split("/")
        crtdDate2 = new Date(crtdDate2[2], crtdDate2[1]-1, crtdDate2[0])
        return crtdDate1 - crtdDate2
    })
}

const getTodosBasedOnFilter = () => {
    switch (filterComplete) {
        case "incomplete":
            filterIncompleteTasks()
            break;
        case "complete": 
            filterCompletedTasks()
            break;
        default:
            getCompleteAndIncompleteTasks()
            break;
    }

    switch (filterPriority) {
        case "High":
            filterHighPriorityTasks()
            break
        case "Medium":
            filterMediumPriorityTasks()
            break
        case "Low":
            filterLowPriorityTasks()
            break
        default: 
            break
    }

    if(filterCategory)
        todos = todos.filter(d => d.category && d.category.toUpperCase().includes(filterCategory.toUpperCase()))

    if(filterTag){
        todos = todos.filter(d => {
            return d.tags && d.tags.filter(tag => {
                return tag.toUpperCase().includes(filterTag.toUpperCase())
            }).length > 0
        })
    }

    if(filterTask) {
        console.log("kem chho")
        todos = todos.filter(d => {
            return d.task.toUpperCase().includes(filterTask.toUpperCase()) || 
                d.subTasks.filter(subTask => {
                    return subTask.task.toUpperCase().includes(filterTask.toUpperCase())
                }).length > 0   
        })
    }
}

const sort = () => {
    switch (sortBasis) {
        case "dueDate": 
            sortBasedOnDueDate()
            break;
        case "priority": 
            sortBasedOnPriority()
            break;
        case "createdDate":
            sortBasedOnCrtdt()
            break;
    }
}

const header = () => {
    return `<li>
                <div class="task-section">
                    <span class="task">Tasks</span>
                    <span class="category">Category</span>
                    <span class="tags">Tags</span>
                    <span class="priority">Priority</span>
                    <span class="dueDate">Due Date</span>
                    <span class="createdDate">Created Date</span>
                </div>
            </li>`
}

const getOptions = (value) => {
    let option = document.createElement("option")
    option.value = value
    option.innerText = value
    return option
}

const getSubTaskElement = (task) => {
    const subTaskSection = document.createElement("div")
    const completeBox = document.createElement("input")
    const taskElement = document.createElement("span")

    completeBox.type = "checkbox"
    taskElement.innerHTML = task.task
    completeBox.checked = task.completed
    completeBox.style.marginRight = "10px"
    if(task.completed) {
        taskElement.style.textDecoration = "line-through"
    }
    subTaskSection.appendChild(completeBox)
    subTaskSection.appendChild(taskElement)
    completeBox.addEventListener("click", (e) => {
        markSubTaskComplete(task.id, e.target.checked)
    })

    subTaskSection.style.padding = "10px"
    return subTaskSection
}

const getEditableSubTaskElement = (tasks) => {
    const subTasksSection = []

    for(let i = 0; i < tasks.length; i += 1) {
        const subTaskSection = document.createElement("div")
        const taskElement = document.createElement("input")

        taskElement.value = tasks[i].task
        subTaskSection.appendChild(taskElement)
        taskElement.addEventListener("input", (e) => {
            tasks[i].task = e.target.value
        })

        subTaskSection.style.padding = "10px"
        subTasksSection.push(subTaskSection)
    }
    return subTasksSection
}

const refreshTasks = () => {
    document.getElementsByClassName("list-group")[0].innerHTML = header()

    getTodosBasedOnFilter()
    sort()
    todos.forEach(task => {
        if(task.isEditable) {
            let listGroup = document.getElementsByClassName("list-group")[0]
            let listItem = document.createElement("li")
            let btnDiv = document.createElement("div")
            let taskInputElement = document.createElement("input")
            let saveBtn = document.createElement("button")
            let resetBtn = document.createElement("button")
            let categoryInputElement = document.createElement("input")
            let tagInputElement = document.createElement("input")
            let prioritySelectElement = document.createElement("select")
            let dateInputElement = document.createElement("input")
            let taskSectionElement = document.createElement("div")

            taskInputElement.className = "task"
            categoryInputElement.className = "category"
            btnDiv.className = "buttons"
            tagInputElement.className = "tags"
            listItem.classList.add("list-group-item")
            taskInputElement.className = "task"
            prioritySelectElement.className = "priority"
            dateInputElement.className = "dueDate"
            taskSectionElement.className = "task-section"
            
            categoryInputElement.placeholder = "Category"
            tagInputElement.placeholder = "Tags"            
            taskInputElement.defaultValue = task.task
            saveBtn.innerText = "Save"
            resetBtn.innerText = "Reset"
            categoryInputElement.value = task.category ? task.category : ""
            tagInputElement.value = task.tags ? task.tags : ""
            dateInputElement.value = task.dueDate
            const subTasks = getEditableSubTaskElement(task.subTasks)

            prioritySelectElement.appendChild(getOptions("High")) 
            prioritySelectElement.appendChild(getOptions("Medium")) 
            prioritySelectElement.appendChild(getOptions("Low"))
            btnDiv.appendChild(saveBtn)
            btnDiv.appendChild(resetBtn)
            taskSectionElement.appendChild(taskInputElement)
            taskSectionElement.appendChild(categoryInputElement)
            taskSectionElement.appendChild(tagInputElement)
            taskSectionElement.appendChild(prioritySelectElement)
            taskSectionElement.appendChild(dateInputElement)
            taskSectionElement.appendChild(btnDiv)
            listItem.appendChild(taskSectionElement)
            for(let i = 0; i < subTasks.length; i+=1) {
                listItem.appendChild(subTasks[i])
            }
            listGroup.appendChild(listItem)
            
            saveBtn.addEventListener("click", () => {
                const data = {
                    task: taskInputElement.value,
                    dueDate: dateInputElement.value.replace("-", "/"),
                    priority: prioritySelectElement.value,
                    tags: tagInputElement.value.split(","),
                    category: categoryInputElement.value,
                    subTasks: task.subTasks
                }
                editAndSaveTask(task.key, data)
            })
            resetBtn.addEventListener("click", () => {
                resetEditTask(task.key)
            })
        } else {
            let listGroup = document.getElementsByClassName("list-group")[0]
            let listItem = document.createElement("li")
            let completeBox = document.createElement("input")
            let taskElement = document.createElement("span")
            let btnDiv = document.createElement("div")
            let crtdTsElement = document.createElement("span")
            let dueDateElement = document.createElement("span")
            let priorityElement = document.createElement("span")
            let deleteBtn = document.createElement("button")
            let editBtn = document.createElement("button")
            let categoryElement = document.createElement("span")
            let tagsElement = document.createElement("span")
            let taskSectionElement = document.createElement("div")

            btnDiv.className = "buttons"
            crtdTsElement.className = "createdDate"
            dueDateElement.className = "dueDate"
            taskElement.className = "task"
            priorityElement.className = "priority"
            categoryElement.className = "category"
            tagsElement.className = "tags"
            taskSectionElement.className = "task-section"
            
            completeBox.type = "checkbox"
            completeBox.checked = task.completed
            if(dueDatePassed(task) && !task.completed) {
                listItem.style.backgroundColor = '#ffc0c0'
            }
            if(task.completed) {
                taskElement.style.textDecoration = "line-through"
            }
            taskElement.innerText = task.task
            crtdTsElement.innerHTML = task.createdDate
            dueDateElement.innerHTML = task.dueDate
            deleteBtn.innerText = "Delete"
            editBtn.innerText = "Edit"
            priorityElement.innerHTML = task.priority
            categoryElement.innerHTML = task.category ? task.category : ""
            tagsElement.innerHTML = task.tags.join(",")

            btnDiv.appendChild(editBtn)
            btnDiv.appendChild(deleteBtn)
            taskSectionElement.appendChild(completeBox)
            taskSectionElement.appendChild(taskElement)
            taskSectionElement.appendChild(categoryElement)
            taskSectionElement.appendChild(tagsElement)
            taskSectionElement.appendChild(priorityElement)
            taskSectionElement.appendChild(dueDateElement)
            taskSectionElement.appendChild(crtdTsElement)
            taskSectionElement.appendChild(btnDiv)
            listItem.appendChild(taskSectionElement)
            for(let i = 0; i < task.subTasks.length; i+=1) {
                listItem.append(getSubTaskElement(task.subTasks[i]))
            }
            listGroup.appendChild(listItem)    
            deleteBtn.addEventListener('click', () => {
                deleteTask(task.key)
            })  
            editBtn.addEventListener('click', () => {
                editTask(task.key)
            })
            completeBox.addEventListener('click', (e) => {
                markTaskComplete(task.key, e.target.checked)
            })
        }

    })
}

const deleteTask = (key) => {
    let everyTodo = JSON.parse(localStorage.getItem("todos"))
    everyTodo = everyTodo.filter(todo => {
        return todo.key !== key
    })
    localStorage.setItem("todos", JSON.stringify(everyTodo))
    refreshTasks()
}

const editTask = (key) => {
    let everyTodo = JSON.parse(localStorage.getItem("todos"))
    for(var i = 0; i < everyTodo.length; i += 1) {
        if(everyTodo[i].key === key) {
            everyTodo[i].isEditable = true
            break;
        }
    }
    localStorage.setItem("todos", JSON.stringify(everyTodo))
    refreshTasks()
}

const resetEditTask = (key) => {
    let everyTodo = JSON.parse(localStorage.getItem("todos"))
    for(var i = 0; i < everyTodo.length; i += 1) {
        if(everyTodo[i].key === key) {
            everyTodo[i].isEditable = false
            break;
        }
    }
    localStorage.setItem("todos", JSON.stringify(everyTodo))
    refreshTasks()
}

const markTaskComplete = (key, checked) => {
    const everyTodo = JSON.parse(localStorage.getItem("todos"))
    for(var i = 0; i < everyTodo.length; i += 1) {
        if(everyTodo[i].key === key) {
            everyTodo[i].completed = checked
            break;
        }
    }
    localStorage.setItem("todos", JSON.stringify(everyTodo))
    refreshTasks()
}

const markSubTaskComplete = (key, checked) => {
    const everyTodo = JSON.parse(localStorage.getItem("todos"))
    for(var i = 0; i < everyTodo.length; i += 1) {
        for(var j = 0; j < everyTodo[i].subTasks.length; j += 1) {
            if(key === everyTodo[i].subTasks[j].id) {
                everyTodo[i].subTasks[j].completed = !everyTodo[i].subTasks[j].completed
            }
        }
    }
    localStorage.setItem("todos", JSON.stringify(everyTodo))
    refreshTasks()
}

const editAndSaveTask = (key, data) => {
    let everyTodo = JSON.parse(localStorage.getItem("todos"))
    for(var i = 0; i < everyTodo.length; i += 1) {
        if(everyTodo[i].key === key) {
            everyTodo[i].isEditable = false
            everyTodo[i].task = data.task
            everyTodo[i].category = data.category
            everyTodo[i].tags = data.tags
            everyTodo[i].priority = data.priority
            everyTodo[i].dueDate = data.dueDate
            everyTodo[i].subTasks = data.subTasks
        }
    }
    localStorage.setItem("todos", JSON.stringify(everyTodo))
    refreshTasks()
}

const dueDatePassed = (task) => {
    let dueDate = task.dueDate.split("/")
    let currentDate = new Date()
    currentDate.setHours(0,0,0,0)
    return (currentDate > new Date(dueDate[2], dueDate[1]-1, dueDate[0]).getTime())
}

document.getElementById("addTask").addEventListener("click", () => {
    let task = document.getElementById("todo").value.trim()
    let dueDate = new Date(document.getElementById("dateInput").value).toLocaleDateString()
    let priority = document.getElementById("priority").value.trim()
    let category = document.getElementById("category").value.trim()
    let tags = document.getElementById("tags").value.split(",")
    let subTasks = []
    let isSubTaskEmpty = false
    let subTaskElements = document.getElementsByClassName("subtask")

    for(let i = 0; i < subTaskElements.length; i++) {
        subTasks.push({id: randomKeyGenerator(), task: subTaskElements[i].value, completed: false})
        if(!subTasks[i] || subTasks[i].length === 0) {
            isSubTaskEmpty = true
            break
        }
    }

    for(var i = 0; i < tags.length; i++) {
        tags[i] = tags[i].trim()
    }

    if(task && task.includes("by tomorrow")) {
        task = task.replaceAll("by tomorrow", "")
        dueDate = new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString()
    } else if(task && task.includes("by day after tomorrow")) {
        task = task.replaceAll("by day after tomorrow", "")
        dueDate = new Date(new Date().setDate(new Date().getDate() + 2)).toLocaleDateString()
    } else if(task && (task.includes("by today") || task.includes("by tonight"))) {
        task = task.replaceAll("by today", "")
        task = task.replaceAll("by tonight", "")
        dueDate = new Date().toLocaleDateString()
    }
    if(!task || !dueDate || isSubTaskEmpty) {
        alert("Task or Due date cannot be empty")
        return
    }
    todos.push({"key": randomKeyGenerator(), 
                task, 
                "createdDate": new Date().toLocaleDateString(), 
                dueDate, 
                completed: false,
                priority, 
                category,
                tags,
                subTasks})
    localStorage.setItem("todos", JSON.stringify(todos))
    document.getElementById("todo").value = ""
    document.getElementById("category").value = ""
    document.getElementById("tags").value = ""
    document.getElementById("dateInput").value = ""
    document.getElementById("numOfSubTasks").value = 0

    refreshTasks()
})

if (!localStorage.getItem("fetched")) {
    fetch("https://jsonplaceholder.typicode.com/todos")
    .then(result  =>  {
        return (result.json())
    })
    .then(data => {
        data.forEach(d => {
            todos.push({"key": d.id, 
                        task: d.title, 
                        createdDate: new Date().toLocaleDateString(), 
                        dueDate: new Date().toLocaleDateString(), 
                        completed: false,
                        priority: "Medium",
                        tags: [],
                        subTasks: []})
        })
        localStorage.setItem("todos", JSON.stringify(todos))
        refreshTasks()
    })
    localStorage.setItem("fetched", true)
} else {
    todos = JSON.parse(localStorage.getItem("todos"))
    refreshTasks()
}

document.getElementById("priorityFilter").addEventListener('change', (e) => {
    filterPriority = e.target.value
    refreshTasks()
})

document.getElementById("taskStatus").addEventListener('change', (e) => {
    filterComplete = e.target.value
    refreshTasks()
})

document.getElementById("categoryFilter").addEventListener("input", (e) => {
    if(e.target.value.trim().length > 0) {
        filterCategory = e.target.value.trim()
    } else {
        filterCategory = undefined
    }
    refreshTasks()
})

document.getElementById("tagFilter").addEventListener("input", (e) => {
    if(e.target.value.trim().length > 0) {
        filterTag = e.target.value.trim()
    } else {
        filterTag = undefined
    }
    refreshTasks()
})

document.getElementById("taskFilter").addEventListener("input", (e) => {
    if(e.target.value.trim().length > 0) {
        filterTask = e.target.value.trim()
    } else {
        filterTask = undefined
    }
    refreshTasks()
})

document.getElementById("numOfSubTasks").addEventListener("input", (e) => {
    let num = Number(e.target.value)
    const subtasksElement = document.getElementById("subTasks")
    subtasksElement.innerHTML = ""

    for(let i = 1; i <= num; i+= 1) {
        let subtask = document.createElement("input")
        subtask.className = "subtask"
        subtask.placeholder = `Sub-task #${i}`
        subtasksElement.appendChild(subtask)
    }
    
})

document.getElementById("sort").addEventListener('change', (e) => {
    sortBasis = e.target.value
    refreshTasks()
})