module.exports.validations = (data) => {
  const employeesData = [];
  const validationErrors = [];
  for (const row of data) {
    const { firstName, lastName, phoneNumber, email, jobTitle, salary } = row;

    const nameRegex = /^[A-Za-z]+$/;
    const phoneNumberRegex = /^\d+$/;
    const emailRegex = /\S+@\S+\.\S+/;

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      validationErrors.push(`Invalid first name or last name: ${firstName} ${lastName}`);
      continue;
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
      validationErrors.push(`Invalid phone number: ${phoneNumber}`);
      continue;
    }

    if (!emailRegex.test(email)) {
      validationErrors.push(`Invalid email address: ${email}`);
      continue;
    }

    if (isNaN(salary) || salary === '') {
      validationErrors.push(`Invalid salary: ${salary}`);
      continue;
    }

    employeesData.push({
      firstName,
      lastName,
      phoneNumber,
      email,
      jobTitle,
      salary,
    });
  }

  return [employeesData,validationErrors];
};