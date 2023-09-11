module.exports = (sequelize, Sequelize) => {
    const employee = sequelize.define('employee', {
        firstName: {
            type: Sequelize.STRING,
            field: 'firstName'
        },
        lastName: {
            type: Sequelize.STRING,
            field: 'lastName'
        },
        phoneNumber: {
            type: Sequelize.STRING,
            field: 'phoneNumber'
        },
        email: {
            type: Sequelize.STRING,
            field: 'email'
        },
        jobTitle: {
            type: Sequelize.STRING,
            field: 'jobTitle'
        },
        salary: {
            type: Sequelize.INTEGER,
            field: 'salary'
        },

    }
    );
    return employee;
}

