import React, { useRef, useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import { MyLocation } from '@mui/icons-material';
import { IconButton, InputBase, MenuItem, Paper } from '@mui/material';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import './LocationSearch.scss';

const LocationSearch = ({ setCoordinates }) => {
	const [address, setAddress] = useState();
	const searchInput = useRef(null);

	const handleChange = (address) => {
		setAddress(address);
	};

	const handleSelect = async (address) => {
		const results = await geocodeByAddress(address);
		const ll = await getLatLng(results[0]);
		setAddress(address);
		setCoordinates(ll);
	};

	return (
		<div className='location-search'>
			<PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect}>
				{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
					<div>
						<Paper
							component='form'
							sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
						>
							<IconButton sx={{ p: '10px' }} aria-label='location'>
								<MyLocation />
							</IconButton>
							<InputBase
								sx={{ ml: 1, flex: 1 }}
								inputProps={{ 'aria-label': '' }}
								{...getInputProps({
									placeholder: 'Enter Location...',
									className: 'location-search-input',
								})}
								ref={searchInput}
							/>
							<IconButton sx={{ p: '10px' }} aria-label='search'>
								<SearchIcon />
							</IconButton>
						</Paper>

						<div className='suggestion-dropdown'>
							{suggestions.map((suggestion) => {
								return (
									<MenuItem {...getSuggestionItemProps(suggestion)}>
										{suggestion.description}
									</MenuItem>
								);
							})}
						</div>
					</div>
				)}
			</PlacesAutocomplete>
		</div>
	);
};

export default LocationSearch;
