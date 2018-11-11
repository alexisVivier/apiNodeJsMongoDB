const express = require('express');
const router = express.Router();
const fs = require('fs')
const connector = require('./mongo.connector')


//GET
router.get('/', (req, res) => {

    connector.db.collection("list").find({}).toArray((err, result)=> {
        if (err) throw err;
        res.send(result)
    });

});


//GET by ID
router.get('/:listId', (req, res) => {

    //On récupère l'id
    let id = parseInt(req.params.listId);
    
    //On va chercher l'user qui correspond
    connector.db.collection("list").find({ "_id" : id }).toArray((err, result)=> {
        if (err) throw err;
        res.send(result)
    });

});


//DELETE
router.delete('/:listId', (req, res) => {

    //On récupère l'id
    let id = parseInt(req.params.listId);

    //Ligne pour supprimer une ligne
    connector.db.collection("list").deleteOne( { "_id" : id } );

    //On sélectionne tous les users pour vérifier la suppression
    connector.db.collection("list").find({}).toArray((err, result)=> {
        if (err) throw err;
        res.send(result)
    });

});


//POST
router.post('/', (req, res) => {
    let newListName = req.body.name
    let newListUser = req.body.user
    let newListItem = req.body.item
    
    //Init de l'id de l'user à créer
    var newListId = 0;

    //Variables du while
    let end = false
    let i = 0;

    connector.db.collection("list").find({}).toArray((err, result)=> {

        while(end == false){

            //Si l'emplacement dans la liste est dispo
            if(result[i] == null){
                newListId = i
                end = true
            }
            
            //Sinon
            else{
                i++
            }
        }

        //On créé la nouvelle liste a ajouter en suivant le model du JSON qui contient tout
        var newList = {
            _id: newListId,
            "name" : newListName,
            "user" : newListUser,
            "item" : newListItem
        }

        //On ajoute la liste précédemment créée
        connector.db.collection('list').insertOne(newList).catch((err)=>{
            throw err
        });

        //On affiche la liste après ajout
        connector.db.collection("list").find({}).toArray((err, result)=> {
            if (err) throw err;
            res.send(result)
        });

    });
    
})


//PUT
router.put('/', (req, res) => {
    let updateListName = req.body.name
    let updateListUser = req.body.user
    let updateListItem = req.body.item
    let updateListId = parseInt(req.body.id)
    
    //On modifie la liste
    connector.db.collection("list").updateOne(
        { "_id" : updateListId },
        { $set: { "name" : updateListName, "user" : updateListUser, "item" : updateListItem }
    });

    //On sélectionne toutes les listes pour vérifier la modification
    connector.db.collection("list").find({}).toArray((err, result)=> {
        if (err) throw err;
        res.send(result)
    });
    
})

module.exports = router;