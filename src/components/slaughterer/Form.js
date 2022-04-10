import { CircularProgress, Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useState } from "react";
import ApiHandler from "../../classes/ApiHandler";


export default function SlaughtererForm(props) {

	const { isNew, slaughterer, setSlaughterer } = props;

	const [isUploadingImg, setIsUploadingImg] = useState(false)
	const [isUploadingCertificateImg, setIsUploadingCertificateImg] = useState(false)

	const handleUploadClick = (e, property) => {
		const file = e.target.files[0]
		const formData = new FormData()
		formData.append('imgFile', file)

		switch (property) {
			case "img":
				setIsUploadingImg(true)
				break;

			case "certificateImg":
				setIsUploadingCertificateImg(true)
				break;

			default:
				break;
		}

		ApiHandler.uploadImage(formData)
			.then(response => response.json())
			.then(data => {
				switch (property) {
					case "img":
						slaughterer.imgPath = data.data
						setIsUploadingImg(false)
						break;

					case "certificateImg":
						slaughterer.certificateImgPath = data.data
						setIsUploadingCertificateImg(false)
						break;

					default:
						break;
				}

				setSlaughterer(slaughterer)
			})
	}

	return (
		<>
			<Grid container spacing={1} style={{ marginBottom: "1em" }}>
				<Grid item xs={6}>
					{
						!props.isDisabled &&
						<Button variant="contained" color="primary" component="label">
							Unggah Foto Penyembelih
							<input
								accept="image/*"
								type="file"
								onChange={(e) => handleUploadClick(e, "img")}
								hidden
							/>
						</Button>
					}
					{isUploadingImg ?
						<CircularProgress /> :
						slaughterer.imgPath &&
						<img width="100%" src={"http://" + process.env.REACT_APP_API_SERVER + "/" + slaughterer.imgPath} alt="Foto Penyembelih" />
					}


				</Grid>
				<Grid item xs={6}>
				{
						!props.isDisabled &&
					<Button variant="contained" color="primary" component="label">
						Unggah Foto Sertifikat
						<input
							accept="image/*"
							type="file"
							onChange={(e) => handleUploadClick(e, "certificateImg")}
							hidden
						/>
					</Button>
				}
					{isUploadingCertificateImg ?
						<CircularProgress /> :
						slaughterer.certificateImgPath &&
						<img width="100%" src={"http://" + process.env.REACT_APP_API_SERVER + "/" + slaughterer.certificateImgPath} alt="Foto Sertifikat Penyembelih" />
					}


				</Grid>
			</Grid>



			<TextField
				required
				autoComplete="off"
				margin="dense"
				label="Kode"
				value={slaughterer.id}
				disabled={!isNew || props.isDisabled}
				fullWidth
				onChange={(e) => {
					slaughterer.id = e.target.value
					setSlaughterer({ ...slaughterer })
				}}
			/>

			<TextField
				required
				autoComplete="off"
				disabled={props.isDisabled}
				margin="dense"
				label="NO. Sertifikat Halal"
				value={slaughterer.certificateNo}
				fullWidth
				onChange={(e) => {
					slaughterer.certificateNo = e.target.value
					setSlaughterer({ ...slaughterer })
				}}
			/>
			<TextField
				required
				autoComplete="off"
				margin="dense"
				label="Nama"
				disabled={props.isDisabled}

				value={slaughterer.name}
				fullWidth
				onChange={(e) => {
					slaughterer.name = e.target.value
					setSlaughterer({ ...slaughterer })
				}}
			/>


		</>
	)

}