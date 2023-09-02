const todoList = require('../todo')

const { all,add,markAsComplete}=todoList()

describe("Todolist Test Suite",()=>{
    beforeAll(()=>{
        add(
            {
                title:"Test",
                completed: false,
                duedate: new Date().toISOString()
            }
         )
    })
   test("Shoould add new todo",()=>{
     const todoItemcount=all.length
     add(
        {
            title:"Test",
            completed: false,
            duedate: new Date().toISOString()
        }
     )
     expect(all.length).toBe(todoItemcount + 1)
   })
   test("Should mark a todo as complete",()=>{
    expect(all[0].completed).toBe(false)
    markAsComplete(0)
    expect(all[0].completed).toBe(true)

   })
})