async function registerServiceWorker() {
  // Register service worker
  if ("serviceWorker" in navigator) {
    // checking if the browser supports service workers
    window.addEventListener("load", function () {
      // when app loads, fire callback
      navigator.serviceWorker.register("/sw.js").then(
        function () {
          // register sw
          console.log("ServiceWorker registration successful"); // registration was successful
        },
        function (err) {
          console.log("ServiceWorker registration failed", err); // registration failed
        }
      );
    });
  }
}

/**
 * Main function to handle the todolist form and display logic.
 */
async function main() {
  // Select form and input elements
  const form = document.querySelector("form");
  const titleInput = document.querySelector("[name='title']"); 
  const priorityInput = document.querySelector("[name='priority']");   
  const descriptionInput = document.querySelector("[name='description']");  
  
  const todolistList = document.getElementById("todolist"); 

  // Retrieve existing todolist from the database 
  const existingTodolist = (await getAllTodolistFromDB()) || []; 

  // Store students data locally -- 将todolist表里的数据存在本地
  const todolistData = existingTodolist.slice(); //新增的

  // Populate initial todolist list
  // 遍历existingTodolist这个数组，把每一个数组里的数据都传递给todolist表里对应的元素，写入表中
  // 总体来看就是把existingTodolist里的数据传递给addTodolist()这个函数，进行数据处理：即添加数据到数据库
  existingTodolist.forEach((todolist) => {
    addTodolist(todolist.title, todolist.priority, todolist.description, todolist.id);
  }); 


  //Adds a todolist to the list and updates the storage.-- 需要写一个把数据添加到数据库的方法，即：addTodolist()函数
  function addTodolist(title, priority, description, id) { //这里增加一个传入参数id
    // 创建复选框元素
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute('name', 'mark as completed');

    // 创建一个包含文本的文本节点
    var textNode = document.createTextNode('Mark as completed');
    var textNode2 = document.createTextNode('                ｜      ');

    // 创建删除按钮元素
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button"); // 添加样式类

    // 创建todolist元素
    const div = document.createElement("div");
    div.classList.add("todolist");
    div.setAttribute("data-id",id); // 将唯一ID存储在data-id属性中
    const h1 = document.createElement("h1");
    h1.textContent = title;
    const h2 = document.createElement("h2");
    h2.textContent = priority;
    const p = document.createElement("p");
    p.textContent = description;

    // 删除：添加点击事件处理程序以删除该项
    deleteButton.addEventListener("click", function() {
      // 从DOM中删除该todo列表项
      div.remove();

      // 从当前todo项中提取id 
      const id = div.getAttribute("data-id"); // 获取存储的唯一ID
      
      // 更新存储
      const index = todolistData.findIndex(item => item.title === title && item.priority === priority && item.description === description);
      if (index !== -1) {
          todolistData.splice(index, 1);
          localStorage.setItem("todolist", JSON.stringify(todolistData));
          deleteTodolistFromDB(id); // 调用删除数据库记录的函数，此函数在db.js里
      }

    });

    // Append to DOM
    // 先添加复选框、复选框文字、删除按钮，再添加todolist内容
    div.appendChild(checkbox);
    div.appendChild(textNode);
    div.appendChild(textNode2);
    div.appendChild(deleteButton);
    div.append(h1, h2, p);
    todolistList.appendChild(div);

    // Update storage --更新的数据库的内容
    todolistData.push({title, priority, description ,id}); //增加id
    localStorage.setItem("todolist", JSON.stringify(todolistData));
    addTodolistToDB(title, priority, description,id); // Assuming addStudentToDB is defined

    // Clear input fields -- 这里也需要修改--清除表单里的内容，每提交一次就清理一次填写的内容
    [titleInput, priorityInput, descriptionInput].forEach((input) => (input.value = ""));   
  }

  // Handle form submission -- 新增的
  form.onsubmit = (event) => {
    event.preventDefault();
    const idInput = generateUniqueID(); //----------------------------------------------
    addTodolist( titleInput.value, priorityInput.value, descriptionInput.value, idInput);
  };

}

// Initialize service worker and main application logic
registerServiceWorker();
main();
