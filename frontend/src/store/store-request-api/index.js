import axios from "axios"; 
// import {App, Datasource} from '../../DataType/dataType'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api'
})
const getIdAppPairs = () =>api.get();

const apis = {
    getIdAppPairs
}

export default apis
