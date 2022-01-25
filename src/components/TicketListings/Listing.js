import dayjs from 'dayjs';
import React from 'react';
import './Listing.scss';

const Listing = ({ event }) => {
	return (
		<div className='post' onClick={() => window.open(event.url)}>
			<div className='header_post'>
				<img src={event.image} alt='' />
			</div>

			<div className='body_post'>
				<div className='post_content'>
					<p className='category'>{event.category.toUpperCase()}</p>
					<h1>{event.title}</h1>
					<h4>{event.venue}</h4>
					<h4>{dayjs(event.localDate).format('LLL')}</h4>
					<p
						className={'description'}
						style={{
							marginTop: '18px',
							width: '100%',
							marginBottom: '4px',
							fontWeight: 'bold',
						}}
					>
						{event.listings} Listings
					</p>
					<p className={'description'}>Lowest Price: ${event.prices.lowest}</p>
					<p className={'description'}>Highest Price: ${event.prices.highest}</p>
				</div>
				<div className='container_infos'>
					<div className='postedBy'>
						<span>Tags</span>
						{event.performers.map((performer) => {
							return <p>{performer}</p>;
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Listing;
