const form = document.getElementById('tasks__form'); 
addOldTask();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('task__input');
    input.value = input.value.trim();
    if (input.value) {
        const text = `
            <div class="task">
                <div class="task__title">
                    ${input.value}
                </div>
                <a href="#" class="task__remove">&times;</a>
            </div>
        `;
        const elementList = document.getElementById('tasks__list');
        elementList.insertAdjacentHTML('afterBegin', text);
        let count = numberTask();
        input.value = '';
        const removeLink = elementList.querySelector('.task__remove');
        removeLink.addEventListener('click', (event) => {
            event.preventDefault();
            removeLink.closest('.task').outerHTML = '';
            const delTask = JSON.parse(localStorage.getItem('myTasks'));
            delete delTask[`task_${count}`];
            localStorage.setItem(`myTasks`, JSON.stringify(delTask)); 
        });
        const elementTask = elementList.querySelector('.task');
        let myTasks = JSON.parse(localStorage.getItem('myTasks'));
        if (!myTasks) {
            myTasks = {};
        }
        const nameTask = `task_${count}`;
        myTasks[nameTask] = elementTask.outerHTML;
        localStorage.setItem(`myTasks`, JSON.stringify(myTasks));
    }   
});

function all() {
    const myTasks = JSON.parse(localStorage.getItem('myTasks'));
    for (let key in myTasks) {
        console.log(key);
    }
}

function removeAll() {
    localStorage.removeItem('myTasks');
}

function addOldTask() {
    const elementList = document.getElementById('tasks__list');
    const myTasks = JSON.parse(localStorage.getItem('myTasks'));
    for (let key in myTasks) {
        elementList.insertAdjacentHTML('afterBegin', myTasks[key]);
        const removeLink = elementList.querySelector('.task__remove');
        removeLink.addEventListener('click', (event) => {
            event.preventDefault();
            removeLink.closest('.task').outerHTML = '';
            delete myTasks[key];
            localStorage.setItem(`myTasks`, JSON.stringify(myTasks));
        });
    }
}

function numberTask() {
    const list = [];
    const myTasks = JSON.parse(localStorage.getItem('myTasks')); 
    if (!myTasks) {
        return 1;
    }
    for (let key in myTasks) {
        key = Number(key.slice(5));
        list.push(key);
    }
    for (let i=1; i<=(list.length + 1); i++) {
        if (!list.includes(i)) {
            return i;
        }
    }
}
