/** create a database: todolistDatabase
 * 需要修改DB名称，创建一个数据库叫：todolistDatabase
 */
var db = new Dexie("todolistDatabase");

/**
 * Define the schema for the database.
 * The database has a single table "todolist" with a primary key "id" and
 * indexes on the properties "title" and "priority" and "description".
 */
db.version(1).stores({
  todolist: "id, title, priority, description"
});

/**
 * Retrieves all student records from the database.
 * 从todolist表里获取所有的待办事项信息
 */
function getAllTodolistFromDB() {
  if (db && db.todolist) {
    // check if db and the students table are created
    // 检查db和todolist表是否已被创建
    return db.todolist.toArray().then((data) => {
      return data;
    });
  } else {
    return undefined;
  }
}

/**
 * Adds a new todolist record to the database.
 * 增加一个新的todo到todolist表里，包含三个字段：title，priority和description
 */
function addTodolistToDB(title, priority, description,id) {
  // const id  = generateUniqueID(); // 新增的一句话，生成唯一ID

  db.todolist
    .put({id, title, priority, description })
    .then(() => true)
    .catch((err) => {
      alert("Ouch... " + err);
    });

  // return db.id;

  // return new Promise((resolve, reject) => {
  //   const id = generateUniqueID(); // 生成唯一ID

  //   db.todolist
  //       .put({ id, title, priority, description })
  //       .then(() => {
  //           // 当插入操作成功时，将生成的唯一ID传递给resolve函数
  //           resolve(id);
  //       })
  //       .catch((err) => {
  //           // 如果出现错误，则调用reject函数，并传递错误信息
  //           reject(err);
  //       });
  // });
}

/****************************************************************
 * delete a todolist record to the database.自己写的
 */
function deleteTodolistFromDB(id){
  db.todolist.delete(id)
    .then(() => {
      console.log("Todolist deleted successfully");
    })
    .catch(error => {
      console.error("Error deleting todolist:", error);
    });
}

/**
* create a unique id for each records这里需要新增一个创建唯一id的函数
*/
function generateUniqueID(){
  return Date.now().toString();
}

/**
 * Queries the database for students by name.
 * (Not used in the app, just to showcase Dexie's capabilities)
 * 修改方法名为：按照todolist的title查询
 */
async function queryByTitle(title) {
  if (title === undefined) return 0;
  return await db.todolist
    .filter((todolist) => {
      return todolist.title === title;
    })
    .toArray();
}

// Ref -> https://dexie.org/docs/Tutorial/Hello-World
