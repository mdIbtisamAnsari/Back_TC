import connectdb from "./db/index.js";
import {app} from "./app.js";

connectdb()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`surver is running on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Error Connecting DataBase", err)
})