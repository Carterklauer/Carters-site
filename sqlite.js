const fs= require("fs")
// Initialize Database
const DBFile="./src/Site-Database.db"
const exists= fs.existsSync(DBFile)
const sqlite3= require("sqlite3").verbose()
const dbWrapper= require("sqlite");

let db;
dbWrapper.open({ filename: DBFile,
                driver:sqlite3.Database
  
}).then(async DBase=>{db=DBase
    try{
      if(!exists){
        await db.run("Create Table User(Username Text Primary Key, Name Text, Email Text, Password Text Not Null, Account_Type Text Not Null)")
        await db.run("Insert Into User(Username, Name, Email, Password, Account_Type)"+
                     "Values ('Carter', 'Carter', 'Carterisfun2500@gmail.com', 'Cayleycute2', 'Owner'),"
                     +" ('Colton', 'Colton', 'Coltonengel07@icloud.com', 'NissanTitan2005', 'Administrator')")
        await db.run("Insert Into User(Username, Name, Password, Account_Type)"+
                     "Values('Cameron', 'Cameron', 'RhodaV1916', 'Administrator')");
        console.log(await db.all("Select * From User"))
      }else{
        console.log(await db.all("Select * from User"))
      }}catch(dbError){
        console.log(dbError)
      }
    }
       )
module.exports= {
    AddUser: async(username, name, email, password, account_type) =>{
    try{
      db.run("Insert Into User (Username, Name, Email, Password, Account_Type)"+
            "Values(?,?,?,?,?)",[username, name, email, password,account_type])
    }catch(dbError){
      console.log(dbError)
    }
  },
  ChangePassword: async(new_password, username)=>{
    try{
      db.run("Update User Set Password = ? Where Username = ?",[new_password, username])
    }catch(dbError){
      console.log(dbError)
      return 1;
    }
  },
  GetUsers: async()=>{
    try{
      return await db.all("Select * From User");
    }catch(dbError){
      console.log(dbError)
      return []
    }
  },
  InitializeUsers: async()=>{
    try{
      await db.run("Create Table User(Username Varchar(16) Primary Key, Name Text, Email Text, Password Varchar(24) Not Null, Account_Type Text Not Null)")
      await db.run("Insert Into User(Username, Name, Email, Password, Account_Type)"+
            "Values ('Carter', 'Carter','Carterisfun2500@gmail.com', 'Cayleycute2', 'Owner'),"+
            "('Colton', 'Colton', 'Coltonengel@icloud.com', 'NissanTitan2005', 'Administrator'),"+
            "('Cameron', 'Cameron', Null, 'RhodaV1916', 'Administrator')")
      return 0
    }catch(dbError){
      return 1
    }
  }, 
  GetUsersExceptAccountType: async account_type=>{
    try{
      return await db.all("Select * From User Where Account_Type!=?", [account_type])
    }catch(dbError){
      
    }
  },
  DeleteUser: async username=>{
    try{
      await db.all("Delete From User Where Username=?", [username])
      return 0;
    }catch(dbError){
      console.log(dbError)
      return 1;
    }
  }
}