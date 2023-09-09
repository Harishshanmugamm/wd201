'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const odI = await Todo.overdue();
      odI.forEach((ti) =>
        console.log(ti.displayableString())
      );

      console.log("\n");

      console.log("Due Today");
      const dTI = await Todo.dueToday();
      dTI.forEach((ti) =>
        console.log(ti.displayableString())
      );
      // FILL IN HERE
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const dLI = await Todo.dueLater();
      dLI.forEach((ti) =>
        console.log(ti.displayableString())
      );
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      const odI = await Todo.findAll({
        where: { dueDate: { [Op.lt]: new Date() } },
        order: [["id", "ASC"]],
      });

      return odI
      ;
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const dTI = await Todo.findAll({
        where: { dueDate: new Date() },
        order: [["id", "ASC"]],
      });

      return dTI
      ;
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
   
    const dLI = await Todo.findAll({
      where: { dueDate: { [Op.gt]: new Date() } },
      order: [["id", "ASC"]],
    });
    return dLI;
  }
   

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      await Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        }
      );

    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};
