const db = require('../database');



const employee = db.employee;

module.exports.addEmployee = async (firstName, lastName, phoneNumber, email, jobTitle, salary) => {
    return await employee.create({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        jobTitle: jobTitle,
        salary: salary
    })
};


module.exports.getAllEmployee = async () => {
    let empData = await employee.findAll();
    return empData;
}

module.exports.getEmployeeData = async (id) => {
    let empData = await employee.findByPk(id);
    return empData;
}
module.exports.updateEmployeeData = async (id, firstName, lastName, phoneNumber, email, jobTitle, salary) => {
    let empData = await employee.update({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        jobTitle: jobTitle,
        salary: salary
    }, { where: { id: id } });
    return empData;
}

module.exports.deleteEmployee = async (id) => {
    return await employee.destroy({
        where: { id: id }
    })

}


module.exports.addEmployeesBulk = async (employeesData) => {
    try {
        const result = await employee.bulkCreate(employeesData, { validate: true });

        console.log(`Successfully added ${result.length} employees.`);
        return result;
    } catch (error) {
        console.error('Error adding employees in bulk:', error);
        throw error;
    }
};


