// function for converting date format to one I like 
function convertDate(date){
    var yMatch = /\d{4}/;
    var mMatch = /(?<=\D)\d{2}(?=\D)/;
    var dMatch = /\d{2}$/;

    var newDate = `${date.match(mMatch)}/${date.match(dMatch)}/${date.match(yMatch)}`;
    return newDate;
}

// number for the key of the todo, which is used to identify it
var objectKey = parseInt(localStorage.getItem("objectKey"), 10) || 0;
// create array or get array for list of Todo objects that store information about the todo
var todoObjects = JSON.parse(localStorage.getItem("todos")) || [];

// generate those todo's that have alreay been made
for(var i = 0; i < todoObjects.length; i++){
    let wrapper = document.createElement("div");
    wrapper.classList.add("todos");

    let checkIcon = document.createElement("img");
    checkIcon.setAttribute("src", "./imgs/checked.png");
    checkIcon.classList.add("icon");
    checkIcon.id = "check";

    let deleteIcon = document.createElement("img");
    deleteIcon.setAttribute("src", "./imgs/x-button.png");
    deleteIcon.classList.add("icon");
    deleteIcon.id = "x";

    let name = document.createElement("p");
    name.innerHTML = todoObjects[i].name;

    let date = document.createElement("p");
    date.innerHTML = todoObjects[i].date;

    let info = document.createElement("button");
    info.setAttribute("id", "todo-button");
    info.innerHTML = "More Info";

    //key to link it too todoObjects
    let k = document.createElement("p");
    k.innerHTML = todoObjects[i].key;
    k.style.display = "none";

    wrapper.appendChild(checkIcon);
    wrapper.appendChild(deleteIcon);
    wrapper.appendChild(name);
    wrapper.appendChild(date);
    wrapper.appendChild(info);
    wrapper.appendChild(k);
    if(todoObjects[i].completed){
        wrapper.classList.add("completed");
    }


    let todoArea = document.getElementById("todos");
    todoArea.appendChild(wrapper);
}

// variables for the creation form and infopage
var createTodoPage = document.getElementById("new-todo-page");
createTodoPage.style.display = "block";
var todoPage = document.getElementById("todos");
todoPage.style.display = "none";
var infoPage = document.getElementById("info");
infoPage.style.display = "none";           

// Button event used to display the creation form
document.getElementById("create-form").addEventListener("click", function(e){
    e.preventDefault();

    if(createTodoPage.style.display == "none"){
        todoPage.style.display = "none";
        infoPage.style.display = "none";
        createTodoPage.style.display = "block";
    }
})

// Button event to create a new todo from the creation form
document.getElementById("create-todo").addEventListener("click", function(e){
    e.preventDefault();
    var formName = document.querySelector("#form-top input").value;
    var formDate = document.querySelector("#form-date input").value;
    var formInfo = document.querySelector("#form-info textarea").value;
    if(!formDate){
        alert("You need a date!");
    } else {
        var wrapper = document.createElement("div");
        wrapper.classList.add("todos");

        var checkIcon = document.createElement("img");
        checkIcon.setAttribute("src", "./imgs/checked.png");
        checkIcon.classList.add("icon");
        checkIcon.id = "check";

        var deleteIcon = document.createElement("img");
        deleteIcon.setAttribute("src", "./imgs/x-button.png");
        deleteIcon.classList.add("icon");
        deleteIcon.id = "x";

        var name = document.createElement("p");
        if(!formName){
            name.innerHTML = "  --   ";
        } else {
            name.innerHTML = formName;
        }
        var date = document.createElement("p");
        date.innerHTML = convertDate(formDate);

        var info = document.createElement("button");
        info.setAttribute("id", "todo-button");
        info.innerHTML = "More Info";

        //key to link it too todoObjects
        var k = document.createElement("p");
        k.innerHTML = objectKey;
        k.style.display = "none";
        objectKey++;
        localStorage.setItem("objectKey", objectKey);

        wrapper.appendChild(checkIcon);
        wrapper.appendChild(deleteIcon);
        wrapper.appendChild(name);
        wrapper.appendChild(date);
        wrapper.appendChild(info);
        wrapper.appendChild(k);

        var todoArea = document.getElementById("todos");
        todoArea.appendChild(wrapper);

        // put it's info in storage to be accesed by the moreinfo button click event
        todoObjects.push({
            name: name.textContent,
            date: convertDate(formDate),
            info: formInfo,
            key: k.innerHTML,
            completed: false
        });
        // update the local storage item of todo objects
        localStorage.setItem("todos", JSON.stringify(todoObjects));
        // clear form
        document.getElementById("form").reset();
    }
})

var myTodoButton = document.getElementById("my-todos");
myTodoButton.addEventListener("click", function(e){
    e.preventDefault();

    if(createTodoPage.style.display == "block"){
        //infoPage.style.display = "block";
        todoPage.style.display = "block";
        createTodoPage.style.display = "none";
    }
})

var todoArea = document.getElementById("todos");
todoArea.addEventListener("click", function(e){
    e.preventDefault();

    if(e.target.tagName == "BUTTON"){
        if(infoPage.style.display == "none"){
            infoPage.style.display = "block";
            createTodoPage.style.display = "none";
        }

        var div = e.target.parentElement;
        var name = div.children[2].textContent;
        for(var i in todoObjects){
            if(name == todoObjects[i].name){
                var obj = todoObjects[i];
            }
        }

        var name = infoPage.children[0].children[1];
        name.textContent = obj.name;

        var date = infoPage.children[1].children[1];
        date.textContent = obj.date;

        var info = infoPage.children[2].children[1];
        info.textContent = obj.info

        var complete = infoPage.children[3].children[1];
        complete.textContent = (obj.completed ? "Yes" : "No");
    }
    if(e.target.id == "x"){
        var bool = confirm("Are you sure you want to delete this Todo?")
        if(bool){
            var div = e.target.parentElement;
            var keyNum = div.children[5].textContent;
            for(var i in todoObjects){
                if(keyNum == todoObjects[i].key){
                    todoObjects.splice(i, 1);
                }
            }
            localStorage.setItem("todos", JSON.stringify(todoObjects));
            e.target.parentElement.remove();
            if(infoPage.style.display == "block"){
                infoPage.style.display = "none";
            }
        }
    }
    if(e.target.id == "check"){
        var div = e.target.parentElement;
        var keyNum = div.children[5].textContent;
        for(var i in todoObjects){
            if(keyNum == todoObjects[i].key){
                if(!todoObjects[i].completed){
                    var bool = confirm("Mark as complete?");
                    if(bool){
                        todoObjects[i].completed = true;
                        div.classList.add("completed");
                    }
                } else {
                    var bool2 = confirm("Mark as uncomplete?");
                    if(bool2){
                        todoObjects[i].completed = false;
                        div.classList.remove("completed");
                    }
                }
            }   
        }
        localStorage.setItem("todos", JSON.stringify(todoObjects));
    }
});