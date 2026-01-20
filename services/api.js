import axios from 'axios';

const BASEURL = 'https://pokeapi.co/api/v2/';

export const api = axios.create({
    baseURL: BASEURL
})