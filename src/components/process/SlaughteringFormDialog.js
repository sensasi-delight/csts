import { Button, Chip, FormControl, Input, InputAdornment, InputLabel, MenuItem, Select, Toolbar } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { useEffect, useState } from "react";
import ApiHandler from "../../classes/ApiHandler";
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import SubjectIcon from '@material-ui/icons/Subject'

import SingleLineImageList from "../SingleLineImageList";
import SlaughtererForm from "../slaughterer/Form";




const useStyles = makeStyles((theme) => ({
	inputMargin: {
		marginTop: "1.5em"
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	chip: {
		margin: 2,
	},
}));


function getStyles(id, ids, theme) {
	return {
		fontWeight:
			ids.indexOf(id) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium,
	};
}
export default function SlaughteringFormDialog(props) {
	const classes = useStyles();
	const theme = useTheme();

	const { isOpen, closeForm, handleSubmit, isDisabled } = props;

	const [slaughtererDetail, setSlaughtererDetail] = useState({})
	const [isSlaughtererDetailOpen, setIsSlaughtererDetailOpen] = useState(false)


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


	const [slaughterers, setSlaughterers] = useState({
		success: false,
		data: [],
		message: "belum dilakukan fetch"
	})


	useEffect(() => {
		ApiHandler.readSlaughterers()
			.then(res => res.json())
			.then(data => setSlaughterers(data))
	}, [])

	return (
		<Dialog
			maxWidth="xs"
			open={isOpen}
			onClose={closeForm}
		>
			<DialogTitle>{processObj.name}</DialogTitle>
			<DialogContent>
				<Button disabled={isDisabled} variant="contained" color="primary" component="label">
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
					}} />
				}


				<TextField
					required
					autoComplete="off"
					margin="dense"
					label="Waktu Proses"
					className={classes.inputMargin}
					value={processObj.datetime || (new Date()).toISOString().substring(-1, 16)}
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

				<FormControl className={classes.inputMargin} fullWidth>
					<InputLabel id="demo-mutiple-chip-label">Penyembelih</InputLabel>
					<Select
						disabled={isDisabled}
						labelId="demo-mutiple-chip-label"
						id="demo-mutiple-chip"
						multiple
						value={processObj.slaughterers}
						onChange={(event) => {
							processObj.slaughterers = event.target.value
							setProcess({ ...processObj })
						}}
						input={<Input id="select-multiple-chip" />}
						renderValue={(selected) => (
							<div className={classes.chips}>
								{selected.map((slaughterer) => (
									// <Chip key={value.id} label={value.id + " - " + value.name} className={classes.chip} />
									<Chip
										key={slaughterer.id}
										variant="outlined"
										clickable={false}
										deleteIcon={<SubjectIcon />}
										onDelete={() => {
											setSlaughtererDetail({ ...slaughterer })
											setIsSlaughtererDetailOpen(true)
										}}
										avatar={<Avatar src={"http://" + process.env.REACT_APP_API_SERVER + "/" + slaughterer.imgPath} />}
										label={slaughterer.name}
									/>
								))}
							</div>
						)}
					>
						{slaughterers.data.map((slaughterer, i) => (
							<MenuItem key={i} value={slaughterer.Record} style={getStyles(slaughterer.Record, processObj.slaughterers, theme)}>
								{/* <img src="" alt="" /> */}
								<img width="80px" src={"http://" + process.env.REACT_APP_API_SERVER + "/" + slaughterer.Record.imgPath} alt={"Foto " + slaughterer.Record.name} />

								: ({slaughterer.Record.id}) - {slaughterer.Record.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>


				<TextField
					autoComplete="off"
					margin="dense"
					label="Pisau (merk + tajam)"
					value={processObj.knifeInfo}
					disabled={isDisabled}
					fullWidth
					onChange={(e) => {
						processObj.knifeInfo = e.target.value
						setProcess({ ...processObj })
					}}
				/>


				<TextField
					className={classes.inputMargin}
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
					className={classes.inputMargin}
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
				<Button className={classes.inputMargin} style={{ marginBottom: "2em" }} disabled={isDisabled} variant="contained" onClick={() => { handleSubmit(processObj); closeForm() }} color="primary" autoFocus>
					Simpan
				</Button>
			</DialogContent>


			<Dialog
				open={isSlaughtererDetailOpen}
				onClose={() => setIsSlaughtererDetailOpen(false)}
			>
				<DialogTitle id="customized-dialog-title" >
					Data Penyembelih
				</DialogTitle>
				<DialogContent>
					<SlaughtererForm
						isDisabled={true}
						slaughterer={slaughtererDetail} />
					
					<Toolbar />
				</DialogContent>
			</Dialog>
		</Dialog>
	)

}