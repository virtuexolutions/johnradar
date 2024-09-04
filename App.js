const express = require('express')

const ConnectDataBase = require('./ConfigDatabase/Database.js')
const Route = require('./routes/UserRoute.js')
const cors = require('cors')
const http = require('http')
const dotenv = require('dotenv').config()

const app = express()


ConnectDataBase()
app.use(express.json())
app.use("/api/user", Route)
app.use("/uploads", express.static('uploads'));
// const server = http.createServer(app);
// const io = new Server(server);




app.get('/', (req, res) => {
    res.send("Hello world! how  ?")
})

app.listen(process.env.PORT, () => [
    console.log("listening on port: " + process.env.PORT)
])

