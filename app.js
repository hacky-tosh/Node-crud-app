const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');

const fileValidation = require('./static/js/fileValidations');


const employeeQuery = require('./query/query');

const app = express();
const port = 8000;


// setting multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});


const upload = multer({ storage: storage });

app.use('/static', express.static('static'));

app.use(express.json());

app.use(cors());

app.get('', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    res.sendFile(filePath);
});


app.post('/employee', (req, res) => {
    employeeQuery.addEmployee(req.body.firstName, req.body.lastName, req.body.phoneNumber, req.body.email, req.body.jobTitle, req.body.salary);
    res.status(200).json("Added Successfully!");
})

app.get('/list', async (req, res) => {

    let data = await employeeQuery.getAllEmployee();
    res.status(200).send(data);
});




app.get("/employee/:id", async function (req, res){
    let data = await employeeQuery.getEmployeeData(req.params.id);
    res.status(200).send(data);
})



app.put("/employee/:id", async function (req, res) {
    try {
        await employeeQuery.updateEmployeeData(req.params.id, req.body.firstName, req.body.lastName, req.body.phoneNumber, req.body.email, req.body.jobTitle, req.body.salary);
        res.status(200).json({ message: "Employee data updated successfully" });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: "Failed to update employee data" });
    }
});


app.delete('/delete', async function (req, res) {
    await employeeQuery.deleteEmployee(req.body.id);
    let data = "Employee Data deleted successfully!"
    res.status(200).send(data);
})

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { path: filePath } = req.file;

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        //   console.log("*************");
        //   console.log(data);
          
        let [employeesData,validationErrors] = fileValidation.validations(data);

        const result = await employeeQuery.addEmployeesBulk(employeesData);

        fs.unlinkSync(filePath);

        const successCount = result.length;
        const errorCount = validationErrors.length;
        let responseMessage = `Successfully inserted ${successCount} rows.\n`;
        if (errorCount > 0) {
          responseMessage += `Failed to insert ${errorCount} rows:\n`;
          responseMessage += validationErrors.join('\n');
        }
    
        res.status(200).json({ message: responseMessage });
    } catch (error) {
        console.error('Error processing the Excel file:', error);
        res.sendStatus(500);
    }
});


app.listen(port, () => {
    console.log(`server is running at http://127.0.0.1:${port}/`);
})


