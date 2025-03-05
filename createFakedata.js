const fs = require("fs/promises")

console.log("hello")
let createUser = (_id, name, email) =>{
    return {
        name,
        email,
        fake: true,
        goals: [],
        __v: 0,
        friends: [],
        incomingFriendRequests: [],
        outgoingFriendRequests: []
    }
}
let insertData = () =>{
    let users = [];
    for(let i = 0; i < 20; i++){
        users.push(createUser(1, `Aurora`+i, `aurymetta${i}@gmail.com`));
        users.push(createUser(2, `Giacomo`+i, `giacomo${i}@gmail.com`))
        users.push(createUser(3, `Daniele`+i, `daniele${i}@gmail.com`))
        users.push(createUser(4, `Arianna`+i, `arianna${i}@gmail.com`));
        users.push(createUser(5, `Cinzia`+i, `cinzia${i}@gmail.com`))
        users.push(createUser(6, `Salvatore`+i, `salvatore${i}@gmail.com`))
    }
    
    fs.writeFile("data.json", JSON.stringify(users))
}
insertData()