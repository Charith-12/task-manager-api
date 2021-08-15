const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");
const auth = require("../middleware/auth");

const router = new express.Router();

// router.get("/test", (req, res) => {
//   res.send("This is my other route. from a file");
// });

// ..........  Create Account   ...........................................
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }

  //   user
  //     .save()
  //     .then(() => {
  //       res.status(201).send(user);
  //     })
  //     .catch((e) => {
  //       res.status(400).send(e);
  //     });
});

// ..........  Login   ..................................................
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user /*: user.getPublicProfile()*/, token });
  } catch (e) {
    res.status(400).send();
  }
});

// ..........  LogOut   ....................................................
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// ................. Log out All ...........................................
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// ..........  Get All Users   ..............................................
// router.get("/users", auth, async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (e) {
//     res.status(500).send();
//   }

//   //   User.find({})
//   //     .then((users) => {
//   //       res.send(users);
//   //     })
//   //     .catch((e) => {
//   //       res.status(500).send();
//   //     });
// });

// ..........  Get my own user profile   ...........................................
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user); // data that added to the req by the middleware
});

// ..........  Get Any User by ID   ................................................
// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }

//   //   User.findById(_id)
//   //     .then((user) => {
//   //       if (!user) {
//   //         return res.status(404).send();
//   //       }

//   //       res.send(user);
//   //     })
//   //     .catch((e) => {
//   //       res.status(500).send();
//   //     });
// });

// ..........  Update my User profile   ...........................................
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e); // validation error
  }
});

// ..........  Delete User (my user profile)  ...........................................
router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);

    // if (!user) {
    //   return res.status(404).send();
    // }

    // res.send(user);

    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

// ..........  Update User by ID   ...........................................
// router.patch("/users/:id", async (req, res) => {
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ["name", "email", "password", "age"];
//     const isValidOperation = updates.every((update) =>
//       allowedUpdates.includes(update)
//     );

//     if (!isValidOperation) {
//       return res.status(400).send({ error: "Invalid Updates!" });
//     }

//     try {
//       const user = await User.findById(req.params.id);
//       updates.forEach((update) => (user[update] = req.body[update]));
//       await user.save();

//       // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//       //   new: true,
//       //   runValidators: true,
//       // });              // Skips middleware

//       if (!user) {
//         return res.status(404).send();
//       }

//       res.send(user);
//     } catch (e) {
//       res.status(400).send(e); // validation error
//     }
//   });

// ................... Upload Avatar ............................................................

// middleware
const avatarUpload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please only upload a image file."));
    }

    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  avatarUpload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// ................... Deleting Avatar ............................................................
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

// ................... Showing the Avater ..........................................................
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
