# Getting Started with Appointment System

## Installation Instructions

### 1. Cloning Git Project
In the project directory, you can run:
 git clone https://github.com/RamyaNarayanan-Git/Hospital-Appointment-System.git

### 2. Setting up a static server using json server
The Node module, json-server, provides a very simple way to set up a web server that supports a full-fledged REST API server. It can also serve up static web content from a folder.
#### Installing json-server:

##### `npm install json-server`
If you are using OSX or Linux, use sudo at the front of the command. This will install json-server that can be started from the command line from any folder on your computer.

#### Configuring the Server:
At any convenient location on your computer, create a new folder named json-server, and move to this folder.
Download the db.json file provided above to this folder.
Move to this folder in your terminal window, and type the following at the command prompt to start the server:

##### `json-server --watch db.json -p 3001 -d 2000`

This should start up a server at port number 3001 on your machine. The data from this server can be accessed by typing the following addresses into your browser address bar:
http://localhost:3001/appointments
http://localhost:3001/patients
http://localhost:3001/doctors

Type these addresses into the browser address and see the JSON data being served up by the server. This data is obtained from the db.json file
The json-server also provides a static web server. Any resources that you put in a folder named public in the json-server folder above, will be served by the server at the following address:

http://localhost:3001

(Note: This url is used as baseurl in the config.js file)

Shut down the server by typing ctrl-C in the terminal window.


Technologies Used:
React - (installed using create-react-app)
MaterialUI - @material-ui/core@4.12.1, @material-ui/icons@4.11.2, @material-ui/pickers@3.3.10
axios library for making API calls - axios@0.21.1
Entities details and Requirements details:
Entities:
All the entities are saved in json file and served from json-server(installed as stated in the above section)

Patients (id, name, Age, Gender)
Doctors (id, name)
Appointments (id, doctorId, patientId, dateTime)
Requirements:
1. Book appointment by doctor, patient, date&time conditions checked: For each doctor appointments shouldn't conflict with their schedule Both patient and doctor name are required.

2. Search appointments by doctor's name, patient's name Appointment table is loaded based on doctor and patient selection

3. Cancel appointment Cancel by clicking on 1 or more appointments

## Technologies Used:
##### `React - (installed using create-react-app)`
##### `MaterialUI - @material-ui/core@4.12.1, @material-ui/icons@4.11.2,  @material-ui/pickers@3.3.10`
##### `axios library for making API calls - axios@0.21.1`

## Entities details and Requirements details:

### Entities: 
All the entities are saved in json file and served from json-server(installed as stated in the above section)
1. Patients (id, name, Age, Gender)
2. Doctors (id, name)
3. Appointments (id, doctorId, patientId, dateTime)
 
### Requirements:
1. Book appointment by doctor, patient, date&time
conditions checked: For each doctor appointments shouldn't conflict with their schedule
Both patient and doctor name are required.

2. Search appointments by doctor's name, patient's name
Appointment table is loaded based on doctor and patient selection

3. Cancel appointment 
Cancel by clicking on 1 or more appointments



