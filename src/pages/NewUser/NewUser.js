import React, { useEffect, useState } from 'react';
import "./NewUser.css";
import { makeStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { axiosInstance } from '../../utils/axios';
import { Formik } from 'formik';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import { DEFAULT_AVATAR } from '../../config';

const genders = [
    {
        id: 0,
        name: 'female',
    },
    {
        id: 1,
        name: 'male'
    }

]

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            // margin: theme.spacing(1),
            // width: '35ch',
            marginBottom: '30px'
        },
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
    },
}));

const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    fullname: yup
        .string('Enter your fullname')
        .required('Fullname is required'),
    phone: yup
        .string('Enter your password')
        .required('Password is required'),
    username: yup
        .string('Enter your username')
        .required('Username is required'),
    password: yup
        .string('Enter your password')
        .required('Password is required'),
});

function NewUser(props) {
    const classes = useStyles();

    const initialValues = {
        email: '',
        fullname: '',
        address: '',
        role_id: '',
        phone: '',
        gender: 0,
        password: '',
        avatar: DEFAULT_AVATAR,
        date_of_birth: moment().format('YYYY-MM-DD'),
    };
    const [open, setOpen] = useState(false);
    const [roles, setRoles] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
        props.toggle();
    };

    useEffect(function () {
        async function loadRole() {
            const res = await axiosInstance.get(`/roles`);
            if (res.status === 200 || res.status === 304) {
                setRoles(res.data);
            }
        }

        handleClickOpen();
        loadRole();


    }, [props.id]);

    const handleAddOnClick = async (values) => {
        try {
            let role_id;
            roles.forEach((role) => {
                if (role.name.toLowerCase() === 'teacher') {
                    role_id = role.id;
                }
            })
            const data = { ...values, role_id: role_id }
            const res = await axiosInstance.post(`/users`, data);
            console.log(data)
            if (res.status === 201) {
                props.enqueueSnackbar('Successfully created user', { variant: 'success' });
            } else {
                props.enqueueSnackbar('Failed done the operation.', { variant: 'error' });
            }
            setOpen(false);
        } catch (err) {
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }

    }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
        >
            {({ values, errors, dirty, isValid, handleChange, handleReset }) => (
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add New Teacher</DialogTitle>
                    <DialogContent>

                        <form form className={classes.root} noValidate autoComplete="off">
                            <TextField
                                fullWidth
                                id="fullname"
                                name="fullname"
                                label="Fullname"
                                value={values.fullname}
                                onChange={handleChange}
                                error={Boolean(errors.fullname)}
                                helperText={errors.fullname}
                            />
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label="Email"
                                value={values.email}
                                onChange={handleChange}
                                error={Boolean(errors.email)}
                                helperText={errors.email}
                            />

                            <TextField
                                fullWidth
                                id="username"
                                name="username"
                                label="Username"
                                value={values.username}
                                onChange={handleChange}
                                error={Boolean(errors.username)}
                                helperText={errors.username}
                            />

                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                value={values.password}
                                onChange={handleChange}
                                error={Boolean(errors.password)}
                                helperText={errors.password}
                            />

                            <TextField
                                id="gender"
                                select
                                label="Gender"
                                value={genders[0].id}
                                onChange={handleChange}
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                {genders && genders.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </TextField>

                            <TextField
                                id="date_of_birth"
                                label="Date of birth"
                                type="date"
                                defaultValue={values.date_of_birth}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <TextField
                                fullWidth
                                id="phone"
                                name="phone"
                                label="Phone"
                                value={values.phone}
                                onChange={handleChange}
                                error={Boolean(errors.phone)}
                                helperText={errors.phone}
                            />

                            <TextField
                                fullWidth
                                id="address"
                                name="address"
                                label="Address"
                                onChange={handleChange}
                                error={Boolean(errors.address)}
                                helperText={errors.address}
                            />


                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button to={"/users"} color="primary" onClick={() => handleAddOnClick(values)}>
                            Add
                        </Button>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Formik>

    );
}

export default withSnackbar(NewUser);