const mongodbClient = require('./mongo.connector')
const app = require('express')()
const user = require('./user')
const item = require('./item')
const list = require('./list')
const bodyParser = require('body-parser')

mongodbClient.init()
.then(client =>{
    app.use(bodyParser.json())
    app.use('/user', user)
    app.use('/item', item)
    app.use('/list', list)

    app.get('/', (req, res) => {
        res.send('Hello world !')
    })

    app.listen(9999, () => {
        console.log('App listening on port 9999')
    })

}).catch(err=>{
    throw err
})