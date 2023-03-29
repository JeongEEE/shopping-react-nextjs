import React from 'react'

import Button from "@mui/material/Button";
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
	button1: {
		background: 'orange',
		color: 'white',
		'&:hover': {
			background: 'white',
			color: 'black'
		}
	},
	button2: {
		background: 'yellow',
		color: 'black',
		'&:hover': {
			background: 'white',
			color: 'black'
		}
	}
})

const MuiTest = () => {
	const classes = useStyles();

	return (
		<div>
			<h1>Material UI Test</h1>
			<Button className={classes.button1}>Button</Button>
			<Button className={classes.button2}>Button</Button>
			<AccessibilityIcon color="primary" />
		</div>
	)
}

export default MuiTest