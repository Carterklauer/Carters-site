// server.js
// where your node app starts

// init project
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const cookieSession = require("cookie-session")
const fs = require("fs");
const { SHA3 } = require("sha3")
// Initialize Database.
const Database = require("./src/sqlite.js")

const env = process.env

app.use(bodyParser());
app.use(express.static("public"));
app.use(
  cookieSession({
    name: "session",
    keys: [env.KEY1, env.KEY2, env.KEY3, env.KEY4],
  })
);
function Login(request, respond, Users) {
  for (var i = 0; i < Users.length; i++) {
    if (
      Users[i].Username == request.body.Username ||
      Users[i].Email == request.body.Username
    ) {
      LoginUser = Users[i]
      Index = i
      respond.redirect("/login-pass");
    }
  }
  respond.redirect("login?failed=true");
}

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
// listen for requests :)


var LoginUser;
var Index;
var ID

function password_hash(password) {
  var hasher = new SHA3(512);
  hasher.update(env.KEY1 + env.HASHHELP + env.KEY4);
  hasher.update(password);
  hasher.update(env.KEY3 + env.HASHHELP + env.KEY2);
  var hash = hasher.digest("base64");
  return hash;
}

app.get("/login", function (request, respond) {
  respond.sendFile(__dirname + "/public/login.html");
});
app.get("/login-pass", function (request, respond) {
  respond.sendFile(__dirname + "/public/login2.html");
});
app.get("/account-home", function (request, respond) {
  respond.sendFile(__dirname + "/public/account-home.html");
});
app.get("/content", function (request, respond) {
  respond.sendFile(__dirname + "/public/content.html");
});
app.get("/friends-content", function (request, respond) {
  respond.sendFile(__dirname + "/public/friends-content.html");
});
app.get(
  "/friends-content/my-next-car-is-going-to-be-a-truck",
  function (request, respond) {
    respond.sendFile(
      __dirname + "/public/my-next-car-is-going-to-be-a-truck.html"
    );
  }
);
app.get("/admin", function(request, respond){
  respond.sendFile(__dirname+"/public/administrator-dashboard.html")
});
app.get("/colton-engel", function (request, respond) {
  respond.sendFile(__dirname + "/public/colton-engel.html");
});
app.get("/new-account", function(request, respond){
  respond.sendFile(__dirname+"/public/new-account.html")
})
app.get("/find-user", function(request, respond){
  respond.sendFile(__dirname+"/public/users.html")
})

app.post("/login", async(request, respond)=>{
  const Users = await Database.GetUsers()
  Login(request, respond, Users)
});
app.post("/login2", async (request, respond)=>{
  const Users = await Database.GetUsers()
  if(Users[Index].Password==request.body.Password){
    request.session.UserName=LoginUser
    request.session.Name=Users[Index].Name
    request.session.Email=Users[Index].Email
    request.session.Account_type=Users[Index].Account_Type
    respond.redirect("/")
    ID=Users[Index].ID
  }
  respond.redirect("/login?failed=true")
});



app.get("/logout", function (request, respond) {
  request.session.Account_type = "unlogged";
  respond.redirect("/");
});

app.post("/getLogin", function(request, respond){
  request.session.Account_type = "unlogged";
  respond.redirect("login");
});

app.post("/new-account", async (request, respond)=>{
  const Users= await Database.GetUsers()
  console.log(Users)
  for(var i=0; i<Users.length;i++){
    if(Users[i].UserName==request.body.Username){
      respond.redirect("/new-account?faultyinfo=true")
    }
  }
  await Database.AddUser(request.body.Username, request.body.Name, request.body.Email, request.body.Password, request.body.Account_type)
  respond.redirect("/account-home")
})


