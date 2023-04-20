import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { blueBtn } from 'src/styles/global'
import { css } from '@emotion/react'
import { db } from 'src/firebaseConfig'
import { collection, addDoc, setDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { formatDateKor } from 'src/lib/utils';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';

const AddCouponDialog = ({ visible, visibleFunc, successFunc }) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [title, setTitle] = useState('');
	const [discountPrice, setDiscountPrice] = useState(0);
	const [expireDate, setExpireDate] = useState(14);
	const [description, setDescription] = useState('');

	const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
		visibleFunc(false);
		setTitle('');
		setDiscountPrice(0);
		setExpireDate(14);
		setDescription('');
  };

	const titleChange = (e) => {
		setTitle(e.target.value);
	}
	const discountPriceChange = (e) => {
		setDiscountPrice(e.target.value);
	}
	const expireDateChange = (e) => {
		if(e.target.value <= 0) setExpireDate(1);
		else setExpireDate(e.target.value);
	}
	const handleDes = (e) => {
		setDescription(e.target.value)
	}

	const addCoupon = async () => {
		if(title == '' || discountPrice == 0 || expireDate == 0 || description == '') {
			enqueueSnackbar('입력값이 없으면 안되요', 
				{ variant: 'warning', autoHideDuration: 2000,
					anchorOrigin: { vertical: 'top', horizontal: 'center' }});
			return;
		};
		setLoading(true);
		await addDoc(collection(db, 'coupons'), {
			title: title,
			discountPrice: discountPrice,
			description: description,
			expireDate: expireDate,
			status: 'Available',
			createdTime: formatDateKor(new Date()),
			timeMillisecond: Date.now()
		}).then((docRef) => {
			setLoading(false);
			successFunc();
			handleClose();
		}).catch((error) => {
			setLoading(false);
			console.log(error);
		});
	}

	useEffect(() => {
		if(visible) {
			handleClickOpen();
		}
		else handleClose();
		return () => {
			
		}
	}, [visible])

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'쿠폰 추가하기'}</DialogTitle>
        <DialogContent css={css`max-height:30rem;`}>
          <TextField autoFocus margin="dense" type="text" onChange={titleChange}
            label="쿠폰명" fullWidth variant="standard" value={title} />
					<Grid container mb={2} direction="row" justifyContent="center" alignItems="center">
						<Grid item container xs={6} pr={2}>
							<TextField margin="dense" type="number" onChange={discountPriceChange}
								label="할인금액(단위 원)" fullWidth variant="standard" value={discountPrice} />
						</Grid>
						<Grid item container xs={6}>
							<TextField margin="dense" type="number" onChange={expireDateChange}
								label="쿠폰 유효 기간" fullWidth variant="standard" value={expireDate} />
						</Grid>
					</Grid>
					<textarea onChange={handleDes} id="description" name="description"
						placeholder="쿠폰 상세 설명" value={description}
            rows={6} cols={63} css={css`padding:10px; margin-top:10px;margin-bottom:10px;`}>
          </textarea>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <LoadingButton onClick={addCoupon} css={blueBtn} loading={loading}>
						추가
					</LoadingButton>
        </DialogActions>
      </Dialog>
			<SnackbarProvider preventDuplicate />
		</div>
	)
}

export default AddCouponDialog