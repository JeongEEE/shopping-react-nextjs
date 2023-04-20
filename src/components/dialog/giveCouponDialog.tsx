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
import { db } from 'src/firebaseConfig'
import { collection, addDoc, setDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { formatDateKor } from 'src/lib/utils';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import TransferList from 'src/components/transferList'
import dayjs, { Dayjs } from 'dayjs';

const GiveCouponDialog = ({ visible, visibleFunc, successFunc, userList, selectedCoupon }) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [selectedUserList, setSelectedUserList] = useState([]);

	const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
		visibleFunc(false);
		setSelectedUserList([]);
  };
	const transferResultFunc = (result) => {
		setSelectedUserList([...result]);
	}

	const confirm = () => {
		if(selectedUserList.length == 0) {
			enqueueSnackbar('선택한 유저가 없습니다', { variant: 'info', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }});
			return;
		}
		setLoading(true);
		selectedUserList.forEach((user, index) => {
			addDoc(collection(db, 'userData/coupons', user.email), {
				startTime: dayjs(new Date()).format(),
				description: selectedCoupon.description,
				discountPrice: selectedCoupon.discountPrice,
				expireDate: selectedCoupon.expireDate,
				title: selectedCoupon.title,
				status: selectedCoupon.status,
				createdTime: formatDateKor(new Date()),
				timeMillisecond: Date.now()
			}).then((docRef) => {
				if(selectedUserList.length -1 == index) {
					setLoading(false);
					handleClose();
				}
			}).catch((error) => {
				console.log(error);
				if(selectedUserList.length -1 == index) setLoading(false);
			});
		})
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
        <DialogTitle>{'쿠폰 할당하기'}</DialogTitle>
        <DialogContent css={css`max-height:30rem;`}>
          <TransferList userList={userList} transferResultFunc={transferResultFunc} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <LoadingButton css={blueBtn} loading={loading} onClick={confirm}>
						확인
					</LoadingButton>
        </DialogActions>
      </Dialog>
			<SnackbarProvider preventDuplicate />
		</div>
	)
}

export default GiveCouponDialog