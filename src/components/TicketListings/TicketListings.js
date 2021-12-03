import { CircularProgress, Pagination } from '@mui/material';
import React, { useState } from 'react';
import Listing from './Listing';
import './TicketListings.scss';

const TicketListings = ({ eventsList, loading }) => {
	const [page, setPage] = useState(1);
	const pageItemCount = 20;

	const handleChange = (event, value) => {
		setPage(value);
	};
	return (
		<div className='ticket-listings'>
			<div className='listings-section'>
				<h2>Listings</h2>
				{loading && <CircularProgress sx={{ margin: 'auto' }} />}
				<div className='ticket-listings'>
					{eventsList.length > 0 &&
						eventsList.slice((page - 1) * pageItemCount, page * pageItemCount).map((event) => {
							return <Listing event={event} />;
						})}
				</div>
			</div>
			<Pagination
				count={eventsList.length / pageItemCount}
				page={page}
				color='primary'
				onChange={handleChange}
			/>
			<p>
				*Ticket prices are shown with the fees applied, and the event time is shown with the local
				time.
			</p>
		</div>
	);
};

export default TicketListings;