app.get("/load", async(request, respond)=>{
  var id = request.query.id;
  request.session.Account_type = request.session.Account_type || "unlogged";
  if (id == "header") {
    if (request.session.Account_type != "unlogged") {
      if (request.session.Account_type == "Owner"||"Administrator"||"Friend"||"Standard") {
        respond.send(
          "<h2>" +
            '<ul class="menu">' +
            '<li class="menu"><button><a class="menu" href="/account-home">' +
            request.session.Name +
            "</a></button></li>" +
            '<li class="menu"><button><a class="menu" href="/logout">Log out</a></button></li>' +
            "</ul>" +
            "</h2>"
        );
      }
    }else {
      if (id == "header") {
        respond.send(
          `<h2>
          <ul class="menu">
           <div style="text-align:right"><form action=/getLogin method="Post">
             <input type="submit" value="Login"/>
          </form></div>
          </ul>
          </h2>`
        );
      }
    }
  } else if (id == "change-password") {
    if (request.session.Account_type == "Administrator"||"Owner")
      respond.send(
        '<div style="text-align:center"><form action="/change-pass" method="Post" autocomplete="off">' +
          'Current Password: <input name="Current_Password" type="password" placeholder="Current Password"/>' +
          'New Password: <input name="New_Password" type="password" placeholder="New Password"/>' +
          '<input type="submit" value="Change Password"/>' +
          "</form></div>"
      );
  } else if (id == "account-home") {
    if (request.session.Account_type =="Owner"){
      respond.send(`
      <div style="text-align:center"><span style="color:rgb(255,125,0);font-size:xx-large;background-color:transparent">Account Home</span></div>
      <ul class="menu">
          <li class="menu"><button><a class="menu" href="/friends-content">Friends Content</a></button></li>
          <li class="menu"> <button><a class="menu" href="/change-pass.html?accountsession=true">Change Password</a></buuton></li>
          <li class="menu"> <button><a class="menu" href="/admin">Aministrator Dashboard</a></button></li>
      </ul>
     `)
    }else if(request.session.Account_type == "Administrator") {
      respond.send(`
      <div style="text-align:center"><span style="color:rgb(255,125,0);font-size:xx-large;background-color:transparent">Account Home</span></div>
      <ul class="menu">
          <li class="menu"><button><a class="menu" href="/friends-content">Friends Content</a></button></li>
          <li class="menu"> <button><a class="menu" href="/change-pass.html?accountsession=true">Change Password</a></buuton></li>
          <li class="menu"> <button><a class="menu" href="/admin">Aministrator Dashboard</a></button></li>
      </ul>
        
      `);
    } else if (request.session.Account_type == "Friend") {
      respond.send(`
      <div style="text-align:center"><span style="color:rgb(255,125,0);font-size:xx-large;background-color:transparent">Account Home</span></div>
      <ul class="menu">
        <li class="menu"><button><a class="menu" href="/friends-content">Friends Content</a></button></li>
      </ul>
      `);
    } else {
      respond.send(`<p> You must be logged in to View Content</p>`)
    }
  } else if (id == "friends-content") {
    if (request.session.Account_type == "Owner"||"Administrator" || "Friend") {
      respond.send(`
        <div style="text-align:center"><a href="/friends-content/my-next-car-is-going-to-be-a-truck"><font color="#ff9900" face="arial, sans-serif">My Next Car Is Going to Be a Truck</font></a></div>
        <div style="text-align:center"><a href="colton-engel"><font color="#ff9900" face="arial, sans-serif">Colton Engel</font></a></div>
      `);
    }else{
      respond.send(`<p>You must Login in order to view</p>`)
    }
  }else if(id=="newaccount"){
    if(request.session.Account_type=="Owner"){
      respond.send(`
     <h1>
       <div style="text-align:center"><span style="color:rgb(255,0,255);font-size:xx-large;background-color:transparent">New Account</span></div>
    </h1>
      <form action="/new-account" method="Post" autocomplete="off" id="new-account">
      Name: <input name="Name" type="text" placeholder="Name" required/>
      Email: <input name="Email" type="text" placeholder="Email"/>
      Username: <input name="Username" type="text" placeholder="Username" required/>
      Password: <input name="Password" type="text" placeholder="Password" required/>
      Account Type: <input name="Account_type" list="Account_type">
      <datalist id="Account_type">
        <option value="Administrator">Administrator</option>
        <option value="Friend"> Friend</option>
        <option value="Standard">Standard</option>
      </datalist>
      <input type="submit" value="Add Account"/>
      </form>
      `) 
    }else if(request.session.AccountType=="Administrator"){
      respond.send(`
                <form action="/new-account" method="Post" autocomplete="off">
      Name: <input name="Name" type="text" placeholder="Name" required/>
      Email: <input name="Email" type="text" placeholder="Email"/>
      Username: <input name="Username" type="text" placeholder="Username" required/>
      Password: <input name="Password" type="text" placeholder="Password" required/>
      <input type="submit" value="Add Account"/>
      </form>`)
    }else{
      respond.send(`You do not have access to this page`)
    }
  }else if(id=="users"){
    if(request.session.Account_type=="Owner"){
      const Users=Database.GetUsers()
      respond.send(`
      `)
    }
  }else if(id=="administrator"){
      if(request.session.Account_type=="Owner"){
        respond.send(`
        <h1><div style="text-align:center"><span style="color:rgb(255, 125, 0); font-size:xx-large">Administrator Dashboard</span></div></h1>
        <ul class="menu">
          <li class="menu"><button><a class="menu" href="/new-account">Add an Account</a></button></li>
          <li class="menu"><button><a class="menu" href="/find-user">Find User</a></button></li>
      </ul>
      `)
      }else if(request.session.Account_type=="Administrator"){
        respond.send(`
        <h1><div style="text-align:center"><span style="color:rgb(255, 125, 0); font-size:xx-large">Administrator Dashboard</span></div></h1>
        <ul class="menu">
          <li class="menu"><button><a class="menu" href="/new-account">Add an Account</a></button></li>
        </ul>
        `)
      }
  }else if (id == "colton-engel") {
    if (request.session.Account_type == ("Owner"||"Administrator" || "Standard")) {
      respond.send(`
      <h1><div style="text-align:center"><span style="color:rgb(0,0,255);font-size:xx-large">Colton Engel</span></div></h1>
      <p>
        I know blogs are supposed to be personal and only about me. My friends are important to me too. My best friend Colton Engel is one of the most kindest people that I met. Colton likes to play Baseball, matter in fact I knew he played for a team last summer. Here are some pictures of him playing Baseball.
      </p>
      <div style="text-align:left"><font face="arial, sans-serif" size="3">
        <div style="display:block;text-align:left">&nbsp;
          <div style="display: block; text-align: center;"><a imageanchor="1" href="https://cdn.glitch.com/1760db9d-c13a-4b0a-a542-608419c30c2b%2F65424889_457293585059544_8613261504277381120_n.jpg?v=1602466475393">
            <img src="https://cdn.glitch.com/1760db9d-c13a-4b0a-a542-608419c30c2b%2F65424889_457293585059544_8613261504277381120_n.jpg?v=1602466475393"border="0"></img></a></div>
          <div style="display:block;text-align:center">&nbsp;</div></font></div></div>
      <div style="text-align:left"><font face="arial, sans-serif" size="3">
        <div style="display:block;text-align:left">&nbsp;
          <div style="display: block; text-align: center;"><a imageanchor="1" href="https://cdn.glitch.com/1760db9d-c13a-4b0a-a542-608419c30c2b%2F65756298_444546549731261_1786822092965019648_n.jpg?v=1602466478548">
            <img src="https://cdn.glitch.com/1760db9d-c13a-4b0a-a542-608419c30c2b%2F65756298_444546549731261_1786822092965019648_n.jpg?v=1602466478548"border="0"></img></a></div>
      <div style="display:block;text-align:center">&nbsp;</div></div></font></div>
      <div style="text-align:left"><font face="arial, sans-serif" size="3">
        <div style="display:block;text-align:left">&nbsp;
          <div style="display: block; text-align: center;"><a imageanchor="1" href="https://cdn.glitch.com/1760db9d-c13a-4b0a-a542-608419c30c2b%2F65977661_649244112259034_4839865523351060480_n.jpg?v=1602466482409">
            <img src="https://cdn.glitch.com/1760db9d-c13a-4b0a-a542-608419c30c2b%2F65977661_649244112259034_4839865523351060480_n.jpg?v=1602466482409"border="0"></img></a></div>
      <div style="display:block;text-align:center">&nbsp;</div></div></font></div>
      <div style="text-align:left"><font face="arial, sans-serif" size="3">
        <div style="display:block;text-align:left">&nbsp;
          <div style="display: block; text-align: center;"><a imageanchor="1" href="https://cdn.glitch.com/1760db9d-c13a-4b0a-a542-608419c30c2b%2F71003865_533970900687649_3178975934543822848_n.jpg?v=1602466494940">
            <img src="https://cdn.glitch.com/1760db9d-c13a-4b0a-a542-608419c30c2b%2F71003865_533970900687649_3178975934543822848_n.jpg?v=1602466494940"border="0">
            </a></div></div>
          <div style="display:block;text-align:center">&nbsp;</div></font></div>
      <div style="display:block;text-align:center">&nbsp;
      <div style="text-align:left"><font face="arial, sans-serif" size="3">
        <div style="display:block;text-align:left">&nbsp;
          <div style="display: block; text-align: center;"><a imageanchor="1" href="https://cdn.glitch.com/1760db9d-c13a-4b0a-a542-608419c30c2b%2F71237568_2540484516038687_3505501347208232960_n.jpg?v=1602466502219">
            <img src="https://cdn.glitch.com/1760db9d-c13a-4b0a-a542-608419c30c2b%2F71237568_2540484516038687_3505501347208232960_n.jpg?v=1602466502219"border="0">
            </a></div></div>
          <div style="display:block;text-align:center">&nbsp;</div></font></div>

        <div style="display:block;text-align:center">&nbsp;
      <div style="text-align:left"><font face="arial, sans-serif" size="3">
        <div style="display:block;text-align:left">&nbsp;
          <div style="display: block; text-align: center;"><a imageanchor="1" href="https://cdn.glitch.com/1760db9d-c13a-4b0a-a542-608419c30c2b%2F71325705_474807153103911_5717455254639869952_n.jpg?v=1602466506909">
            <img src="https://cdn.glitch.com/1760db9d-c13a-4b0a-a542-608419c30c2b%2F71325705_474807153103911_5717455254639869952_n.jpg?v=1602466506909"border="0">
            </a></div></div>
          <div style="display:block;text-align:center">&nbsp;</div></font></div>
      <div style="text-align:left"><font face="arial, sans-serif" size="3">
        <div style="display:block;text-align:left">&nbsp;
          <div style="display: block; text-align: center;"><a imageanchor="1" href="https://cdn.glitch.com/1760db9d-c13a-4b0a-a542-608419c30c2b%2F72151848_244496169816310_1474778309295341568_n.jpg?v=1602466515582">
            <img src="https://cdn.glitch.com/1760db9d-c13a-4b0a-a542-608419c30c2b%2F72151848_244496169816310_1474778309295341568_n.jpg?v=1602466515582"border="0"></img></a></div>
        <div style="display:block;text-align:center">&nbsp;</div></font></div>
        </div>
        </div>
      <p>
        His pitching speed is 84 m.p.h, and he is 6ft and weighs 225lbs.
      </p>
      <p>
        Colton is also a proud truck owner. His truck is a 2005 Nissan Titan with a 6 in. lift, 35 x 12.5 and 12 ply agressive mud tires, and a sunroof.
      </p>
      <div style="text-align:left"><font face="arial, sans-serif" size="3">
        <div style="display:block;text-align:left">&nbsp;
          <div style="display: block; text-align: center;"><a imageanchor="1" href="https://cdn.glitch.global/1760db9d-c13a-4b0a-a542-608419c30c2b/Colton's 2005 Nissan Titan.jpg?v=1600402756188">
            <img src="https://cdn.glitch.global/1760db9d-c13a-4b0a-a542-608419c30c2b/Colton's 2005 Nissan Titan.jpg?v=1600402756188"border="0"></a></div>
            <div style="display:block;text-align:center">&nbsp;</div>
          </div>
        </font>
      </div>
      <div style="text-align:left"><font face="arial, sans-serif" size="3">
        <div style="display:block;text-align:left">&nbsp;
          <div style="display: block; text-align: center;"><a imageanchor="1" href="https://cdn.glitch.global/1760db9d-c13a-4b0a-a542-608419c30c2b/Colton's 2005 Nissan Titan 2.jpg?v=1600402764323">
            <img src="https://cdn.glitch.global/1760db9d-c13a-4b0a-a542-608419c30c2b/Colton's 2005 Nissan Titan 2.jpg?v=1600402764323"border="0"></img></a></div>
          <div style="display:block;text-align:center">&nbsp;</div>
        </div>
        </font></div>
        <div style="text-align:left"><font face="arial, sans-serif" size="3">
        <div style="display:block;text-align:left">&nbsp;
          <div style="display: block; text-align: center;"><a imageanchor="1" href="https://cdn.glitch.global/1760db9d-c13a-4b0a-a542-608419c30c2b/Colton's 2005 Nissan Titan 3.jpg?v=1631390716615">
            <img src="https://cdn.glitch.global/1760db9d-c13a-4b0a-a542-608419c30c2b/Colton's 2005 Nissan Titan 3.jpg?v=1631390716615"border="0"></img></a></div>
          <div style="display:block;text-align:center">&nbsp;</div>
        `);
    }else{
      respond.send(`<p> You must Login to view`)
    }
  }
});
