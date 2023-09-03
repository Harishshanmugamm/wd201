//output
/*
My Todo-list

Overdue
[ ] Submit assignment 2022-07-21

Due Today
[x] Pay rent
[ ] Service vehicle

Due Later
[ ] File taxes 2022-07-23
[ ] Pay electric bill 2022-07-23
*/
/* eslint-disable no-undef */
const todoList = () => {
  all = [];
  today = new Date().toLocaleDateString("en-CA");
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    // Write the date check condition here and return the array
    // of overdue items accordingly.

    return all.filter((od) => od.dueDate < today);
  };

  const dueToday = () => {
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.

    return all.filter((dt) => dt.dueDate === today);
  };

  const dueLater = () => {
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.

    return all.filter((dl) => dl.dueDate > today);
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    return list
      .map((disp) => {
        let res, ddt;
        if (disp.completed) {
          res = "[x] " + disp.title;
        } else {
          res = "[ ] " + disp.title;
        }
        // return res

        if (disp.dueDate !== today) {
          ddt = disp.dueDate;
        } else {
          ddt = " ";
        }

        return res, ddt;
      })
      .join("\n");
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

// ####################################### #
// DO NOT CHANGE ANYTHING BELOW THIS LINE. #
// ####################################### #

module.exports = todoList;
