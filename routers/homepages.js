const { Router } = require("express");
// const { toData } = require("../auth/jwt");
const HomePage = require("../models").homepage;
const Story = require("../models").story;

const router = new Router();

router.get("/", async (req, res, next) => {
  // const limit = req.params.limit || 3;
  // const offset = req.params.offset || 0;

  try {
    const allHomepages = await HomePage.findAll();
    res.status(200).json(allHomepages);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    // const story = Story.findAll({ where: { homepageId: id } });
    const homepage = await HomePage.findByPk(id, {
      include: [Story]
    });
    // console.log("THIS IS THE HOMEPAGE", homepage);

    if (!homepage) {
      res.status(404).send("No homepage found");
    } else {
      res.status(200).json(homepage);
    }
  } catch (error) {
    next(error);
  }
});

// app.get("/users/:userId/lists", async (req, res, next) => {
//   try {
//     const userId = parseInt(req.params.userId);
//     const user = await User.findByPk(userId, {
//       include: [TodoList],
//     });
//     if (user) {
//       res.send(user.TodoLists);
//     } else {
//       res.status(404).send("User not found");
//     }
//   } catch (e) {
//     next(e);
//   }
// });

module.exports = router;

// router.get("/", (req, res, next) => {
//   const limit = req.query.limit || 25;
//   const offset = req.query.offset || 0;

//   HomePage.findAndCountAll({ limit, offset })
//     .then(result => res.send({ homepages: result.rows, total: result.count }))
//     .catch(error => next(error));
// });

// router.post("/", async (req, res, next) => {
//   try {
//     const { title, url } = req.body;
//     if (!title || !url) {
//       res.status(400).send("missing parameters");
//     } else {
//       const newImage = await Image.create(req.body);
//       res.json(newImage);
//     }
//   } catch (e) {
//     next(e);
//   }
// });

// router.get("/:id", async (req, res, next) => {

//   const { id } = req.params;
//   try  {
//     const image = await Image.findByPk(id);

//     if (!image) {
//       res.status(404).send("No image found");
//     } else {
//       res.json(image);
//     }

//   } catch (error) {
//     next(error);
//   }

// });
