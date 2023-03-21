import axios from 'axios';
axios.defaults.withCredentials = true;
const api = axios.create()
const getLoggedIn = ()=> api.get(`/auth/loggedIn`);
const isGlobalDeveloper=()=>api.get('/auth/globaldeveloper');
const apis = {
    getLoggedIn,
    isGlobalDeveloper,

}

export default apis