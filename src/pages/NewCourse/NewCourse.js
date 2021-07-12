import React, { useEffect, useState } from 'react';
import "./NewCourse.css";
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
    price: yup
        .number('Enter your price')
        .required('Price is required'),
    promotion_price: yup
        .number('Enter your price'),

});

function NewCourse(props) {
    const classes = useStyles();

    let initialValues = {
        name: '',
        price: '',
        is_delete: false,
        course_field_id: 1,
        description: '',
        category_id: 1,
        course_status_id: 1,
        last_update: moment(),
        view: 0,
        created_by: 1
    };
    const [categories, setCategories] = useState([]);
    const [courseFields, setCourseFields] = useState([]);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
        props.toggle();
    };

    useEffect(function () {
        async function loadCategories() {
            const res = await axiosInstance.get(`/categories`);
            if (res.status === 200 || res.status === 304) {
                setCategories(res.data);
            }
        }

        async function loadCourseFields() {
            const res = await axiosInstance.get(`/fields`);
            if (res.status === 200 || res.status === 304) {
                setCourseFields(res.data);
            }
        }

        handleClickOpen();
        loadCategories();
        loadCourseFields();

    }, []);

    const handleAddOnClick = async (values) => {

        try {
            let data = { ...initialValues, ...values, last_update: moment().format('YYYY-MM-DD h:mm:ss'), image: DEFAULT_COURSE_IMAGE }
            console.log(data);
            const res = await axiosInstance.post(`/courses`, data);

            if (res.status === 200 || res.status === 201) {
                props.enqueueSnackbar('Successfully add course', { variant: 'success' });
            } else {
                props.enqueueSnackbar('Failed done the operation.', { variant: 'error' });
            }

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
                    <DialogTitle id="form-dialog-title">Add Course</DialogTitle>
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
                            <TextField
                                fullWidth
                                id="price"
                                name="price"
                                label="Price"
                                value={values.price}
                                onChange={handleChange}
                                error={Boolean(errors.price)}
                                helperText={errors.price}
                            />

                            <TextField
                                fullWidth
                                id="promotion_price"
                                name="promotion_price"
                                label="Promotion price"
                                value={values.promotion_price}
                                onChange={handleChange}
                                error={Boolean(errors.promotion_price)}
                                helperText={errors.promotion_price}
                            />

                            <TextField
                                id="category_id"
                                select
                                label="Category"
                                // defaultValue={categories[0]}
                                onChange={handleChange}
                                SelectProps={{
                                    native: true,
                                }}

                            >
                                {categories && categories.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </TextField>

                            <TextField
                                id="course_field_id"
                                select
                                label="Course fields"
                                // value={courseFields[0]}
                                onChange={handleChange}
                                SelectProps={{
                                    native: true,
                                }}

                            >
                                {courseFields && courseFields.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                id="description"
                                name="description"
                                label="Description"
                                multiline='true'
                                value={values.description}
                                onChange={handleChange}
                                error={Boolean(errors.description)}
                                helperText={errors.description}
                            />

                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button to={"/courses"} color="primary" onClick={() => handleAddOnClick(values)}>
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

export default withSnackbar(NewCourse);