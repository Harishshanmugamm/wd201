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
    const x= new Date(new Date().setDate(new Date().getDate() - 1))
    const od = overdue().length
    add(
      {
      title: "Yest Rep",
      dueDate: x.toISOString().slice(0, 10),
      completed: false,
    }
    )

    expect(overdue().length).toBe(od+1)
  })


  test("should show today's todo", () => {
    const z = new Date();
    const dt = dueToday().length
    add({
      title: "GYM",
      dueDate: z.toISOString().slice(0, 10),
      completed: true,
    })
    expect(dueToday().length).toBe(dt + 1)
  })


  test("should show due later todo", () => {
    const nd= new Date(new Date().setDate(new Date().getDate() + 1))
    const dl = dueLater().length
    add({
      title: "Game",
      dueDate: nd.toISOString().slice(0, 10),
      completed: false,
    })
    expect(dueLater().length).toBe(dl + 1)
    console.log(all)
  })
})
