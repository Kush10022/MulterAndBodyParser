const fs = require('fs');
let employees = [];
let departments = [];
let managers = [];

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/employees.json', (err, data) => {
      if (err) {
        reject(err);
      }
      employees = JSON.parse(data);
      resolve();
    });
    fs.readFile('./data/departments.json', (err, data) => {
      if (err) {
        reject(err);
      }
      departments = JSON.parse(data);
      resolve();
    });
  });
};

module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
    if (employees.length == 0) {
      reject('No Employee Found!');
    }
    resolve(employees);
  });
};

module.exports.getManagers = function () {
  return new Promise((resolve, reject) => {
    var managers = [];
    for (let i = 0; i < employees.length; i++) {
      if (employees[i].isManager == true) {
        managers.push(employees[i]);
      }
    }
    if (managers.length == 0) {
      reject('No Managers Found!');
    }
    resolve(employees);
  });
};

module.exports.getDepartments = function () {
  return new Promise((resolve, reject) => {
    if (departments.length == 0) {
      reject('No Department Found!');
    }
    resolve(departments);
  });
};

// Adding "addEmployee" function within data-service.js
module.exports.addEmployee = function(employeeData) {
  return new Promise((resolve, reject)=> {
    if (employeeData.isManager == undefined) {
      employeeData.isManager = false;
      //reject("Managers not found");
    } else{
      employeeData.isManager = true;
    }
    employeeData.employeeNum = employees.length+1;
    employees.push(employeeData);
    resolve(employees);
  });
}

module.exports.getEmployeesByStatus = function(status) {
  return new Promise((resolve, reject)=> {
    var employeesa = [];

    for (let i= 0; i < employees.length; i++) {
      if (employees[i].status == status) {
        employeesa.push(employees[i]);
      }
    }
  
  if (employees.length == 0) {
    reject("no results returned");
  }
  resolve(employeesa);
  });
}


module.exports.getEmployeesByDepartment = function(department) {
  return new Promise((resolve, reject)=> {
    var departmentsa = [];
    for (let i= 0; i < employees.length; i++) {
      if (employees[i].department == department) {
        departmentsa.push(employees[i]);
      }
    }
  
  if (employees.length == 0) {
    reject("no results returned");
  }
  resolve(departmentsa);
  });

}

module.exports.getEmployeesByManager = function(manager) {
  return new Promise((resolve, reject)=> {
    var temp = [];
    for (let i= 0; i < employees.length; i++) {
      if (employees[i].employeeManagerNum == manager) {
        temp.push(employees[i]);
      }
    }
  
  if (employees.length == 0) {
    reject("no results returned");
  }
  resolve(temp);
    
  });

}


module.exports.getEmployeeByNum = function(num) {
  return new Promise((resolve, reject)=> {
    var selecta = [];
    for (let i= 0; i < employees.length; i++) {
      if (employees[i].employeeNum == num) {
        selecta.push(employees[i]);
      }
    }
  
  if (employees.length == 0) {
    reject("no results returned");
  }
  resolve(selecta);
    
  });

}