//importing modules
const express = require('express')
const sequelize = require('sequelize')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
 const db = require('./Models')
 const userRoutes = require ('./Routes/userRoutes')
 const dealRoutes = require('./Routes/dealRoutes')
 const documentRoutes = require('./Routes/documentRoutes') // Add this line
 const transactionRoutes = require('./Routes/transactionRoutes'); // Add this line
 const auditLogRoutes = require('./Routes/auditLogRoutes'); // Add this line
 const investorsDealsRoutes = require('./Routes/investorsDealsRouter'); // Add this line


//setting up your port
const PORT = process.env.PORT || 8080

//assigning the variable app to express
const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

//synchronizing the database and forcing it to false so we dont lose data
db.sequelize.sync({ force: false }).then(() => {
    console.log("db has been re sync")
})

//routes for the user API
app.use('/api/users', userRoutes)
app.use('/api/deals', dealRoutes)
app.use('/api/documents', documentRoutes) 
app.use('/api/transactions', transactionRoutes); // Add this line
app.use('/api/audit-logs', auditLogRoutes); // Add this line
app.use('/api/audit-logs', auditLogRoutes); // Add this line
app.use('/api/investors-deals', investorsDealsRoutes); // Add this line


//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))