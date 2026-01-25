import express, { urlencoded } from 'express'
import cors from 'cors'
import cookirParser from 'cookie-parser'

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookirParser())


import userRouter from "./routes/user.routes.js"
import studentRouter from './routes/student.routes.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/students", studentRouter)

export {app}