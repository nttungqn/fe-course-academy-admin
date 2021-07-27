import React, { useEffect, useState } from 'react';
import "./EditCourse.css";
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

function EditCourse(props) {
    const classes = useStyles();

    const [initialValues, setInitialValues] = useState({
        name: '',
        price: '',
        is_delete: false,
        promotion_price: '',
        course_field_id: '',
        phone: '',
        description: '',
        last_update: moment(),
        view: 0,
    });
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
        async function loadCourse() {
            try {
                const res = await axiosInstance.get(`/courses/${props.id}`);
                if (res.data) {
                    setInitialValues({ ...res.data, last_update: moment().format('YYYY-MM-DD h:mm:ss'), image: res.data.image || DEFAULT_COURSE_IMAGE });
                }
            } catch (e) {
                setInitialValues({});
            }

        }

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
        loadCourse();
        loadCategories();
        loadCourseFields();

    }, [props.id]);

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
        >
            {({ values, errors, dirty, isValid, handleChange, handleReset, setFieldValue }) => (
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Edit Course</DialogTitle>
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
                                value={values.category_id}
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
                                value={values.course_field_id}
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

                            <label>Upload image</label>
                            <input id="image" name="file" type="file" accept="image/*" onChange={(event) => {
                                setFieldValue("image", event.currentTarget.files[0]);
                            }} />

                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button to={"/users"} color="primary" onClick={() => props.handle(values)}>
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

export default withSnackbar(EditCourse);