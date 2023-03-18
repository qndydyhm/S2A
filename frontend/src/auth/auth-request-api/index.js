import axios from 'axios';
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost',
})
export const getLoggedIn = ()=> api.get(`/auth/loggedIn`);

const apis = {
    getLoggedIn,

}

export default apis