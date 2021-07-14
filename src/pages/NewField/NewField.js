import React, { useEffect, useState } from 'react';
import "./NewField.css";
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
import { DEFAULT_COURSE_IMAGE } from '../../config';

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
    name: yup
        .string('Enter your name')
        .required('Name is required'),
});

function NewCategory(props) {
    const classes = useStyles();

    let initialValues = {
        name: '',
        last_update: moment().format('YYYY-MM-DD'),
        image: DEFAULT_COURSE_IMAGE
    };
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
        props.toggle();
    };

    useEffect(function () {
        handleClickOpen();
    }, []);

    const handleAddOnClick = async (values) => {

        try {
            let data = { ...initialValues, ...values }

            const res = await axiosInstance.post(`/fields`, data);

            if (res.status === 200 || res.status === 201) {
                props.enqueueSnackbar('Successfully add category', { variant: 'success' });
            } else {
                props.enqueueSnackbar('Failed done the operation.', { variant: 'error' });
            }
            setOpen(false);
        } catch (err) {
            console.log(err);
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }

    }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
        >
            {({ values, errors, dirty, isValid, handleChange, handleReset, setFieldValue }) => (
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add Field</DialogTitle>
                    <DialogContent>

                        <form className={classes.root} noValidate autoComplete="off">

                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Name"
                                value={values.name}
                                onChange={handleChange}

                            />

                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button to={"/fields"} color="primary" onClick={() => handleAddOnClick(values)}>
                            Add
                        </Button>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )
            }
        </Formik >

    );
}

export default withSnackbar(NewCategory);