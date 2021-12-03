import React, { useEffect, useState } from 'react';
import './Home.scss';

import { Button, Slider } from '@mui/material';

import { Box } from '@mui/system';
import { axios } from '../common/axios';
import TicketListings from '../components/TicketListings/TicketListings';
import LocationSearch from '../components/LocationSearch/LocationSearch';
import DateSelection from '../components/DateSelection/DateSelection';
import dayjs from 'dayjs';

const Home = () => {
	const [priceSliderValue, setPriceSliderValue] = useState([0, 400]);
	const [eventsList, setEventsList] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
	const [searchRange, setSearchRange] = useState(10);
	const [date, setDate] = useState(null);
	const [loading, setLoading] = useState(false);

	const { REACT_APP_SEATGEEK_KEY } = process.env;

	const handleSliderChange = (event, newValue) => {
		setPriceSliderValue(newValue);
	};

	const getListingsOnLocation = async () => {
		setLoading(true);
		const res = await axios.get(
			`/events?client_id=${REACT_APP_SEATGEEK_KEY}&lat=${coordinates.lat}&lon=${coordinates.lng}&range=${searchRange}mi&sort=datetime_utc.asc&listing_count.gt=0&score.gt=0.60&per_page=1000`
		);
		console.log(res.data);
		setEventsList(res.data.events);
		setFilteredEvents(res.data.events);
		setLoading(false);
	};

	const filterResults = () => {
		let newList;
		// Filter by Dates
		if (date) {
			newList = eventsList.filter((event) => {
				return event.datetime_local.substring(0, 10) === dayjs(date).format().substring(0, 10);
			});
			console.log(newList);
		} else {
			newList = [...eventsList];
		}

		// Filter by the Lowest ticket price available for each event
		newList = newList.filter((event) => {
			return event.stats.lowest_price <= priceSliderValue[1];
		});

		setFilteredEvents(newList);
	};

	const resetFilter = () => {
		setDate(null);
		setPriceSliderValue([10, 600]);
	};

	useEffect(() => {
		filterResults();
	}, [date, priceSliderValue]);

	return (
		<div className='home-page'>
			<h1>Budget Tix</h1>
			<h3>Search an event based on your location and your price range.</h3>

			<h4>Set your location.</h4>

			<LocationSearch setCoordinates={setCoordinates} />

			<Button
				variant='contained'
				onClick={() => getListingsOnLocation()}
				disabled={!coordinates.lat && !coordinates.lng}
			>
				Search Events
			</Button>

			<h4 style={{ marginTop: '36px' }}>Filter Results</h4>

			<DateSelection date={date} setDate={setDate} />

			<h4>Set your price range</h4>
			<Box>
				<Slider
					getAriaLabel={() => 'Price Range'}
					value={priceSliderValue}
					onChange={handleSliderChange}
					valueLabelDisplay='on'
					step={5}
					min={0}
					max={1000}
				/>
			</Box>

			<Button variant='text' onClick={() => resetFilter()}>
				Reset Filter
			</Button>

			<TicketListings eventsList={filteredEvents} loading={loading} />

			<p>Tickets retrieved from </p>
			<img
				alt='seatgeek'
				src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Seatgeek_logo.svg/1280px-Seatgeek_logo.svg.png'
			/>
		</div>
	);
};

export default Home;
