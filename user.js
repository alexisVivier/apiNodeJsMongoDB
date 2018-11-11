const express = require('express');
const router = express.Router();
const connector = require('./mongo.connector')



//GET
router.get('/', (req, res) => {
    connector.db.collection("user").find({}).toArray((err, result)=> {
        if (err) throw err;
        res.send(result)
    });
});


//GET by ID
router.get('/:userId', (req, res) => {

    //On récupère l'id
    let id = parseInt(req.params.userId);
    
    //On va chercher l'user qui correspond
    connector.db.collection("user").find({ "_id" : id }).toArray((err, result)=> {
        if (err) throw err;
        res.send(result)
    });
});


//DELETE
router.delete('/:userId', (req, res) => {

    //On récupère l'id
    let id = parseInt(req.params.userId);

    //Ligne pour supprimer une ligne
    connector.db.collection("user").deleteOne( { "_id" : id } );

    //On sélectionne tous les users pour vérifier la suppression
    connector.db.collection("user").find({}).toArray((err, result)=> {
        if (err) throw err;
        res.send(result)
    });
    
});


//POST
router.post('/', (req, res) => {

    //On récupère les infos envoyées depuis le body
    let newUserName = req.body.name
    let newUserAge = req.body.age


    //Init de l'id de l'user à créer
    var newUserId = 0;

    //Variables du while
    let end = false
    let i = 0;


    connector.db.collection("user").find({}).toArray((err, result)=> {
        if (err) throw err;

        while(end == false){

            //Si l'emplacement dans la liste est dispo
            if(result[i] == null){
                newUserId = i
                end = true
            }
            
            //Sinon
            else{
                i++
            }
        }

        //On créé le nouveau user a ajouter en suivant le model du JSON qui contient tout
        var newUser = {
            _id: newUserId,
            "name" : newUserName,
            "age" : newUserAge
        }

        connector.db.collection('user').insertOne(newUser).catch((err)=>{
            throw err
        });
    
    });

})


//PUT
router.put('/', (req, res) => {

    //On récupère les données depuis le body
    let updateUserName = req.body.name
    let updateUserAge = parseInt(req.body.age)
    let updateUserId = parseInt(req.body.id)

    //On modifie l'user
    connector.db.collection("user").updateOne(
        { "_id" : updateUserId },
        { $set: { "name" : updateUserName, "age" : updateUserAge }
    });

    //On sélectionne tous les users pour vérifier la modification
    connector.db.collection("user").find({}).toArray((err, result)=> {
        if (err) throw err;
        res.send(result)
    });

})

module.exports = router;