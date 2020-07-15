const Post = require('../models/post');
const Like = require('../models/like');
const Comment = require('../models/comment');
const fs = require('fs')

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.status(200).send(posts)
    } catch (err) {
        res.status(500).send(err)
    }
}

exports.getOnePost = async (req, res) => {
    try {
        const post = await Post.findOne({ where: {
        id: req.params.id}})
        if (!post) {
            res.status(404).send({ message: "Post has not been found!"})
        }
        res.status(200).send(post)
    } catch (err) {
        res.status(500).send(err)
    }
}

exports.createPost = async (req, res) => {
    try {
        const postObject = req.file ? {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...JSON.parse(req.body.post)}
            await Post.create({ 
                ...postObject,
                username: req.user.username,
                avatar: req.user.imageUrl,
                userId: req.user.id
             })
            
        res.status(201).send({ message: 'Post has been created'})
    } catch (err) {
        res.status(500).send(err)
    }
}

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findOne({ where: {
            id: req.params.id
        }})        
        if (req.file) {
            const filename = post.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, (err) => {
                if (err) throw err;
                console.log('Image has been deleted')
            })
        }
        const postObject = req.file ? {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
           ...JSON.parse(req.body.post) 
        }
        if (post && post.userId !== req.user.id) {
            return res.sendStatus(401);
        }
        await post.update({
            ...postObject, id: req.params.id},
        )
        res.status(200).send({ message: 'Post has been updated'})
    } catch (err) {
        res.sendStatus(500)    
    }
}

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findOne({ where: {
            id: req.params.id
        }})
        
        if (post.imageUrl) {
            const filename = post.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, (err) => {
                if (err) throw err;
                console.log('Image has been deleted')
            })
        }
        if (post && post.userId !== req.user.id) {
            return res.sendStatus(401);
        }
        await Post.destroy({ where: {
            id: req.params.id
        }})
        await Like.destroy({ where: {
            postId: req.params.id
        }})
        await Comment.destroy({ where: {
            postId: req.params.id
        }})
        res.status(200).send({ message: "Post has been deleted ! "})
    } catch (err) {
        res.status(500).send(err)
    }
}

// exports.getAllUserPosts = async (req, res) => {
//     try {
//         const posts = await Post.findAll({ where: {
//             userId: req.user.id
//         }})
//         res.status(200).send(posts)
//     } catch (err) {
//         res.sendStatus(500)
//     }
// }