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
import { collection, addDoc, setDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { formatDateKor } from 'src/lib/utils';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const AddProductDialog = ({ visible, editType, originProduct, visibleFunc, successFunc }) => {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [category, setCategory] = useState('');
	const [price, setPrice] = useState(0);
	const [description, setDescription] = useState('');
	const [imageSrc, setImageSrc]: any = useState(null);
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState('');
	const [loading, setLoading] = useState<boolean>(false);
	const [productCount, setProductCount] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
		setTitle('');
		setCategory('');
		setPrice(0);
		setDescription('');
		setImageSrc(null);
		setFileName('');
		visibleFunc(false);
  };

	const handleDes = (e) => {
		setDescription(e.target.value)
	}
	const titleChange = (e) => {
		setTitle(e.target.value);
	}
	const categoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };
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

	const modifyProductImage = () => {
		if(fileName === originProduct.fileName) return originProduct.image;
		return new Promise<string>(async (resolve) => { 
			await deleteObject(ref(storage, `productImage/${originProduct.fileName}`))
				.then((snapshot) => { }).catch((error) => { });
			await uploadBytes(ref(storage, `productImage/${fileName}`), file)
				.then((snapshot) => {
				}).catch((error) => { });
			await getDownloadURL(ref(storage, `productImage/${fileName}`))
				.then((snapshot) => {
					resolve(snapshot);
				}).catch((error) => { });
		});
	}

	const editProduct = async () => {
		if(title == '' || category == '' || price == 0 || description == '' || fileName === '') return;
		setLoading(true);
		if(editType === 'add') {
			let imageUrl = await fileImageUpload();
			await addDoc(collection(db, 'products'), {
				title: title,
				category: category,
				price: price,
				description: description,
				image: imageUrl,
				fileName: fileName,
				wish: false,
				createdTime: formatDateKor(new Date()),
				timeMillisecond: Date.now()
			}).then((docRef) => {
				plusProductCount();
				setLoading(false);
				successFunc(editType);
				handleClose();
			}).catch((error) => {
				setLoading(false);
				console.log(error);
			});	
		} else { // modify
			let imageUrl = await modifyProductImage();
			await updateDoc(doc(db, 'products', originProduct.id), {
				title: title,
				category: category,
				price: price,
				description: description,
				image: imageUrl,
				fileName: fileName,
				wish: originProduct.wish,
				createdTime: originProduct.createdTime,
				timeMillisecond: originProduct.timeMillisecond
			}).then((docRef) => {
				setLoading(false);
				successFunc(editType);
				handleClose();
			}).catch((error) => {
				setLoading(false);
				console.log(error);
			});	
		}
	}

	const getProductCount = () => {
		getDoc(doc(db, 'docCount/products'))
		.then((snapshot) => {
			setProductCount(snapshot.data().count);
		}).catch((error) => { });	
	}

	const plusProductCount = () => {
		setDoc(doc(db, 'docCount/products'), {
			count: productCount + 1
		}).then((docRef) => {
			setProductCount(productCount + 1);
		}).catch((error) => { });	
	}

	useEffect(() => {
		if(visible) {
			handleClickOpen();
			getProductCount();
			if(editType == 'modify') {
				setTitle(originProduct.title);
				setCategory(originProduct.category);
				setPrice(originProduct.price);
				setDescription(originProduct.description);
				setImageSrc(originProduct.image);
				setFileName(originProduct.fileName);
			}
		}
		else handleClose();
		return () => {
			
		}
	}, [visible])
	

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editType == 'add' ? '상품 추가하기' : '상품 수정하기'}</DialogTitle>
        <DialogContent css={css`max-height:30rem;`}>
          <TextField autoFocus margin="dense" type="text" onChange={titleChange}
            label="상품명" fullWidth variant="standard" value={title} />
					<TextField margin="dense" type="number" onChange={priceChange}
						label="가격(단위 원)" fullWidth variant="standard" value={price} />
					<Box mt={2}>
						<FormControl sx={{ minWidth: 200 }} size="small">
							<InputLabel id="demo-select-small">카테고리</InputLabel>
							<Select labelId="demo-select-small" id="demo-select-small"
								value={category} label="카테고리" onChange={categoryChange}>
								<MenuItem value={'전자기기'}>전자기기</MenuItem>
								<MenuItem value={'보석'}>보석</MenuItem>
								<MenuItem value={'남성의류'}>남성의류</MenuItem>
								<MenuItem value={'여성의류'}>여성의류</MenuItem>
								<MenuItem value={'식품'}>식품</MenuItem>
							</Select>
						</FormControl>
					</Box>
					<textarea onChange={handleDes} id="description" name="description"
						placeholder="상품 설명" value={description}
            rows={6} cols={63} css={css`padding:10px; margin-top:10px;margin-bottom:10px;`}>
          </textarea>
					<input accept="image/*" type="file" onChange={e => onUpload(e)} />
					<img src={imageSrc} css={css`max-height:150px;`} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <LoadingButton onClick={editProduct} css={blueBtn} loading={loading}>
						{editType == 'add' ? '추가' : '수정'}
					</LoadingButton>
        </DialogActions>
      </Dialog>
		</div>
	)
}

export default AddProductDialog