import React, { useEffect, useState } from 'react';
import "./EditUser.css";
import { makeStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { axiosInstance } from '../../utils/base';
import { Formik } from 'formik';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import moment from 'moment';
import { withSnackbar } from 'notistack';

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
});

function EditUser(props) {
    const classes = useStyles();

    const [initialValues, setInitialValues] = useState({
        email: '',
        fullname: '',
        address: '',
        role_id: '',
        phone: '',
        gender: '',
        date_of_birth: moment(),
    });
    const [roles, setRoles] = useState([]);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
        props.toggle();
    };

    useEffect(function () {

        async function loadUser() {

            try {
                const res = await axiosInstance.get(`/users/${props.id}`);
                if (res.data) {
                    setInitialValues({ ...res.data, date_of_birth: moment(res.data.date_of_birth, ["YYYY", moment.ISO_8601]).format('YYYY-MM-DD') });
                }
            } catch (e) {
                setInitialValues({});
            }

        }

        async function loadRole() {
            const res = await axiosInstance.get(`/roles`);
            if (res.status === 200 || res.status === 304) {
                setRoles(res.data);
            }
        }

        handleClickOpen();
        loadUser();
        loadRole();

    }, [props.id]);


    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
        >
            {({ values, errors, dirty, isValid, handleChange, handleReset, setFieldValue }) => (
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Edit User</DialogTitle>
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
                                id="gender"
                                select
                                label="Gender"
                                value={values.gender}
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
                                id="role_id"
                                select
                                label="Role"
                                value={values.role_id}
                                onChange={handleChange}
                                SelectProps={{
                                    native: true,
                                }}

                            >
                                {roles && roles.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                id="address"
                                name="address"
                                label="Address"
                                value={values.address}
                                onChange={handleChange}
                                error={Boolean(errors.address)}
                                helperText={errors.address}
                            />

                            <label>Upload avatar</label>
                            <input id="avatar" name="file" type="file" accept="image/*" onChange={(event) => {
                                setFieldValue("avatar", event.currentTarget.files[0]);
                            }} />

                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button to={"/courses"} color="primary" onClick={() => props.handle(values)}>
                            Update
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

export default withSnackbar(EditUser);