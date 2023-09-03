const todoList = require("../todo");

const { all, add, markAsComplete, overdue, dueToday, dueLater } = todoList();

describe("Todolist Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Test",
      completed: false,
      duedate: new Date().toISOString().slice(0, 10),
    });
  });
  test("Should add new todo", () => {
    const todoItemcount = all.length;
    add({
      title: "new",
      completed: false,
      duedate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoItemcount + 1);
  });

  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("should show overdue todo", () => {
    const tod = new Date();
    const yes = new Date(tod);
    yes.setDate(tod.getDate() - 1);
    const ystr = yes.toISOString().split("T")[0];

    const odu = overdue().length;
    add({
      title: "Submit assignment",
      dueDate: ystr,
      completed: false,
    });

    expect(overdue().length).toBe(odu + 1);
    //expect(Object.is(overdue().length, odu + 1)).toBe(true)
  });

  test("should show today's todo", () => {
    const mm = new Date();
    const mmstr = mm.toISOString().split("T")[0];
    const dtd = dueToday().length;

    add({
      title: "Pay rent",
      dueDate: mmstr,
      completed: true,
    });
    expect(dueToday().length).toBe(dtd + 1);
    //expect(Object.is(dueToday().length,dtd + 1)).toBe(true)
  });

  test("should show due later todo", () => {
    const tod = new Date();
    const tom = new Date(tod);
    tom.setDate(tod.getDate() + 1);

    const tomstr = tom.toISOString().split("T")[0];

    const dldd = dueLater().length;
    add({
      title: "Pay electric bill",
      dueDate: tomstr,
      completed: false,
    });
    expect(dueLater().length).toBe(dldd+1);
    //expect(Object.is(dueLater().length, dldd + 1)).toBe(true)
    console.log(all);
  });
});
