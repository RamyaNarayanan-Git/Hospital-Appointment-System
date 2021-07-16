import React,{useEffect,useState} from 'react';
import { FormControl, InputLabel, Button, AppBar, Select, MenuItem,Typography,FormHelperText } from '@material-ui/core';
import BookIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import AppointmentTable from './AppointmentTable'
import axios from 'axios';
import { DateTimePicker,MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {baseUrl} from '../shared/config';



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
    const [doctorId, setDoctorId] = useState('');
    const [patientId, setPatientId] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [dateTime, setDateTime] = useState(new Date());
    const [ patientIdError, setPatientIdError ] = useState(false);
    const [doctorIdError,setDoctorIdError] = useState(false);
    
    const classes = useStyles();

    const calculateId = () => {
        return doctorId+patientId+dateTime.toTimeString();
    }

    function formatDate(date){

        return date.getFullYear().toString()+(date.getMonth()+1).toString().padStart(2,'0')+date.getDate().toString()+date.getHours().toString().padStart(2,'0')+date.getMinutes().toString();
          
    }

    async function validateAppointment(apptDate,apptDoctor){

        try{
            const result = await axios.get(baseUrl+'appointments/', {
                params: {
                  dateTime: apptDate,
                  doctorId: apptDoctor
                }
              });
            if(result.data)
                return false;
        }catch(err){
            console.log(err);
            return true;
        }
        
    }

    const handleChange = (event) => {
        setDoctorId(event.target.value);
    };

    const handleDateChange = (date) => {
        setDateTime(date);
    };


    const handlePatientChange = (event) => {
        setPatientId(event.target.value);
    };

    const handleBooking = async (event) => {
        if(!doctorIdError){
            setDoctorIdError(true);
              
        }
        else if(!patientIdError){
            setPatientIdError(true);
         }
        else{
            setPatientIdError(false);
            setDoctorIdError(false);
            var formattedDate = formatDate(dateTime);
            if(validateAppointment(formattedDate,doctorId)){
                //if(formattedDate )
                var data = { id: calculateId, doctorId: doctorId, patientId: patientId, dateTime: formatDate(dateTime) };

                await axios.post(baseUrl+'appointments',data);
                alert('Booked');
                setDoctorId('');
                setPatientId('');
                setDateTime(new Date());
            }
        }
        
    }

   
   async function fetchPatients() {
    try {
        const result = await axios(baseUrl+'patients')
        setPatients(result.data);
    } catch (err) {
        console.log(err);
    }
}


async function fetchDoctors() {
    try {
        const result = await axios(baseUrl+'doctors')
        setDoctors(result.data);
    } catch (err) {
        console.log(err);
    }
}


   useEffect(() => { 
        fetchPatients();
        fetchDoctors();
        
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
            <FormControl className={classes.formControl} error={doctorIdError}>
                <InputLabel htmlFor="doctorName">Select doctor</InputLabel>
                <Select
                    value={doctorId}
                    onChange={handleChange}>
                    {
                        doctors.map((doctor) => {
                            return (
                                <MenuItem key={doctor.id} value={doctor.id}>{doctor.name}</MenuItem>
                            );
                        })
                    }
                </Select>
                {doctorIdError && <FormHelperText>This is required!</FormHelperText>}
            </FormControl>
            <FormControl className={classes.formControl} error={patientIdError}>
                <InputLabel htmlFor="patientId">Select Patient</InputLabel>
                <Select
                      value={patientId}
                    onChange={handlePatientChange}
                    name="patientId" >
                    {
                        patients.map((patient) => {
                            return (
                                <MenuItem key={patient.id} value={patient.id}>{patient.name}</MenuItem>
                            );
                        })
                    }
                </Select>
                {patientIdError && <FormHelperText>This is required!</FormHelperText>}
            </FormControl>
            <FormControl className={classes.formControl}>
            
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
        value={dateTime}
        disablePast
        onChange={handleDateChange}
        label="Pick Date and Time"
        //format="dd/MM/yyyy HH:mm"
        showTodayButton
        
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
            
                <AppointmentTable doctorId={parseInt(doctorId)} patientId={parseInt(patientId)} dateTime={formatDate(dateTime)}
              patientList={patients} doctorList={doctors}/>   
            </div>
        </>

    );
}

export default Booking;
