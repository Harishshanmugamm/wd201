/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
var csrf = require("tiny-csrf");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const passport=require('passport')
const connectEnsureLogin=require('connect-ensure-login')
const session = require('express-session')
const LocalStrategy=require('passport-local')
const bcrypt=require('bcrypt')
const saltRounds=10;
const path = require("path");


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("ssh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
app.use(flash());


app.use(bodyParser.json());
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


app.use(session({
  secret:"my-super-secret-key-2121156448852896",
  cookie:{
    maxAge:24*60*60*1000
  }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(function(request, response, next) {
  response.locals.messages = request.flash();
  next();
});

passport.use(new LocalStrategy({
  usernameField:'email',
  passwordField:'password',
},(username,password,done)=>{
  User.findOne({where: {email: username}})
  .then(async function (user) { 
    if (user) { 
      const result = await bcrypt.compare(password, user.password); 
      if (result) { 
        return done(null, user); 
      } else { 
        return done(null, false, { message: "Invalid Password" }); 
      } 
    } 
    else { 
      return done(null, false, { message: "User Does Not Exist" }); 
    } 
  }).catch((error)=>{
    return done(error)
  })
}))



passport.serializeUser((user,done)=>{
  console.log("Serializing user in session",user.id)
  done(null, user.id)
})
passport.deserializeUser((id,done)=>{
  User.findByPk(id).then(user=>{
    done(null, user)
  })
  .catch(error=>{
    done(error,null)
  })
})
app.set("view engine", "ejs");


app.get("/", async (req, res) => {
  if(req.isAuthenticated()){
    return res.redirect("/todos")
   }
    res.render("index", {
      title: "Todo App",
      csrfToken: req.csrfToken(),
    });
  }
);


app.get("/signout",(request,response,next)=>{
  request.logout((err)=>{
    if (err){return next(err)}
    response.redirect("/")
  })
})
app.get("/todos",connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const loggedInUser=req.user.id
  let allTodos = await Todo.getTodo(loggedInUser);
  let overDue = await Todo.overDue(loggedInUser);
  let dueLater = await Todo.dueLater(loggedInUser);
  let dueToday = await Todo.dueToday(loggedInUser);
  let completeditems = await Todo.completeditems(loggedInUser);
  if (req.accepts("html")) {
    res.render("todo", {
      title: "Todo App",
      allTodos,
      overDue,
      dueToday,
      dueLater,
      completeditems,
      csrfToken: req.csrfToken(),
    });
  } else {
    res.json({
      overdue,
      dueToday,
      dueLater,
      completeditems,
    });
  }
})

app.get("/signup",(request, response)=>{
  response.render("signup",{ title:"Sign Up", csrfToken: request.csrfToken()})
})
app.post("/users",async (request, response)=>{
  if((request.body.firstName.length == 1) ) {
    request.flash("error", "Whoops! You haven't entered your First Name!.");
    return response.redirect("/signup"); }

  if((request.body.lastName.length == 0) || (request.body.lastName.length == 1)) {
    request.flash("error", "Whoops! You haven't entered your Last Name!.");
    return response.redirect("/signup"); }

  if((request.body.email.length == 1)){
    request.flash("error", "Whoops! You haven't entered your Email!.");
    return response.redirect("/signup"); }

  if((request.body.password.length<6) && !(request.body.password.length > 16)){
    request.flash("error", "Please check your entered Password : Password must be at least 6 and atmost 16 characters long!.");
    return response.redirect("/signup"); }

  const hashedPwd= await bcrypt.hash(request.body.password, saltRounds)

  try{
    const user=await User.create({
    firstName:request.body.firstName,
    lastName:request.body.lastName,
    email:request.body.email,
    password:hashedPwd,
  });
  request.login(user,(err)=>{
    if(err){
      console.log(err)
    }
    response.redirect("/todos")
  })

  }
  catch (error){
    console.log(error);
  }
})

app.get("/login",(request,response)=>{
  response.render("login",{
    title:"Login", 
    csrfToken:request.csrfToken()});
})

app.post("/login",async (request,response)=>{
  try{
    const{email,password}=request.body
    request.flash("success", `LogIn successfull`);
    return response.redirect("/todos");
  }
  catch(error){
    request.flash("error", "Session is not Active please login again");
    response.redirect("/login");
  }
})

app.post("/session",passport.authenticate('local',{
  failureRedirect:"/login",
   failureFlash: true,
  }),
(request,response)=>{
  console.log(request.user)
  response.redirect("/todos")
})
app.get("/todos",connectEnsureLogin.ensureLoggedIn(), async function (_request, response) {
  console.log("Processing list of all Todos ...");
  try {
    let Todos = await Todo.findAll();
    return response.send(Todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id",connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", connectEnsureLogin.ensureLoggedIn(),async function (request, response) {
  if(request.body.title.length === 0) {
    request.flash("error", "This field should not be empty.");
    return response.redirect("/todos");
  }
  if(request.body.dueDate.length === 0) {
    request.flash("error", "This field should not be empty.");
    return response.redirect("/todos");
  }
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      userId: request.user.id,
    });
    return response.redirect("/todos");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", connectEnsureLogin.ensureLoggedIn(),async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", connectEnsureLogin.ensureLoggedIn(),async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);

  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (error) {
    return response.status(422).json(error);
  }
  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
});

module.exports = app;
