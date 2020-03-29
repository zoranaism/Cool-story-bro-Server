const { Router } = require("express");
// const { toData } = require("../auth/jwt");
const HomePage = require("../models").homepage;
const Story = require("../models").story;
const User = require("../models/").user;
const Likes = require("../models/").userStory;
const auth = require("../auth/middleware");

const router = new Router();

router.post("/:id/stories", auth, async (req, res) => {
  const id = parseInt(req.params.id); // works

  const homepage = await HomePage.findByPk(id);
  console.log("This is the homepage", homepage);

  if (homepage === null) {
    return res.status(404).send({ message: "This homepage does not exist" });
  }

  if (!homepage.userId === id) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this homepage" });
  }

  const { name, imageUrl, content } = req.body;

  if (!name) {
    return res.status(400).send({ message: "A story must have a name" });
  }

  const story = await Story.create({
    name,
    imageUrl,
    content,
    homepageId: homepage.id
  });

  return res.status(201).send({ message: "Story created", story });
});

router.delete("/:homepageId/stories/:storyId", auth, async (req, res, next) => {
  const { storyId } = req.params;
  try {
    const story = await Story.findByPk(storyId);

    if (!story) {
      return res.status(404).send("Story not found.");
    }

    const result = await story.destroy();

    console.log("This is the result", result);

    res.json({ storyId });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", auth, async (req, res) => {
  // console.log("This is the homepage model", HomePage);
  const id = parseInt(req.params.id); // works
  const homepage = await HomePage.findByPk(id);

  // console.log("This is the homepage const", homepage);

  // console.log("Hompegae userId here", homepage.userId); // works

  if (!homepage.userId === id) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this homepage" });
  }

  const { title, description, backgroundColor, color } = req.body;

  await homepage.update({ title, description, backgroundColor, color });

  return res.status(200).send({ homepage });
});

router.get("/", async (req, res, next) => {
  // const limit = req.params.limit || 10;
  // const offset = req.params.offset || 0;

  try {
    const allHomepages = await HomePage.findAll({
      // limit,
      // offset,
      include: [
        { model: Story, include: [{ model: User, attributes: ["id", "name"] }] }
      ],
      order: [[Story, "createdAt", "DESC"]]
    });
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
      include: [
        { model: Story, include: [{ model: User, attributes: ["id", "name"] }] }
      ]
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

router.post("/stories/:storyId/like", auth, async (req, res, next) => {
  try {
    const storyId = parseInt(req.params.storyId);
    const userId = req.user.id;

    const foundLikes = await Likes.findOne({
      where: { storyId, userId }
    });

    if (!foundLikes) {
      const liked = await Likes.create({ userId, storyId });
      // console.log("Liked post?", liked);
      res.json({ storyId, userId });
    } else {
      res.status(409).send("Already exists. The request could not be completed due to a conflict with the current state of the target resource. ");
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
