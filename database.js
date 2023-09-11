const Sequelize = require('sequelize');

const db = {};


const sequelize = new Sequelize('office', 'ashu', 'AGAMI@566ashu', {
    host: 'localhost',
    dialect: 'mysql'
});


db.employee = require('./models/empModel')(sequelize, Sequelize);


sequelize.sync({ force: false })
    .then(() => {
        console.log(`Database & tables created!`);
    });


sequelize.authenticate().then(() => {
    console.log("connection successfull!");
}).catch(err => {
    console.error('connection unsuccessful!: ', err);
})

module.exports.employee = db.employee;
