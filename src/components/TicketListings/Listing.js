import dayjs from 'dayjs';
import React from 'react';
import './Listing.scss';

const Listing = ({ event }) => {
	return (
		<div className='post' onClick={() => window.open(event.url)}>
			<div className='header_post'>
				<img src={event.performers[0].image} alt='' />
			</div>

			<div className='body_post'>
				<div className='post_content'>
					<p className='category'>{event.type.split('_')[0].toUpperCase()}</p>
					<h1>{event.short_title}</h1>
					<h4>{event.venue.name}</h4>
					<h4>{dayjs(event.datetime_local).format('LLL')}</h4>
					<p
						className={'description'}
						style={{
							marginTop: '18px',
							width: '100%',
							marginBottom: '4px',
							fontWeight: 'bold',
						}}
					>
						{event.stats.listing_count} Listings
					</p>
					<p className={'description'}>Average Price: ${event.stats.average_price}</p>
					<p className={'description'}>Lowest Price: ${event.stats.lowest_price}</p>
					<p className={'description'}>Highest Price: ${event.stats.highest_price}</p>
				</div>
				<div className='container_infos'>
					<div className='postedBy'>
						<span>Tags</span>
						{event.performers.map((performer) => {
							return <p>{performer.name}</p>;
						})}
					</div>

					{/* <div className='container_tags'>
						<span>tags</span>
						<div className='tags'>
							{event.taxonomies.map((taxonomy) => {
								return <p>{taxonomy.name}</p>;
							})}
						</div>
					</div> */}
				</div>
			</div>
		</div>
	);
};

export default Listing;
