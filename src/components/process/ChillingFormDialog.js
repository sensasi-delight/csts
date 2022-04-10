import { Button, DialogActions, InputAdornment } from "@material-ui/core";
import { CircularProgress, Grid } from "@material-ui/core";

import { makeStyles } from '@material-ui/core/styles';


import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { useState } from "react";
import ApiHandler from "../../classes/ApiHandler";

import SingleLineImageList from "../SingleLineImageList";


const useStyles = makeStyles((theme) => ({
	inputMargin: {
		marginTop: "1.5em"
	}
}));


export default function ChillingFormDialog(props) {

	const classes = useStyles();


	const { isOpen, closeForm, handleSubmit, isDisabled } = props;

	const [processObj, setProcess] = useState(props.process)

	const [isUploadingImg, setIsUploadingImg] = useState(false)

	const handleUploadClick = (e) => {
		const file = e.target.files[0]
		const formData = new FormData()
		formData.append('imgFile', file)
		setIsUploadingImg(true)

		ApiHandler.uploadImage(formData)
			.then(response => response.json())
			.then(data => {
				processObj.imgPaths.push(data.data)
				setIsUploadingImg(false)
			})
	}

	return (
		<Dialog
			maxWidth="xs"
			open={isOpen}
			onClose={closeForm}
		>
			<DialogTitle>{processObj.name}</DialogTitle>
			<DialogContent>
			<Grid container style={{ marginBottom: "1em" }}>
					<Grid item>
						<Button variant="contained" color="primary" component="label" disabled={isDisabled}>
							Unggah Foto Proses
							<input
								accept="image/*"
								type="file"
								onChange={(e) => handleUploadClick(e)}
								hidden
							/>
						</Button>
						{isUploadingImg ?
							<CircularProgress /> :
							processObj.imgPaths &&
							<SingleLineImageList isDisabled={isDisabled} itemData={processObj.imgPaths} delImg={(imgPath) => {
								processObj.imgPaths.splice(processObj.imgPaths.findIndex(el => el === imgPath), 1)
								setProcess({ ...processObj })
							}}/>
						}
					</Grid>
				</Grid>
			<TextField
					required
					autoComplete="off"
					margin="dense"
					label="Waktu Proses"
					value={processObj.datetime}
					disabled={isDisabled}
					type="datetime-local"
					fullWidth
					InputLabelProps={{
						shrink: true,
					}}
					onChange={e => {
						processObj.datetime = e.target.value
						setProcess({ ...processObj })
					}}
				/>


				<TextField
					required
					autoComplete="off"
					margin="dense"
					label="Jumlah Gagal"
					InputProps={{
						endAdornment: <InputAdornment position="end">Ekor</InputAdornment>,
					}}
					value={processObj.nFail}
					disabled={isDisabled}
					type="number"
					min="0"
					fullWidth
					onChange={e => {
						processObj.nFail = e.target.value
						setProcess({ ...processObj })
					}}
				/>


				<TextField
					multiline
					autoComplete="off"
					margin="dense"
					label="Catatan Tambahan"
					value={processObj.note}
					disabled={isDisabled}
					fullWidth
					onChange={(e) => {
						processObj.note = e.target.value
						setProcess({ ...processObj })
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button className={classes.inputMargin} style={{ marginBottom: "2em" }} disabled={isDisabled} variant="contained" onClick={() => { handleSubmit(processObj); closeForm() }} color="primary" autoFocus>
					Simpan
				</Button>
			</DialogActions>
		</Dialog>
	)

}