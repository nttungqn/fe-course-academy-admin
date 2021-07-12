import React, { useEffect, useState } from 'react';
import "./EditVideo.css";
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
import { withSnackbar } from 'notistack';

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
    url: yup
        .string('Enter your url')
        .required('URL is required'),

});

function EditVideo(props) {
    const classes = useStyles();

    const [initialValues, setInitialValues] = useState({
        name: '',
        course_id: null,
        url: ''
    });
    const [courses, setCourses] = useState([]);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
        props.toggle();
    };

    useEffect(function () {
        async function loadDocument() {
            try {
                const res = await axiosInstance.get(`/videos/${props.id}`);
                if (res.data) {
                    setInitialValues({ ...res.data });
                }
            } catch (e) {
                setInitialValues({});
            }

        }

        async function loadCourses() {
            const res = await axiosInstance.get(`/courses?limit=999`);
            if (res.status === 200 || res.status === 304) {
                const items = res.data.courses.map((el) => el.course);
                setCourses(items);
            }
        }

        handleClickOpen();
        loadCourses();
        loadDocument();

    }, [props.id]);

    const handleEditOnClick = async (values) => {

        try {
            const res = await axiosInstance.put(`/videos/${props.id}`, values);
            console.log(res)
            if (res.status === 200 || res.status === 202) {
                props.enqueueSnackbar('Successfully updated video', { variant: 'success' });

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
                    <DialogTitle id="form-dialog-title">Edit Video</DialogTitle>
                    <DialogContent>

                        <form form className={classes.root} noValidate autoComplete="off">
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Name"
                                value={values.name}
                                onChange={handleChange}
                                error={Boolean(errors.name)}
                                helperText={errors.name}
                            />

                            <TextField
                                id="course_id"
                                select
                                label="Course"
                                onChange={handleChange}
                                SelectProps={{
                                    native: true,
                                }}

                            >
                                {courses && courses.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                id="url"
                                name="url"
                                label="URL"
                                multiline='true'
                                value={values.url}
                                onChange={handleChange}
                                error={Boolean(errors.url)}
                                helperText={errors.url}
                            />

                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button to={"/users"} color="primary" onClick={() => handleEditOnClick(values)}>
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

export default withSnackbar(EditVideo);