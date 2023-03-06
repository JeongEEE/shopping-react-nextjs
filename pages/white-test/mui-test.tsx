import React from 'react'

import Button from "@mui/material/Button";
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import { makeStyles } from '@mui/styles';
import { MuiStyles } from './mui-test-css'

const useStyles = makeStyles(MuiStyles)

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