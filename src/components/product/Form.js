import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

import ApiHandler from "../../classes/ApiHandler";
import { useState } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';

export default function ProductForm(props) {

	const { isNew, product, setProduct } = props;

	const [isUploadingImg, setIsUploadingImg] = useState(false)

	const handleUploadClick = event => {
		const file = event.target.files[0]
		const formData = new FormData()
		setIsUploadingImg(true)

		formData.append('imgFile', file)

		ApiHandler.uploadImage(formData)
			.then(response => response.json())
			.then(data => {
				product.imgPath = data.data
				setProduct(product)
				setIsUploadingImg(false)
			})
	}


	return (
		<>
			<Grid container spacing={1} style={{ marginBottom: "1em" }}>
				<Grid item xs={6}>
					<Button variant="contained" color="primary" component="label">
						Unggah Foto
						<input
							accept="image/*"
							type="file"
							onChange={handleUploadClick}
							hidden
						/>
					</Button>
					{isUploadingImg ?
						<CircularProgress /> :
						product.imgPath &&
						<img width="100%" src={"http://" + process.env.REACT_APP_API_SERVER + "/" + product.imgPath} alt="Foto Produk" />
					}


				</Grid>
			</Grid>
			<TextField
				required
				autoComplete="off"
				margin="dense"
				label="Kode"
				value={product.id}
				disabled={!isNew}
				fullWidth
				onChange={(e) => {
					product.id = e.target.value
					setProduct({ ...product })
				}}
			/>
			<TextField
				required
				autoComplete="off"
				margin="dense"
				label="Nama"
				value={product.name}
				fullWidth
				onChange={(e) => {
					product.name = e.target.value
					setProduct({ ...product })
				}}
			/>
			<TextField
				required
				autoComplete="off"
				margin="dense"
				label="Bahan"
				value={product.ingredients.join(',')}
				fullWidth
				onChange={(e) => {
					product.ingredients = e.target.value.split(',')
					setProduct({ ...product })
				}}
				helperText="pisahkan dengan koma (,)"
			/>

			{/* <input
				accept="image/*"
				// className={classes.input}
				id="contained-button-file"
				// multiple
				type="file"
			/>
			<label htmlFor="contained-button-file">
				<Button variant="contained" color="primary" component="span">
					Upload
				</Button>
			</label> */}

			<TextField
				required
				autoComplete="off"
				margin="dense"
				label="NO. Sertifikat Halal"
				value={product.halalCertificateId}
				fullWidth
				onChange={(e) => {
					product.halalCertificateId = e.target.value
					setProduct({ ...product })
				}}
			/>
		</>
	)

}