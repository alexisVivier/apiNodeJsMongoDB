const MongoClient = require('mongodb').MongoClient

//connection url
const url = 'mongodb://localhost:27017'

// database name
const dbName = 'db'

//create new mongo client
const client = new MongoClient(url,{useNewUrlParser:true})

class MongoConnector{
    init(){
        return new Promise((resolve, reject)=>{
            client.connect()
            .then(connectedClient => {
                this.client = connectedClient
                this.db = connectedClient.db(dbName)
                console.log("Connected succesfully")
                resolve(connectedClient)
            }).catch(err=>{
                console.error('Failed to connect')
                throw err
            })
        })
    }
}
const connector = new MongoConnector()
module.exports = connector