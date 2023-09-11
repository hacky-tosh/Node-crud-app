$(function () {
    var app = $.sammy(function () {
        this.element_selector = '#content';

        this.get('#/add', function (context) {
            context.$element().load('static/js/addEmployee.html', function () {
                $('#btnAdd').click(addOrUpdateEmloyee)
            });
        });


        this.get('#/add-bulk', function (context) {
            context.$element().load('static/js/addInBulk.html', function () {
                $('#btnUpload').click(uploadFile)
            });

        });



    
        this.get('#/list', function (context) {
            context.$element().load('static/js/listEmployee.html', function () {
                $.ajax({
                    url: "http://localhost:8000/list",
                    type: 'GET',
                    success: function (data) {
                        for (let index = 0; index < data.length; index++) {
                            $('tbody').append(
                                `<tr>` +
                                `<td>${data[index].firstName}</td>` +
                                `<td>${data[index].lastName}</td>` +
                                `<td>${data[index].phoneNumber}</td>` +
                                `<td>${data[index].email} </td>` +
                                `<td>${data[index].jobTitle}</td>` +
                                `<td>${data[index].salary} </td>` +
                                `<td><a href="#/add/${data[index].id}" class="btn btn-info" id="btnEdt">Edit</a></td>nbsp;` +
                                `<td><input type="button" onclick="deleteEmployee(${data[index].id})"class="btn btn-info" id="btnDel" value="Delete" /></td>` +
                                `</tr>`
                            );
                        }
                    }
                })
            })
        })



        this.get('#/add/:id', function (context) {
            context.$element().load('static/js/addEmployee.html', function () {
                $.ajax({
                    url: "http://127.0.0.1:8000/employee/" + location.hash.substring(6),
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data) {
                        $('#firstName').val(data.firstName)
                        $('#lastName').val(data.lastName)
                        $('#phoneNumber').val(data.phoneNumber)
                        $('#email').val(data.email)
                        $('#jobTitle').val(data.jobTitle)
                        $('#salary').val(data.salary)

                    }
                })
                $('#btnAdd').click(addOrUpdateEmloyee)

            });
          
        });


    
    });

    app.run();
});


  
function uploadFile() {
    const fileInput = $('#fileInput')[0].files[0];
    if (!fileInput) {
        alert('Please select an Excel file to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput);

    $.ajax({
        url: 'http://127.0.0.1:8000/upload',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            alert(data.message);
        },
        error: function () {
            console.log('Failed to upload the Excel file. Please try again.');
        },
    });
}




function addOrUpdateEmloyee() {
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const phoneNumber = $('#phoneNumber').val();
    const email = $('#email').val();
    const jobTitle = $('#jobTitle').val();
    const salary = $('#salary').val();

    const nameRegex = /^[A-Za-z]+$/;
    const phoneNumberRegex = /^\d+$/;
    const emailRegex = /\S+@\S+\.\S+/;

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        alert('First name and last name can only contain letters.');
        return;
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
        alert('Phone number can only contain numbers.');
        return;
    }

    if (!emailRegex.test(email)) {
        alert('Invalid email address.');
        return;
    }

    if (isNaN(salary) || salary === '') {
        alert('Salary must be a valid number.');
        return;
    }

    var employee = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        jobTitle: jobTitle,
        salary: salary,
    };

    let id = location.hash.substring(6);

    if (!id) {
        $.ajax({
            url: "http://127.0.0.1:8000/employee",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(employee),
            success: function (data) {
                alert("Employee data added successfully");
                clearForm();
            }
        });
    } else {
        $.ajax({
            url: "http://127.0.0.1:8000/employee/" + id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(employee),
            success: function (data) {
                alert("Employee data updated successfully");
                clearForm();
            }
        });
    }
}



function clearForm() {
    $('#firstName').val('');
    $('#lastName').val('');
    $('#phoneNumber').val('');
    $('#email').val('');
    $('#jobTitle').val('');
    $('#salary').val('');
  }
  



function deleteEmployee(id) {
    $.ajax({
        url: "http://127.0.0.1:8000/delete",
        type: 'DELETE',
        data: JSON.stringify({ "id": id }),
        contentType: 'application/json',
        success: function (data) {
            alert("Employee data deleted successfully")
            updateEmployeeList();       
         }
        
    })
}


function updateEmployeeList() {
    $.ajax({
      url: "http://localhost:8000/list",
      type: 'GET',
      success: function (data) {
        $('tbody').empty();
          for (let index = 0; index < data.length; index++) {
          $('tbody').append(
            `<tr>` +
            `<td>${data[index].firstName}</td>` +
            `<td>${data[index].lastName}</td>` +
            `<td>${data[index].phoneNumber}</td>` +
            `<td>${data[index].email} </td>` +
            `<td>${data[index].jobTitle}</td>` +
            `<td>${data[index].salary} </td>` +
            `<td><a href="#/add/${data[index].id}" class="btn btn-info" id="btnEdt">Edit</a></td>nbsp;` +
            `<td><input type="button" onclick="deleteEmployee(${data[index].id})" class="btn btn-info" id="btnDel" value="Delete" /></td>` +
            `</tr>`
          );
        }
      },
      error: function () {
        alert("Failed to fetch employee list");
      }
    });
  }

