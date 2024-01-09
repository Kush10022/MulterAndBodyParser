
var express = require('express');
var path = require('path');
var data = require('./data-service.js');
var app = express();

var bodyParser = require('body-parser');
const multer = require("multer");
const fs = require('fs');

// To handle form data
app.use(express.urlencoded({extended: true}));

var HTTP_PORT = process.env.PORT || 8080;


// call this function after the http server starts listening for requests
function onHTTPStart() {
  console.log('Express http server listening on: ' + HTTP_PORT);
}


app.use(bodyParser.urlencoded({ extended: true }));

// To store the images to the public/images/uploaded folder
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
     
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage: storage });

  //for your server to correctly return the "css/site.css" file, the "static" middleware must be used
// setup the static folder that static resources can load from
// like images, css files, etc.
app.use(express.static('public'));

// setup a 'route' to listen on /home
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

// setup a 'route' to listen on /about
app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/about.html'));
  });

 
  app.get('/employees/add', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/addEmployee.html'));
  });

  app.get('/images/add', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/addImage.html'));
  });

   // setup a 'route' to listen on /employees
  app.get('/employees', function(req, res) {


    // route to getEmployeesByDepartment(department)
  if(req.query.department){
    data.getEmployeesByDepartment(req.query.department).then((data) => {
      res.json(data);
  });

  } else if(req.query.employeeManagerNum){ // route to getEmployeesByManager(manager)
    data.getEmployeesByManager(req.query.employeeManagerNum).then((data) => {
      res.json(data);
  });
  } else if(req.query.status){ // route to getEmployeesByStatus(status)
    data.getEmployeesByStatus(req.query.status).then((data) => {
      res.json(data);
  });
  } else if(req.query.employeeNum){ // route to getEmployeeByNum(num)
    data.getEmployeeByNum(req.query.employeeNum).then((data) => {
      res.json(data);
    });
  }
  
  else{ // route to getAllEmployees()
    data.getAllEmployees().then((data) => {
      res.json(data);
  });
 
}

  });

// Adding "Get" route /images using the "fs" module
  app.get("/images",function(req,res){
    fs.readdir("./public/images/uploaded", (err, items) => {
        for (var i=0; i<items.length; i++) {
            items[i];
        }
        return res.json({ images: items});
      })
    
});

//Add the "/employee/value" route
app.get("/employee/:empNum",(req,res)=>{
  data.getEmployeeByNum(req.params.empNum).then((data)=>{
    res.json(data);
      });

    });

// Adding the "Post" route. This route will redirect to route "/images"
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
  });
  
// Adding the "Post" route. This route will redirect to route "/employees"
  app.post("/employees/add", (req, res) => {
    data.addEmployee(req.body).then((data) =>{
        res.redirect("/employees");
    });

  })


// setup a 'route' to listen on /managers
app.get('/managers', function(req, res) {
  data.getManagers().then((data) => {
    res.json(data);
});
});

// setup a 'route' to listen on /departments
app.get('/departments', function(req, res) {
  data.getDepartments().then((data) => {
    res.json(data);
});
});

// Redirect to error
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});


// setup http server to listen on HTTP_PORT
data.initialize().then(function(data){
  app.listen(HTTP_PORT, function(){
      console.log("Express http server listening on " + HTTP_PORT)
  });
}).catch(function(err){
  console.log("Unable to start server: " + err);
});





