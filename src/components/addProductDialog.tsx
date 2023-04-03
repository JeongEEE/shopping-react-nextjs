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
import { db, storage } from 'src/firebaseConfig'
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { formatDateKor } from 'src/lib/utils';
import LoadingButton from '@mui/lab/LoadingButton';

const AddProductDialog = ({ visible, visibleFunc, successFunc }) => {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState(0);
	const [description, setDescription] = useState('');
	const [imageSrc, setImageSrc]: any = useState(null);
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState('');
	const [loading, setLoading] = useState<boolean>(false);

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
		const productFile = e.target.files[0];
		setFileName(productFile.name);
		setFile(productFile);
		const reader = new FileReader();
		reader.readAsDataURL(productFile);
		return new Promise<void>((resolve) => { 
			reader.onload = () => {	
				setImageSrc(reader.result || null); // 파일의 컨텐츠
					resolve();
			};
		});
	}

	const fileImageUpload = () => {
		if(fileName === '') return;
		return new Promise<string>(async (resolve) => { 
			await uploadBytes(ref(storage, `productImage/${fileName}`), file)
			.then((snapshot) => {
			}).catch((error) => { });
			await getDownloadURL(ref(storage, `productImage/${fileName}`))
			.then((snapshot) => {
				resolve(snapshot);
			}).catch((error) => { });
		});
	}

	const addProduct = async () => {
		if(title == '' || price == 0 || description == '') return;
		setLoading(true);
		let imageUrl = await fileImageUpload();
		await addDoc(collection(db, 'products'), {
			title: title,
			price: price,
			description: description,
			image: imageUrl,
			fileName: fileName,
			wish: false,
			createdTime: formatDateKor(new Date()),
			timeMillisecond: Date.now()
    }).then((docRef) => {
			setLoading(false);
			successFunc(true);
			handleClose();
		}).catch((error) => {
			setLoading(false);
			console.log(error);
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
            label="가격(단위 원)" fullWidth variant="standard" />
					<textarea onChange={handleDes} id="description" name="description"
						placeholder="상품 설명"
            rows={6} cols={63} css={css`padding:10px; margin-top:10px;margin-bottom:10px;`}>
          </textarea>
					<input accept="image/*" type="file" onChange={e => onUpload(e)} />
					<img src={imageSrc} css={css`max-height:150px;`} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <LoadingButton onClick={addProduct} css={blueBtn} loading={loading}>추가</LoadingButton>
        </DialogActions>
      </Dialog>
		</div>
	)
}

export default AddProductDialog