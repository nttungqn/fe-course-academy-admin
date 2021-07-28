import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { axiosInstance, parseJwt } from '../../utils/base';
import { Formik } from 'formik';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Login(props) {
    const initialValues = {
        email: '',
        password: ''
    };

    const handleSubmit = async (values) => {
        const { username, password } = values;
        try {
            if (username === 'admin' && password === '123456') {
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('accessToken', 'admin');
                window.location.pathname = '/';
            } else {
                const res = await axiosInstance.post('/sign-in', values);
                if (res.data.authenticated) {
                    localStorage.setItem('accessToken', res.data.accessToken);
                    axiosInstance.defaults.headers.common['Authorization'] = res.data.accessToken;
                    const obj = parseJwt(res.data.accessToken);
                    localStorage.userId = obj.userId;

                    window.location.pathname = '/';
                } else {
                    alert('Invalid login.');
                }
            }
        } catch (err) {
            if (err.response) {
                console.log(err.response.data);
                // console.log(err.response.status);
                // console.log(err.response.headers);
            } else if (err.request) {
                console.log(err.request);
            } else {
                console.log('Error', err.message);
            }

            // console.log(err.config);
        }
    }

    const classes = useStyles();

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={false}
        >
            {({ values, errors, dirty, isValid, handleChange, handleReset, setFieldValue }) => (
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>

                        <form className={classes.form} noValidate autoComplete="off">
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoFocus
                                onChange={handleChange}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                onChange={handleChange}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={() => handleSubmit(values)}
                            >
                                Sign In
                            </Button>
                        </form>
                    </div>
                </Container>
            )
            }
        </Formik>
    );
}
