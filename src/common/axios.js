import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://api.seatgeek.com',
});

export { instance as axios };
