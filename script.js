let todos=JSON.parse(localStorage.getItem('todos'))||[];
let filter='all';

showTodos();

document.querySelector('#todo-input').addEventListener('keydown',function(e){
    if(e.key==='Enter') addTodo();
});

function addTodo(){
    let task=document.querySelector('#todo-input').value.trim();
    let date=document.querySelector('#todo-date').value;

    if(task===''){
        alert('Enter a task');
        return;
    }

    todos.push({task:task,date:date,done:false});
    save();

    document.querySelector('#todo-input').value='';
    document.querySelector('#todo-date').value='';
    showTodos();
}

function save(){
    localStorage.setItem('todos',JSON.stringify(todos));
}

function deleteTodo(i){
    todos.splice(i,1);
    save();
    showTodos();
}

function markTodo(i){
    todos[i].done=!todos[i].done;
    save();
    showTodos();
}

function changeFilter(f){
    filter=f;
    showTodos();
}

function clearDone(){
    todos=todos.filter(t=>!t.done);
    save();
    showTodos();
}

function getTitle(date){
    if(date==='') return 'No Date';

    let today=new Date().toISOString().split('T')[0];

    let y=new Date();
    y.setDate(y.getDate()-1);
    let yesterday=y.toISOString().split('T')[0];

    if(date===today) return 'Today';
    if(date===yesterday) return 'Yesterday';

    return date;
}

function showTodos(){
    let box=document.querySelector('#todo-list');
    let html='';

    let list=todos.filter(t=>{
        if(filter==='pending') return !t.done;
        if(filter==='done') return t.done;
        return true;
    });

    document.querySelector('#count').innerText='Total: '+todos.length;

    if(list.length===0){
        box.innerHTML='<p class="empty">No task found</p>';
        return;
    }

    let group={};

    list.forEach(t=>{
        let title=getTitle(t.date);
        if(!group[title]) group[title]=[];
        group[title].push(t);
    });

    for(let title in group){
        html+=`<h3 class="date-title">${title}</h3>`;

        group[title].forEach(t=>{
            let i=todos.indexOf(t);

            html+=`
            <div class="todo ${t.done?'done':''}">
                <input type="checkbox" ${t.done?'checked':''} onclick="markTodo(${i})">
                <div class="task">
                    ${t.task}<br>
                    <small>${t.date || 'No date'}</small>
                </div>
                <button class="del" onclick="deleteTodo(${i})">Del</button>
            </div>`;
        });
    }

    box.innerHTML=html;
}