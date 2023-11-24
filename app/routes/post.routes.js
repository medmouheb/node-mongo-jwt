const User = require("../models/user.model.js");
const Post = require("../models/post.model.js");


module.exports = function (app) {
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

      await User.findByIdAndUpdate(currentUserId, {
        $push: { sentFollowRequests: selectedUserId },
      });

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error in following a user" });
    }
  });

  app.get("/verify/:token", async (req, res) => {
    try {
      const token = req.params.token;

      const user = await User.findOne({ verificationToken: token });
      if (!user) {
        return res.status(404).json({ message: "Invalid token" });
      }

      user.verified = true;
      user.verificationToken = undefined;
      await user.save();

      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      console.log("error getting token", error);
      res.status(500).json({ message: "Email verification failed" });
    }
  });

  //endpoint to unfollow a user
  app.post("/users/unfollow", async (req, res) => {
    const { loggedInUserId, targetUserId } = req.body;
    console.log({ loggedInUserId, targetUserId })
    try {
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: loggedInUserId },
      });

      await User.findByIdAndUpdate(loggedInUserId, {
        $pull: { sentFollowRequests: targetUserId },
      });
      console.log("jjj::")
      res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error unfollowing user" });
    }
  });

  //endpoint to create a new post in the BACKEND
  //done
  app.post("/create-post", async (req, res) => {
    try {
      const { content, userId } = req.body;
      console.log({ content, userId })
      const newPostData = {
        user: userId,
      };

      if (content) {
        newPostData.content = content;
      }

      const newPost = new Post(newPostData);

      await newPost.save();

      res.status(200).json(newPost);
    } catch (error) {
      res.status(500).json({ message: JSON.stringify(error) });
    }
  });

  app.put("/create-replay", async (req, res) => {
    try {
      const { content, userId, postId } = req.body;
      console.log({ content, userId, postId })

      const updatedPost= await Post.findByIdAndUpdate(postId, { $addToSet: { replies: { user: userId, content: content } } }, 
      { new: true }
        
      //   {
      //   $push: { replies: { user: userId, content: content } }
      // }
      ).then(el=>{
        console.log(el)
        return el
      })
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: JSON.stringify(error) });
    }
  });


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
        .populate("user", "username avatar id")
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


  app.get('/user/followers/:userId', async (req, res) => {
    try {
      const loggedInUserId = req.params.userId;

      // Find the logged-in user
      const loggedInUser = await User.findById(loggedInUserId).populate('sentFollowRequests');

      if (!loggedInUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Extract followers from the logged-in user
      const followers = loggedInUser.sentFollowRequests;

      res.status(200).json(followers.map(el => { return { _id: el._id, username: el.username, avatar: el.avatar, followers: el.followers.length } }));
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Endpoint to get users not in the followers array of the logged-in user
  app.get('/user/nonfollowers/:userId', async (req, res) => {
    try {
      const loggedInUserId = req.params.userId;

      // Find the logged-in user
      const loggedInUser = await User.findById(loggedInUserId)

      if (!loggedInUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Extract followers from the logged-in user
      const followers = [...loggedInUser.sentFollowRequests, loggedInUserId];

      // Find users who are not in the followers array
      const nonFollowers = await User.find({ _id: { $nin: followers } }).select('_id username avatar followers');

      res.status(200).json(nonFollowers.map(el => { return { _id: el._id, username: el.username, avatar: el.avatar, followers: el.followers.length } }));
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
}