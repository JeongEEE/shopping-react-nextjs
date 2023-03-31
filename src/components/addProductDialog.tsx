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
	const [imageSrc, setImageSrc]: any = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
		setTitle('');
		setPrice(0);
		setDescription('');
		setImageSrc(null);
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

	const onUpload = (e: any) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.readAsDataURL(file);

		return new Promise<void>((resolve) => { 
			reader.onload = () => {	
				setImageSrc(reader.result || null); // 파일의 컨텐츠
					resolve();
			};
		});
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
        <DialogContent css={css`max-height:30rem;`}>
          <TextField autoFocus margin="dense" type="text" onChange={titleChange}
            label="상품명" fullWidth variant="standard" />
					<TextField margin="dense" type="number" onChange={priceChange}
            label="가격" fullWidth variant="standard" />
					<textarea onChange={handleDes} id="description" name="description"
            rows={6} cols={63} css={css`padding:10px; margin-top:10px;margin-bottom:10px;`}>
          </textarea>
					<input accept="image/*" type="file" onChange={e => onUpload(e)} />
					<img src={imageSrc} css={css`max-height:150px;`} />
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