const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db',
  logging: false
// Global options to adjust models
  // define: {
  //   freezeTableName: true,
  //   timestamps: false,
  // }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

const db = {
  sequelize,
  Sequelize,
  models: {},
};

//imports new model
db.models.User = require('./models/User.js')(sequelize);
db.models.Course = require('./models/Course.js')(sequelize);


module.exports = db;
