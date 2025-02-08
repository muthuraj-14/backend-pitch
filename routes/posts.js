const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Get all posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
});

// Get a single post by ID
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Error fetching post", error: error.message });
    }
});

// Create a new post
router.post("/", async (req, res) => {
    try {
        const { title, description, category, author, image } = req.body;
        
        if (!title || !description || !category || !author) {
            return res.status(400).json({ message: "All fields (title, description, category, author) are required" });
        }

        const newPost = new Post({
            title,
            description,
            category,
            author,
            image
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ message: "Error creating post", error: error.message });
    }
});

// Update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.title = req.body.title || post.title;
        post.description = req.body.description || post.description;
        post.category = req.body.category || post.category;
        post.author = req.body.author || post.author;
        post.image = req.body.image || post.image;
        post.updatedAt = Date.now(); // Update timestamp

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: "Error updating post", error: error.message });
    }
});

// Delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error: error.message });
    }
});

// Fetch posts by category name
router.get("/category/:name", async (req, res) => {
    try {
        const categoryName = req.params.name;  // Get category name from params

        // Find posts where category matches the category name
        const posts = await Post.find({ category: categoryName });

        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this category" });
        }

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts by category", error: error.message });
    }
});

module.exports = router;
