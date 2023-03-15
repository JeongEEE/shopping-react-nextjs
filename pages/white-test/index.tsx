import React from 'react'
import Link from 'next/link'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SnackbarProvider, enqueueSnackbar } from 'notistack'

const WhiteTest = () => {
	const openSnackbar = () => {
		enqueueSnackbar('That was easy!', { variant: 'info', autoHideDuration: 2000,
			anchorOrigin: {
				vertical: 'top',
				horizontal: 'center'
		}})
	}

	return (
		<div>
			<Typography variant="h3">White Test</Typography>
			<Stack mt={1} direction="row" spacing={1}>
				<Button variant="contained" href="/white-test/mui-test">MUI TEST</Button>
				<Button variant="contained" href="/white-test/recoil-test">Recoil TEST</Button>
			</Stack>
			<Stack mt={1} direction="row" spacing={1}>
				<Button variant="contained" onClick={openSnackbar}>Snackbar TEST</Button>
			</Stack>
			<SnackbarProvider preventDuplicate />
		</div>
	)
}

export default WhiteTest