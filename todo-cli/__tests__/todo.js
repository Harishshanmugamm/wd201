const todoList = require('../todo')

const { all,add,markAsComplete,overdue,dueToday,dueLater}=todoList()

describe("Todolist Test Suite",()=>{
    beforeAll(()=>{
        add(
            {
                title:"Test",
                completed: false,
                duedate: new Date().toISOString().slice(0, 10)
            }
         )
    })
   test("Should add new todo",()=>{
     const todoItemcount=all.length
     add(
        {
            title:"new",
            completed: false,
            duedate: new Date().toISOString().slice(0, 10)
        }
     )
     expect(all.length).toBe(todoItemcount + 1)
   })

   test("Should mark a todo as complete",()=>{
    expect(all[0].completed).toBe(false)
    markAsComplete(0)
    expect(all[0].completed).toBe(true)

   })

   test("should show overdue todo",() => {
    const ff= new Date(new Date().setDate(new Date().getDate() - 1))
    const odu=overdue().length
    add(
      {
      title: "Submit assignment",
      dueDate: ff.toISOString().slice(0, 10),
      completed: false,
    }
    )
    
    expect(overdue().length).toBe(odu + 1)
  })


  test("should show today's todo", () => {
    const mm = new Date()
    const dtd=dueToday().length
    
    add({
      title: "Pay rent",
      dueDate: mm.toISOString().slice(0, 10),
      completed: true,
    })
    expect(dueToday().length).toBe( dtd+ 1)
  })


  test("should show due later todo", () => {
    const ndf= new Date(new Date().setDate(new Date().getDate() + 1))
    const dldd=dueLater().length
    add({
      title: "Pay electric bill",
      dueDate: ndf.toISOString().slice(0, 10),
      completed: false,
    })
    expect(dueLater().length).toBe(dldd + 1)
    console.log(all)
  })
})
