const User = require("../models/user.model.js");
const Post = require("../models/post.model.js");


module.exports = function(app) {
//endpoint to access all the users except the logged in the user
app.get("/user/:userId", (req, res) => {
    try {
      const loggedInUserId = req.params.userId;
  
      User.find({ _id: { $ne: loggedInUserId } })
        .then((users) => {
          res.status(200).json(users);
        })
        .catch((error) => {
          console.log("Error: ", error);
          res.status(500).json("errror");
        });
    } catch (error) {
      res.status(500).json({ message: "error getting the users" });
    }
  });
  
  //endpoint to follow a particular user
  app.post("/follow", async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;
  
    try {
      await User.findByIdAndUpdate(selectedUserId, {
        $push: { followers: currentUserId },
      });
  
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error in following a user" });
    }
  });
  
  //endpoint to unfollow a user
  app.post("/users/unfollow", async (req, res) => {
    const { loggedInUserId, targetUserId } = req.body;
  
    try {
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: loggedInUserId },
      });
  
      res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error unfollowing user" });
    }
  });
  
  //endpoint to create a new post in the backend
  //done
  app.post("/create-post", async (req, res) => {
    try {
      const { content, userId } = req.body;
  console.log({ content, userId } )
      const newPostData = {
        user: userId,
      };
  
      if (content) {
        newPostData.content = content;
      }
  
      const newPost = new Post(newPostData);
  
      await newPost.save();
  
      res.status(200).json({ message: "Post saved successfully" });
    } catch (error) {
      res.status(500).json({ message: JSON.stringify( error) });
    }
  });
  
  //endpoint for liking a particular post
  //done
  app.put("/posts/:postId/:userId/like", async (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId; // Assuming you have a way to get the logged-in user's ID
  
    try {
      const post = await Post.findById(postId).populate("user", "name");
  
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } }, // Add user's ID to the likes array
        { new: true } // To return the updated post
      );
  
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      updatedPost.user = post.user;
  
      res.json(updatedPost);
    } catch (error) {
      console.error("Error liking post:", error);
      res
        .status(500)
        .json({ message: "An error occurred while liking the post" });
    }
  });
  
  //endpoint to unlike a post
  //done
  app.put("/posts/:postId/:userId/unlike", async (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;
  
    try {
      const post = await Post.findById(postId).populate("user", "name");
  
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
  
      updatedPost.user = post.user;
  
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      res.json(updatedPost);
    } catch (error) {
      console.error("Error unliking post:", error);
      res
        .status(500)
        .json({ message: "An error occurred while unliking the post" });
    }
  });
  
  //endpoint to get all the posts
  app.get("/get-posts", async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("user", "name")
        .sort({ createdAt: -1 });
  
      res.status(200).json(posts);
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while getting the posts" });
    }
  });
  
  app.get("/profile/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error while getting the profile" });
    }
  });
}