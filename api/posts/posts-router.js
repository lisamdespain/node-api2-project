// implement your posts router here
const Post = require('./posts-model')
const express = require('express');

const router = express.Router();

router.get('/', (req, res) =>{
    Post.find()
    .then(posts => {
        res.status(200).json(posts);
    }).catch(error =>{
        console.log(error)
        res.status(500).json({message: 'The posts information could not be retrieved'})
    })
})

router.get('/:id', (req, res) =>{
    Post.findById(req.params.id)
    .then(post =>{
        if (post){
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'The post with the specified id does not exist'})
        }
    }).catch(error =>{
        res.status(500).json({message: 'The post information could not be retrieved'})
    })
})

router.post('/', (req, res)=>{
    let { title, contents } = req.body;
    

    if (title == null || contents == null){
        res.status(400).json({message: 'Please provide title and contents for the post'});
        
    } else {
    Post.insert({title, contents})
    .then(({id}) =>{
        return Post.findById(id)
    })
    .then(postById =>{
        res.status(201).json(postById)
    })
    .catch(error =>{
        res.status(500).json({message: 'There was an error while saving the post to the database'})
    })
    
}
})

router.delete('/:id', async (req, res) =>{
    
    const post = await Post.findById(req.params.id)
    Post.remove(req.params.id)
    .then(deletedPost =>{
        if (!deletedPost) {
            res.status(404).json({message: 'The post with the specified id does not exist'});
            return;
        } res.status(200).json(post)

}) .catch (error =>{
        res.status(500).json({message: 'The post could not be removed'})
    })
})


router.get('/:id/comments', async (req, res) =>{
    const post = await Post.findById(req.params.id)
    if (!post){
        res.status(404).json({message: 'The post with the specified ID does not exist'})
        return;
    }
    Post.findPostComments(req.params.id)
    .then(postComments =>{
        res.status(200).json(postComments)

    
    }).catch(error =>{
        res.status(500).json({message: 'The comments information could not be retrieved'})
    })
})

router.put('/:id', (req, res) =>{
    let { title, contents } = req.body;
    if (title == null || contents == null){
        res.status(400).json({message: 'Please provide title and contents for the post'})
        return;
    }
    Post.update(req.params.id, {title: title, contents: contents})
    .then(updatedPost =>{
        if (!updatedPost) {
            res.status(404).json({message: 'The post with the specified ID does not exist'})
            return;
            
        } else {
            return Post.findById(req.params.id)
        }
    }).then(post => {
        res.status(200).json(post)
    })
})
module.exports = router;