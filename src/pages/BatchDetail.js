import { CircularProgress, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import processes from "../classes/Processes";

import ReceiveFormDialog from "../components/process/ReceiveFormDialog";
import AntemortemFormDialog from "../components/process/AntemortemFormDialog";
import HangingFormDialog from "../components/process/HangingFormDialog";
import StunningFormDialog from "../components/process/StunningFormDialog";
import SlaughteringFormDialog from "../components/process/SlaughteringFormDialog";
import BleedingFormDialog from "../components/process/BleedingFormDialog";
import ChillingFormDialog from "../components/process/ChillingFormDialog";
import EviscerationFormDialog from "../components/process/EviscerationFormDialog";
import HeadCuttingFormDialog from "../components/process/HeadCuttingFormDialog";
import DefeatheringFormDialog from "../components/process/DefeatheringFormDialog";
import ScaldingFormDialog from "../components/process/ScaldingFormDialog";
import GradingFormDialog from "../components/process/GradingFormDialog";
import PackingFormDialog from "../components/process/PackingFormDialog";
import StoringFormDialog from "../components/process/StoringFormDialog";
import ApiHandler from "../classes/ApiHandler";

import QRCode from "react-qr-code";

import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';


const useStyles = makeStyles((theme) => ({
	icon: {
		marginRight: theme.spacing(2),
	},
	heroContent: {
		// backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(8, 0, 6),
	},
	heroButtons: {
		marginTop: theme.spacing(4),
	},
	cardGrid: {
		paddingTop: theme.spacing(8),
		paddingBottom: theme.spacing(8),
	},
	card: {
		height: "100%",
		display: "flex",
		flexDirection: "column",
	},

	cardMedia: {
		paddingTop: "56.25%", // 16:9
	},
	cardContent: {
		flexGrow: 1,
	},
	footer: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(6),
	},
}));



