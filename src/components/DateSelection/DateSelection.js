import React from 'react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import { DatePicker } from '@mui/lab';
import { TextField } from '@mui/material';

const DateSelection = ({ date, setDate }) => {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker
				label='Filter by Date'
				openTo='day'
				views={['year', 'month', 'day']}
				value={date}
				onChange={(newValue) => {
					setDate(newValue);
				}}
				renderInput={(params) => <TextField {...params} />}
			/>
		</LocalizationProvider>
	);
};

export default DateSelection;
