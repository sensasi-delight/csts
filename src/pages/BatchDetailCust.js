import { useEffect, useState } from 'react';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from "@material-ui/core/Container";
import { Dialog, DialogContent, DialogTitle, Toolbar } from '@material-ui/core';

import SubjectIcon from '@material-ui/icons/Subject'

import ApiHandler from '../classes/ApiHandler';
import SingleLineImageList from '../components/SingleLineImageList';
import SlaughtererForm from "../components/slaughterer/Form";
import QRCode from 'react-qr-code';



const useStyles = makeStyles((theme) => ({
	paper: {
		padding: '2em',
	},
	cardGrid: {
		marginTop: '3em'
	},
	secondaryTail: {
		backgroundColor: theme.palette.secondary.main,
	},
}));

export default function BatchesDetailCust() {
	const classes = useStyles();

	const batchId = window.location.pathname.split('/')[3]
	const date = window.location.pathname.split('/')[4]

	const [batch, setBatch] = useState(undefined)
	const [slaughtererDetail, setSlaughtererDetail] = useState({})
	const [isSlaughtererDetailOpen, setIsSlaughtererDetailOpen] = useState(false)



	useEffect(() => {
		ApiHandler.readBatch(batchId, [{ key: 'date', value: date }])
			.then(res => res.json())
			.then(data => setBatch({ ...data.data }))
	}, [batchId, date])

	return (
		<>
			{batch && batch.processes ?
				<Container className={classes.cardGrid} maxWidth="md">
					<QRCode style={{paddingBottom: "2em"}} value={window.location.href} />
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
								<TableCell>Total Ayam Reject</TableCell>
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

				</Container> : <CircularProgress />}

			{batch && batch.processes &&

				<Container className={classes.cardGrid} maxWidth="md" style={{ paddingBottom: "2em" }}>
					<Typography variant="h4" component="h2">Rangkaian Proses</Typography>

					<Timeline align="alternate">
						{batch.processes.map((processObj, i) => (

							<TimelineItem key={processObj.id}>
								<TimelineOppositeContent>
									<Typography variant="body2" color="textSecondary">
										{processObj.createdAt ? processObj.datetime.replace('T', ' ') : "..."}
									</Typography>
								</TimelineOppositeContent>
								<TimelineSeparator>
									<TimelineDot />
									{i !== batch.processes.length - 1 && <TimelineConnector />}
								</TimelineSeparator>
								<TimelineContent>
									<Paper elevation={3} className={classes.paper}>

										<Typography variant="h6" component="h1">
											{processObj.name}
										</Typography>
										{[1, 4, 5, 6].includes(processObj.id) &&
											<Typography variant="subtitle1" style={{ color: "#ffdF00" }} gutterBottom>
												*titik kritis halal
											</Typography>
										}

										{
											processObj.imgPaths.length === 1 ?
												<img style={{ padding: "16px 0px" }} width="100%" src={"http://" + process.env.REACT_APP_API_SERVER + "/" + processObj.imgPaths[0]} alt={'foto proses ' + processObj.name} />
												: <SingleLineImageList isDisabled={true} itemData={processObj.imgPaths} delImg={(imgPath) => { }} />
										}

										{processObj.id === 1 &&
											<Table size='small'>
												<TableBody>
													<TableRow>
														<TableCell>Diterima dari</TableCell>
														<TableCell>:</TableCell>
														<TableCell>{processObj.from}</TableCell>
													</TableRow>

													<TableRow>
														<TableCell>Jumlah terima</TableCell>
														<TableCell>:</TableCell>
														<TableCell>{processObj.qtyEstimated} Ekor</TableCell>
													</TableRow>
													{
														processObj.note !== "" &&
														<TableRow>
															<TableCell>catatan</TableCell>
															<TableCell>:</TableCell>
															<TableCell>{processObj.note}</TableCell>
														</TableRow>
													}
												</TableBody>
											</Table>
										}

										{processObj.id === 4 &&
											<Table size='small'>
												<TableBody>
													<TableRow>
														<TableCell>Listrik</TableCell>
														<TableCell>:</TableCell>
														<TableCell>{processObj.watt} watt</TableCell>
													</TableRow>

													<TableRow>
														<TableCell>Durasi</TableCell>
														<TableCell>:</TableCell>
														<TableCell>{processObj.minuteDuration} Menit</TableCell>
													</TableRow>
													{
														processObj.note !== "" &&
														<TableRow>
															<TableCell>catatan</TableCell>
															<TableCell>:</TableCell>
															<TableCell>{processObj.note}</TableCell>
														</TableRow>
													}
												</TableBody>
											</Table>
										}

										{processObj.id === 5 &&
											<Table size='small'>
												<TableBody>
													<TableRow>
														<TableCell>Penyembelih</TableCell>
														<TableCell>:</TableCell>
														<TableCell>
															{processObj.slaughterers.map((slaughterer) =>
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
															)}
														</TableCell>
													</TableRow>

													<TableRow>
														<TableCell>Pisau</TableCell>
														<TableCell>:</TableCell>
														<TableCell>{processObj.knifeInfo}</TableCell>
													</TableRow>
													{
														processObj.note !== "" &&
														<TableRow>
															<TableCell>catatan</TableCell>
															<TableCell>:</TableCell>
															<TableCell>{processObj.note}</TableCell>
														</TableRow>
													}
												</TableBody>
											</Table>
										}

										{processObj.id === 6 &&
											<Table size='small'>
												<TableBody>
													<TableRow>
														<TableCell>Durasi</TableCell>
														<TableCell>:</TableCell>
														<TableCell>{processObj.minuteDuration} Menit</TableCell>
													</TableRow>
													{
														processObj.note !== "" &&
														<TableRow>
															<TableCell>catatan</TableCell>
															<TableCell>:</TableCell>
															<TableCell>{processObj.note}</TableCell>
														</TableRow>
													}
												</TableBody>
											</Table>
										}
									</Paper>
								</TimelineContent>
							</TimelineItem>
						))}
					</Timeline>

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
				</Container>}
		</>

	);
}