function BatchDetail(props) {
	const classes = useStyles();

	const [uiToggle, setUiToggle] = useState({
		receiveFormDialog: false,
		antemortemFormDialog: false,
		hangingFormDialog: false,
		stunningFormDialog: false,
		slaughteringFormDialog: false,
		bleedingFormDialog: false,
		scaldingFormDialog: false,
		eviscerationFormDialog: false,
		headCuttingFormDialog: false,
		defeatheringFormDialog: false,
		chillingFormDialog: false,
		gradingFormDialog: false,
		packingFormDialog: false,
		storingFormDialog: false
	})






	const toggleForm = processId => {

		switch (processId) {
			case 1:
				uiToggle.receiveFormDialog = !uiToggle.receiveFormDialog

				break;

			case 2:
				uiToggle.antemortemFormDialog = !uiToggle.antemortemFormDialog

				break;

			case 3:
				uiToggle.hangingFormDialog = !uiToggle.hangingFormDialog

				break;

			case 4:
				uiToggle.stunningFormDialog = !uiToggle.stunningFormDialog

				break;

			case 5:
				uiToggle.slaughteringFormDialog = !uiToggle.slaughteringFormDialog

				break;

			case 6:
				uiToggle.bleedingFormDialog = !uiToggle.bleedingFormDialog

				break;

			case 7:
				uiToggle.scaldingFormDialog = !uiToggle.scaldingFormDialog

				break;

			case 8:
				uiToggle.eviscerationFormDialog = !uiToggle.eviscerationFormDialog

				break;

			case 9:
				uiToggle.headCuttingFormDialog = !uiToggle.headCuttingFormDialog

				break;

			case 10:
				uiToggle.defeatheringFormDialog = !uiToggle.defeatheringFormDialog

				break;

			case 11:
				uiToggle.chillingFormDialog = !uiToggle.chillingFormDialog

				break;

			case 12:
				uiToggle.gradingFormDialog = !uiToggle.gradingFormDialog

				break;

			case 13:
				uiToggle.packingFormDialog = !uiToggle.packingFormDialog

				break;

			case 14:
				uiToggle.storingFormDialog = !uiToggle.storingFormDialog

				break;

			default:
				break;
		}
		setUiToggle({ ...uiToggle })
	}

	const pathnames = [...window.location.pathname.split('/')]

	const batchId = pathnames[2]
	const date = pathnames[3]

	pathnames.splice(1, 0, 'view')
	const qrValue = window.location.host + pathnames.join('/')

	const [batch, setBatch] = useState(undefined)


	useEffect(() => {
		ApiHandler.readBatch(batchId, [{ key: 'date', value: date }])
			.then(res => res.json())
			.then(data => {
				const res = data.data

				if (!res.processes) {
					res.processes = processes
				}

				return setBatch({ ...res })
			})


	}, [batchId, date])


	const handleUpdateBatch = () => {
		if (batch && batch.processes) {

			batch.processes.map((processObj, i) => {
				if (!processObj.createdAt && processObj.datetime) {
					processObj.datetime = ""
				}

				return 0
			})
		}


		ApiHandler.updateBatch(batch, date)
			.then(res => res.json())
	}


	return (
		<>

			{batch && batch.processes ?
				<Container className={classes.cardGrid} maxWidth="md">

					<Grid container spacing={4}>

						<Grid item xs={12} sm={4} style={{ textAlign: "center" }}>
							<QRCode value={qrValue} />
						</Grid>
						<Grid item xs={12} sm={8}>

							<Typography variant="h4" component="h1" gutterBottom>Ringkasan</Typography>
							<Table size='small'>
								<TableBody>

									<TableRow>
										<TableCell>Kode Batch</TableCell>
										<TableCell>:</TableCell>
										<TableCell>{batch.id}</TableCell>
									</TableRow>

									<TableRow>
										<TableCell>TGL. Produksi</TableCell>
										<TableCell>:</TableCell>
										<TableCell>{batch.date}</TableCell>
									</TableRow>

									<TableRow>
										<TableCell>Nama Produk</TableCell>
										<TableCell>:</TableCell>
										<TableCell>{batch.productState.name}</TableCell>
									</TableRow>

									<TableRow>
										<TableCell>Bahan</TableCell>
										<TableCell>:</TableCell>
										<TableCell>{batch.ingredients}</TableCell>
									</TableRow>

									<TableRow>
										<TableCell>Total Ayam</TableCell>
										<TableCell>:</TableCell>
										<TableCell>{batch.processes.find(x => x.id === 1).qtyEstimated} Ekor</TableCell>
									</TableRow>

									<TableRow>
										<TableCell>Total Reject</TableCell>
										<TableCell>:</TableCell>
										<TableCell>{batch.processes.reduce((a, b) => a + (parseInt(b.nFail) || 0), 0)} Ekor</TableCell>
									</TableRow>

									<TableRow>
										<TableCell>Jumlah Kemasan</TableCell>
										<TableCell>:</TableCell>
										<TableCell>{batch.processes.find(x => x.id === 13).nPack} Bks</TableCell>
									</TableRow>
								</TableBody>

							</Table>
						</Grid>
					</Grid>

				</Container> :
				<Grid container justifyContent="center">
					<CircularProgress />
				</Grid>

			}

			<Container maxWidth="md" style={{ paddingBottom: "8em" }}>
				<Grid container spacing={4}>
					{batch && batch.processes ?

						batch.processes.map((processObj, i) => (

							<Grid item key={processObj.id} xs={12} sm={6} md={4}>
								<Card style={{ backgroundColor: [1, 4, 5, 6].includes(processObj.id) ? "#ffdF0080" : "inherit" }}
									className={classes.card} elevation={4}>
									<CardHeader
										title={i + 1}
										subheader={[1, 4, 5, 6].includes(processObj.id) ? 'titik kritis halal' : null}
									/>
									<CardContent className={classes.cardContent}>
										<Typography gutterBottom variant="h5" component="h2">
											{processObj.name}
										</Typography>
										{processObj.createdAt ?

											<Typography variant="body1">

												telah diproses pukul: {processObj.datetime.replace('T', ' ')}
											</Typography> : null
										}
									</CardContent>
									<CardActions>
										<Button size="small" startIcon={processObj.createdAt ? <VisibilityIcon /> : <EditIcon />} variant="contained" color={processObj.createdAt ? "default" : "primary"} onClick={() => {
											toggleForm(processObj.id)

											if (!processObj.createdAt) {
												const dt = new Date()
												dt.setHours(dt.getHours() + (dt.getTimezoneOffset() / -60))
												processObj.datetime = dt.toISOString().substring(-1, 16)
											}
										}}>

											{
												processObj.createdAt ?
													"lihat data"
													:
													"Masukkan data"
											}

										</Button>
									</CardActions>
								</Card>

							</Grid>
						)) : <CircularProgress />

					}
				</Grid>
			</Container>

			{batch && batch.processes &&

				<>

					<ReceiveFormDialog
						isOpen={uiToggle.receiveFormDialog}
						process={batch.processes[0]}
						isDisabled={batch.processes[0].createdAt !== ""}
						closeForm={() => toggleForm(batch.processes[0].id)}
						handleSubmit={editedProcess => {
							batch.processes[0] = { ...editedProcess }
							batch.processes[0].createdAt = (new Date()).toISOString().substring(-1, 16)
							handleUpdateBatch()
						}}
					/>

					<AntemortemFormDialog
						isOpen={uiToggle.antemortemFormDialog}
						process={batch.processes[1]}
						isDisabled={batch.processes[1].createdAt !== ""}
						closeForm={() => toggleForm(batch.processes[1].id)}
						handleSubmit={editedProcess => {
							batch.processes[1] = { ...editedProcess }
							batch.processes[1].createdAt = (new Date()).toISOString().substring(-1, 16)
							handleUpdateBatch()
						}}
					/>

					<HangingFormDialog
						isOpen={uiToggle.hangingFormDialog}
						process={batch.processes[2]}
						isDisabled={batch.processes[2].createdAt !== ""}
						closeForm={() => toggleForm(batch.processes[2].id)}
						handleSubmit={editedProcess => {
							batch.processes[2] = { ...editedProcess }
							batch.processes[2].createdAt = (new Date()).toISOString().substring(-1, 16)
							handleUpdateBatch()
						}}
					/>

					<StunningFormDialog
						isOpen={uiToggle.stunningFormDialog}
						process={batch.processes[3]}
						isDisabled={batch.processes[3].createdAt !== ""}
						closeForm={() => toggleForm(batch.processes[3].id)}
						handleSubmit={editedProcess => {
							batch.processes[3] = { ...editedProcess }
							batch.processes[3].createdAt = (new Date()).toISOString().substring(-1, 16)
							handleUpdateBatch()
						}}
					/>

					<SlaughteringFormDialog
						isOpen={uiToggle.slaughteringFormDialog}
						process={batch.processes[4]}
						isDisabled={batch.processes[4].createdAt !== ""}
						closeForm={() => toggleForm(batch.processes[4].id)}
						handleSubmit={editedProcess => {
							batch.processes[4] = { ...editedProcess }
							batch.processes[4].createdAt = (new Date()).toISOString().substring(-1, 16)
							handleUpdateBatch()
						}}
					/>

					<BleedingFormDialog
						isOpen={uiToggle.bleedingFormDialog}
						process={batch.processes[5]}
						isDisabled={batch.processes[5].createdAt !== ""}
						closeForm={() => toggleForm(batch.processes[5].id)}
						handleSubmit={editedProcess => {
							batch.processes[5] = { ...editedProcess }
							batch.processes[5].createdAt = (new Date()).toISOString().substring(-1, 16)
							handleUpdateBatch()
						}}
					/>

					<ScaldingFormDialog
						isOpen={uiToggle.scaldingFormDialog}
						process={batch.processes[6]}
						isDisabled={batch.processes[6].createdAt !== ""}
						closeForm={() => toggleForm(batch.processes[6].id)}
						handleSubmit={editedProcess => {
							batch.processes[6] = { ...editedProcess }
							batch.processes[6].createdAt = (new Date()).toISOString().substring(-1, 16)
							handleUpdateBatch()
						}}
					/>



					<EviscerationFormDialog
						isOpen={uiToggle.eviscerationFormDialog}
						process={batch.processes[7]}
						isDisabled={batch.processes[7].createdAt !== ""}
						closeForm={() => toggleForm(batch.processes[7].id)}
						handleSubmit={editedProcess => {
							batch.processes[7] = { ...editedProcess }
							batch.processes[7].createdAt = (new Date()).toISOString().substring(-1, 16)
							handleUpdateBatch()
						}}
					/>

					<HeadCuttingFormDialog
						isOpen={uiToggle.headCuttingFormDialog}
						process={batch.processes[8]}
						isDisabled={batch.processes[8].createdAt !== ""}
						closeForm={() => toggleForm(batch.processes[8].id)}
						handleSubmit={editedProcess => {
							batch.processes[8] = { ...editedProcess }
							batch.processes[8].createdAt = (new Date()).toISOString().substring(-1, 16)
							handleUpdateBatch()
						}}
					/>

					<DefeatheringFormDialog
						isOpen={uiToggle.defeatheringFormDialog}
						process={batch.processes[9]}
						isDisabled={batch.processes[9].createdAt !== ""}
						closeForm={() => toggleForm(batch.processes[9].id)}
						handleSubmit={editedProcess => {
							batch.processes[9] = { ...editedProcess }
							batch.processes[9].createdAt = (new Date()).toISOString().substring(-1, 16)
							handleUpdateBatch()
						}}
					/>

					<ChillingFormDialog
						isOpen={uiToggle.chillingFormDialog}
						process={batch.processes[10]}
						isDisabled={batch.processes[10].createdAt !== ""}
						closeForm={() => toggleForm(batch.processes[10].id)}
						handleSubmit={editedProcess => {
							batch.processes[10] = { ...editedProcess }
							batch.processes[10].createdAt = (new Date()).toISOString().substring(-1, 16)
							handleUpdateBatch()
						}}
					/>

					<GradingFormDialog
						isOpen={uiToggle.gradingFormDialog}
						process={batch.processes[11]}
						isDisabled={batch.processes[11].createdAt !== ""}
						closeForm={() => toggleForm(batch.processes[11].id)}
						handleSubmit={editedProcess => {
							batch.processes[11] = { ...editedProcess }
							batch.processes[11].createdAt = (new Date()).toISOString().substring(-1, 16)
							handleUpdateBatch()
						}}
					/>

					<PackingFormDialog
						isOpen={uiToggle.packingFormDialog}
						process={batch.processes[12]}
						isDisabled={batch.processes[12].createdAt !== ""}
						closeForm={() => toggleForm(batch.processes[12].id)}
						handleSubmit={editedProcess => {
							batch.processes[12] = { ...editedProcess }
							batch.processes[12].createdAt = (new Date()).toISOString().substring(-1, 16)
							handleUpdateBatch()
						}}
					/>

					<StoringFormDialog
						isOpen={uiToggle.storingFormDialog}
						process={batch.processes[13]}
						isDisabled={batch.processes[13].createdAt !== ""}
						closeForm={() => toggleForm(batch.processes[13].id)}
						handleSubmit={editedProcess => {
							batch.processes[13] = { ...editedProcess }
							batch.processes[13].createdAt = (new Date()).toISOString().substring(-1, 16)
							handleUpdateBatch()
						}}
					/></>
			}


		</>
	);
}

export default BatchDetail;
