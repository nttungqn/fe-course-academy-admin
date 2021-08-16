import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 5000,
    headers: {
        'Authorization': localStorage.getItem('accessToken'),
        'Content-Type': 'Application/json'
    }
})


export function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};