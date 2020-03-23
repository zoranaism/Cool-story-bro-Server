("use strict");
const HomePage = require("../models").homepage;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        {
          title: "My time at Codaisseur",
          description: "A tell all tale",
          backgroundColor: "#ffffff",
          color: "#000000",
          userId: 1,
        },
        {
          title: "I am a dummy",
          description: "A dummy description",
          backgroundColor: "#ffffff",
          color: "#000000",
          userId: 2,
        },
      ].map(homepage => HomePage.create(homepage))
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("homepages", null, {});
  }
};
