import React from 'react'

import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { axiosInstance, parseJwt } from '../../utils/base';

export default function Login(props) {
    const history = useHistory();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async function (data) {
        try {
            const res = await axiosInstance.post('/auth', data);
            if (res.data.authenticated) {
                // console.log(res.data.accessToken);
                localStorage.todoApp_accessToken = res.data.accessToken;

                const obj = parseJwt(res.data.accessToken);
                localStorage.todoApp_userId = obj.userId;

                history.push('/');
            } else {
                alert('Invalid login.');
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

    // console.log(watch('example'));

    return (
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3>Login</h3>
                <div className="fg">
                    <input type="text" placeholder="username" autoFocus {...register('username', { required: true })} />
                    {errors.username && <span>*</span>}
                </div>
                <div className="fg">
                    <input type="password" placeholder="password" {...register('password', { required: true })} />
                    {errors.password && <span>*</span>}
                </div>
                <div className="fg mt-3">
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}
