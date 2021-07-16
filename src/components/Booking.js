import React from 'react';
import { FormControl, InputLabel, Button, AppBar, Select, MenuItem,Typography } from '@material-ui/core';
import BookIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import AppointmentTable from './AppointmentTable'
import axios from 'axios';
import { DateTimePicker,MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';



const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
      }
}));

function Booking() {
    const [doctor, setDoctor] = React.useState('');
    const [patient, setPatient] = React.useState('');
    const [doctors, setDoctors] = React.useState([]);
    const [patients, setPatients] = React.useState([]);
    const [dateTime, setDateTime] = React.useState(new Date());
    
    const classes = useStyles();

    const calculateId = () => {
        return doctor+patient+dateTime.toTimeString();
    }

    const handleChange = (event) => {
        setDoctor(event.target.value);
    };

    const handlePatientChange = (event) => {
        setPatient(event.target.value);
    };

    const handleBooking = async (event) => {
        var data = { id: calculateId, doctorId: doctor, patientId: patient, dateTime: formatDate(dateTime) };

        await axios.post('http://localhost:3001/appointments',data);
        alert('Booked');
    }

   function formatDate(date){

    return date.getFullYear().toString()+(date.getMonth()+1).toString().padStart(2,'0')+date.getDate().toString()+date.getHours().toString().padStart(2,'0')+date.getMinutes().toString();
      
   }
   async function fetchPatients() {
    try {
        const result = await axios('http://localhost:3001/patients')
        setPatients(result.data);
    } catch (err) {
        console.log(err);
    }
}

async function fetchDoctors() {
    try {
        const result = await axios('http://localhost:3001/doctors')
        setDoctors(result.data);
    } catch (err) {
        console.log(err);
    }
}


   React.useEffect(() => {
        
        fetchPatients();
        fetchDoctors()
    }, []);
    

    return (
        <>
            <AppBar>
                <Typography variant="h6" className={classes.title}>
            Appointment Manager
          </Typography>
          </AppBar>
          <br/><br/>
          <div style={{ height: 400, width: '100%' }}>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="doctorName">Select Doctor</InputLabel>
                <Select
                    value={doctor}
                    onChange={handleChange}>
                    {
                        doctors.map((doctor) => {
                            return (
                                <MenuItem key={doctor.id} value={doctor.id}>{doctor.name}</MenuItem>
                            );
                        })
                    }
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="patient">Select Patient</InputLabel>
                <Select
                    value={patient}
                    onChange={handlePatientChange}
                    name="patient" >
                    {
                        patients.map((patient) => {
                            return (
                                <MenuItem key={patient.id} value={patient.id}>{patient.name}</MenuItem>
                            );
                        })
                    }
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
            
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
        value={dateTime}
        disablePast
        onChange={setDateTime}
        label="Pick Date and Time"
        //format="dd/MM/yyyy HH:mm"
        showTodayButton
        minTime={new Date(0, 0, 0, 8)}
          maxTime={new Date(0, 0, 0, 18, 45)}
      />
</MuiPickersUtilsProvider> 
            </FormControl> 
           
            <br/>
            <FormControl className={classes.formControl}>
            
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.button}
                    endIcon={<BookIcon />}
                    onClick={handleBooking}
                    name="bookBtn"
                >
                    Book Now
        </Button>
            </FormControl>
            
              <AppointmentTable doctorId={parseInt(doctor)} patientId={parseInt(patient)} dateTime={formatDate(dateTime)} />  
            </div>
        </>

    );
}

export default Booking;
