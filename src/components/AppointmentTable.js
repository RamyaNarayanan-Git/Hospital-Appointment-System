import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Table, TableBody, TableHead, TableCell, TableRow, Paper, Checkbox, Toolbar, Tooltip, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, lighten } from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment';
import {baseUrl} from '../shared/config';



function AppointmentTable(props) {
    const {doctorId, patientId, dateTime, patientList, doctorList} = props;
    const [appointment, setAppt] = useState([]);
    
    const classes = useStyles();
    const [selected, setSelected] = useState([]);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = filteredAppt.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    //delete 
    const handleDelete = async (event) => {
        try {
            for(let i in selected){
                await axios
                .delete(baseUrl+`appointments/${selected[i]}`)
            }
            
        } catch (err) {
            console.log(err);
        }
           
        fetchData();
        setSelected([]);
    }


    async function fetchData() {
        try {
            const result = await axios(baseUrl+'appointments')
            setAppt(result.data);
        } catch (err) {
            console.log(err);
        }
    }
    
    const isSelected = (name) => selected.indexOf(name) !== -1;

    useEffect(() => {
        fetchData();  
    }, []);

    const filteredAppt = (renderAppointments(appointment,patientId,doctorId,dateTime));

    return (
        <Paper className="classes.root">
            <EnhancedTableToolbar numSelected={selected.length} handleDeleteIcon={handleDelete} />
            <Table className={classes.table}
                aria-labelledby="tableTitle">
                <EnhancedTableHead
                    classes={classes}
                    numSelected={selected.length}
                    onSelectAllClick={handleSelectAllClick}
                    rowCount={filteredAppt.length}
                />


                <TableBody>

                    {filteredAppt.map((appointment, i) => (
                        //let isItemSelected = isSelected(appointment.id);  
                        <TableRow hover
                            role="checkbox"
                            aria-checked={isSelected(appointment.id)}
                            tabIndex={-1}
                            selected={isSelected(appointment.id)}
                            onClick={() => handleClick(appointment.id)}
                            key={appointment.id}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={isSelected(appointment.id)}
                                //inputProps={{ 'aria-labelledby': {appointment.id} }}
                                />
                            </TableCell>
                            <TableCell align="right" component="th" id={appointment.id} scope="row" padding="none">
                                {i + 1}
                            </TableCell>
                            <TableCell align="right">{formatDateTime(appointment.dateTime)}</TableCell> 

                          
                            <TableCell align="right">{getDoctorName(appointment.doctorId)}</TableCell>
                            <TableCell align="right">{getPatientName(appointment.patientId)}</TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </Paper>
    )
    function getPatientName(id) {
        return (patientList.filter((a) => { return a.id === id }).map((i) => { return i.name }));
    }
    
    function getDoctorName(id) {
        return (doctorList.filter((a) => { return a.id === id }).map((i) => { return i.name }));
    }


}

function EnhancedTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount } = props;
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'Select All' }}
                    />
                </TableCell>


                <TableCell align="right">Id</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Doctor</TableCell>
                <TableCell align="right">Patient</TableCell>
            </TableRow>

        </TableHead>
    );
}
EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
};


function formatDateTime(date) {

    var formatter = 'MMM DD YYYY h:mm A';
    var newdate = new Date(date.substring(0, 4), date.substring(4, 6) - 1, date.substring(6, 8), date.substring(8, 10), date.substring(10, 12), 0);
    var time = moment(newdate).format(formatter);
    return time;
}

function renderAppointments(appt, patientId, doctorId, dateTime) {
    if ((!isNaN(doctorId)) && (!isNaN(patientId)) && dateTime!==null) {
        appt = appt.filter((a) => { return ((a.doctorId === doctorId) && (a.patientId === patientId)
            && (a.dateTime === dateTime)) })
    }
    else if (!isNaN(doctorId))
        appt = isNaN(doctorId) ? appt : appt.filter((a) => { return a.doctorId === doctorId })

    else if (!isNaN(patientId))
        appt = isNaN(patientId) ? appt : appt.filter((a) => { return a.patientId === patientId })

    else if (dateTime !== null)
        appt = dateTime !== null ? appt : appt.filter((a) => { return a.dateTime === dateTime })

    return appt;
}

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

function EnhancedTableToolbar(props) {
    const classes = useToolbarStyles();
    const { numSelected, handleDeleteIcon } = props;
    if (numSelected > 0) {
        return (
            <Toolbar
                className={clsx(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
            >
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
        </Typography>
                <Tooltip padding="0px" title="Delete" placement="bottom-end">
                    <span>
                        <IconButton aria-label="delete" onClick={handleDeleteIcon}>
                            <DeleteIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Toolbar>
        );
    }
    else {
        return (
            <div></div>
        );
    }
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

export default AppointmentTable;
