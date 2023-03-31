import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { css } from '@emotion/react'
import { blueBtn } from 'src/styles/global'

const AddProductDialog = ({ visible, visibleFunc }) => {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState(0);
	const [description, setDescription] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
		visibleFunc(false);
  };

	const handleDes = (e) => {
		setDescription(e.target.value)
	}
	const titleChange = (e) => {
		setTitle(e.target.value);
	}
	const priceChange = (e) => {
		setPrice(e.target.value);
	}

	useEffect(() => {
		if(visible) handleClickOpen();
		else handleClose();
		return () => {
			
		}
	}, [visible])
	

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
        <DialogTitle>상품 추가하기</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" type="text" onChange={titleChange}
            label="상품명" fullWidth variant="standard" />
					<TextField autoFocus margin="dense" type="number" onChange={priceChange}
            label="가격" fullWidth variant="standard" />
					<textarea onChange={handleDes} id="description" name="description"
            rows={6} cols={63} css={css`padding:10px; margin-top:10px;`}>
          </textarea>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleClose} css={blueBtn}>추가</Button>
        </DialogActions>
      </Dialog>
		</div>
	)
}

export default AddProductDialog