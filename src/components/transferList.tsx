import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}
function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList({ userList, transferResultFunc }) {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (user) => () => {
    const currentIndex = checked.indexOf(user);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(user);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };
  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };
  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };
  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const customList = (items) => (
    <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items.map((user, index) => {
          const labelId = `transfer-list-item-${index}-label`;
          return (
            <ListItem key={index} role="listitem" button
              onClick={handleToggle(user)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(user) !== -1} tabIndex={-1} disableRipple
                  inputProps={{ 'aria-labelledby': labelId, }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${user.email}`} />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

	useEffect(() => {
		setLeft([...userList]);
	}, [])

	useEffect(() => {
		transferResultFunc([...right]);
	}, [right])

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList(left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button sx={{ my: 0.5 }} variant="outlined" size="small"
            onClick={handleAllRight} disabled={left.length === 0}
            aria-label="move all right">
            ≫
          </Button>
          <Button sx={{ my: 0.5 }} variant="outlined" size="small"
            onClick={handleCheckedRight} disabled={leftChecked.length === 0}
            aria-label="move selected right">
            &gt;
          </Button>
          <Button sx={{ my: 0.5 }} variant="outlined" size="small"
            onClick={handleCheckedLeft} disabled={rightChecked.length === 0}
            aria-label="move selected left">
            &lt;
          </Button>
          <Button sx={{ my: 0.5 }} variant="outlined" size="small"
            onClick={handleAllLeft} disabled={right.length === 0}
            aria-label="move all left">
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(right)}</Grid>
    </Grid>
  );
}