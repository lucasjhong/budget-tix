import React, { useEffect, useState } from 'react';
import './Home.scss';

import { Button, Slider } from '@mui/material';

import { Box } from '@mui/system';
import { axiosSeatgeek, axiosStubhub } from '../common/axios';
import TicketListings from '../components/TicketListings/TicketListings';
import LocationSearch from '../components/LocationSearch/LocationSearch';
import DateSelection from '../components/DateSelection/DateSelection';
import dayjs from 'dayjs';

const Home = () => {
	const [priceSliderValue, setPriceSliderValue] = useState([0, 400]);
	const [eventsList, setEventsList] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	// const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
	const [searchCity, setSearchCity] = useState('new york');
	const [searchRange, setSearchRange] = useState(10);
	const [date, setDate] = useState(null);
	const [loading, setLoading] = useState(false);

	const { REACT_APP_SEATGEEK_KEY, REACT_APP_STUBHUB_TOKEN } = process.env;

	const handleSliderChange = (event, newValue) => {
		setPriceSliderValue(newValue);
	};

	const getListingsOnLocation = async () => {
		setLoading(true);
		const resultCount = 500;

		let retrievedEvents = [];
		// SEATGEEK DATA PARSE
		// const res = await axios.get(
		// 	`/events?client_id=${REACT_APP_SEATGEEK_KEY}&lat=${coordinates.lat}&lon=${coordinates.lng}&range=${searchRange}mi&sort=datetime_utc.asc&listing_count.gt=0&score.gt=0.60&per_page=1000`
		// );
		const resSeatgeek = await axiosSeatgeek.get(
			`/events?client_id=${REACT_APP_SEATGEEK_KEY}&venue.city=${searchCity}&range=${searchRange}mi&sort=datetime_utc.asc&listing_count.gt=0&score.gt=0.60&per_page=500`
		);
		console.log(resSeatgeek.data);

		resSeatgeek.data.events.map((event) => {
			retrievedEvents.push({
				localDate: dayjs(event.datetime_local),
				title: event.short_title,
				venue: event.venue.name,
				performers: event.taxonomies.map((item) => item.name.split('_')[0]),
				category: event.type.split('_')[0],
				listings: event.stats.listing_count,
				prices: {
					lowest: event.stats.lowest_price,
					highest: event.stats.highest_price,
					average: event.stats.average_price,
				},
				image: event.performers[0].image,
				url: event.url,
				provider: 'SeatGeek',
			});
		});

		// STUBHUB DATA PARSE
		const resStubhub = await axiosStubhub.get(
			`/events/v3?city=${searchCity}&minAvailableTickets=1&sort=eventDateLocal asc&rows=${resultCount}`,
			{
				headers: { Authorization: `Bearer ${REACT_APP_STUBHUB_TOKEN}` },
			}
		);
		console.log(resStubhub.data);

		resStubhub.data.events.map((event) => {
			retrievedEvents.push({
				localDate: dayjs(event.eventDateLocal),
				title: event.name,
				venue: event.venue.name,
				// performers: event.performers.map((item) => item.name),
				performers: ['aaaaaaa'],
				category: event.categoriesCollection.categories[0].name,
				listings: event.ticketInfo.totalListings,
				prices: {
					lowest: event.ticketInfo.minListPrice,
					highest: event.ticketInfo.maxListPrice,
				},
				image:
					'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Stubhub.svg/1280px-Stubhub.svg.png',
				url: `stubhub.com/${event.webURI}`,
				provider: 'StubHub',
			});
		});
		console.log(resStubhub.data);
		console.log(retrievedEvents);

		setEventsList(retrievedEvents);
		setFilteredEvents(retrievedEvents);
		setLoading(false);
	};

	const filterResults = () => {
		let newList;
		// Filter by Dates
		if (date) {
			console.log(dayjs(eventsList[0].localDate).format('YYYYMMDD'));
			newList = eventsList.filter((event) => {
				return event.localDate.format('YYYYMMDD') === dayjs(date).format('YYYYMMDD');
			});
			console.log(newList);
		} else {
			newList = [...eventsList];
		}

		// Filter by the Lowest ticket price available for each event
		newList = newList.filter((event) => {
			return event.prices.lowest <= priceSliderValue[1];
		});

		setFilteredEvents(newList);
	};

	const resetFilter = () => {
		setDate(null);
		setPriceSliderValue([10, 600]);
	};

	useEffect(() => {
		const sortEventsList = () => {
			eventsList.sort((a, b) => {
				return a.localDate.format('YYYYMMDD') - b.localDate.format('YYYYMMDD');
			});
		};

		sortEventsList();
	}, [eventsList]);

	useEffect(() => {
		filterResults();
	}, [date, priceSliderValue]);

	return (
		<div className='home-page'>
			<h1>Budget Tix</h1>
			<h3>Search an event based on your location and your price range.</h3>

			<h4>Set your location.</h4>

			{/* <LocationSearch setCoordinates={setCoordinates} /> */}
			<LocationSearch setSearchCity={setSearchCity} />

			<Button
				variant='contained'
				onClick={() => getListingsOnLocation()}
				// disabled={!coordinates.lat && !coordinates.lng}
				disabled={!searchCity}
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
