const setUpDatabase = () => {
    
        const connect = require('mongoose').connect(`${process.env.MONGO_DB_CLOUD}`, {
            useNewUrlParser: true, useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        // const connect = require('mongoose').connect(`${process.env.MONGO_DB_LOCAL}`, {
        //     useNewUrlParser: true, useCreateIndex: true,
        //     useUnifiedTopology: true,
        //     useFindAndModify: false
        // })
        connect
        .then(
            db => {
                console.log('MongoDB Initialized: Connected to femtobeast 1.0')
            },
            err => {
                console.log('MongoDB Connection Error: ', err)
            }
            )
            .catch(error => {
                console.log('Database Connection Error', error)
            })
        }
        
        module.exports = setUpDatabase
        
