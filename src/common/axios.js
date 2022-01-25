import axios from 'axios';
require('dotenv').config();

const axiosSeatgeek = axios.create({
	baseURL: 'https://api.seatgeek.com',
});

const axiosStubhub = axios.create({
	baseURL: 'https://api.stubhub.com/sellers/search/',
	headers: {
		// Authorization: `Bearer ${process.env.REACT_APP_STUBHUB_TOKEN}`,
		accept: 'application/json',
	},
});

export { axiosSeatgeek, axiosStubhub };
