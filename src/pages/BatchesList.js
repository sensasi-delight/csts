import { useEffect, useState } from "react";

import { CircularProgress, makeStyles, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";

import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";

import BatchCard from "../components/BatchCard";
import ApiHandler from "../classes/ApiHandler";


import { Form as BatchForm } from "../components/batch/Form";

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

const nowDate = new Date()
const currentMonth = nowDate.getMonth() + 1

const yearMonthText = nowDate.getFullYear() + '-' + (currentMonth < 10 ? '0' : '') + currentMonth


function BatchesList() {
	const classes = useStyles();


	const [isLoading, setIsLoading] = useState(true)
	const [_query, _setQuery] = useState('')
	const [batches, setbatches] = useState([])
	// const [isFetch, setIsFetch] = useState(true)
	const [products, setProducts] = useState(undefined)

	const [batchesFiltered, setbatchesFiltered] = useState([])
	const [month, setMonth] = useState(yearMonthText)
	const [uiToggle, setUiToggle] = useState({
		batchForm: false
	})




	const toggleUi = (name) => {
		uiToggle[name] = !uiToggle[name]
		setUiToggle({ ...uiToggle })
	}


	useEffect(() => {
		setIsLoading(true)
		ApiHandler.readBatches([{ key: 'date', value: month }])
			.then(res => res.json())
			.then(data => {
				if (data.data) {
					setbatches(data.data)
				}
				setIsLoading(false)

				return 0
			})
		// .finally(setIsLoading(false))
	}, [month])


	useEffect(() => {
		const batchesFiltered = batches.filter(batch => batch.Record.id.toLowerCase().includes(_query.toLowerCase()) || batch.Record.productState.name.toLowerCase().includes(_query.toLowerCase()))
		batchesFiltered.sort((a, b) => a.Record.date < b.Record.date ? -1 : a.Record.date > b.Record.date ? 1 : 0).reverse()
		setbatchesFiltered(batchesFiltered)
		// setIsLoading(false)
	}, [_query, batches])


	return (
		<>
			<Container className={classes.heroContent} maxWidth="sm">
				<TextField
					autoComplete="off"
					margin="dense"
					// id="search"
					label="Bulan"
					fullWidth
					variant="outlined"
					type="month"
					value={month}
					onChange={(e) => {
						setMonth(e.target.value)
					}}
				/>
				<TextField
					autoComplete="off"
					margin="dense"
					id="search"
					label="Cari"
					fullWidth
					variant="outlined"
					value={_query}
					onChange={(e) => _setQuery(e.target.value)}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<SearchIcon />
							</InputAdornment>
						),
					}}
				/>
			</Container>
			<Container className={classes.cardGrid} maxWidth="md">
				{isLoading ?
					<Grid container justifyContent="center">
						<CircularProgress />
					</Grid>
					:

					<Grid container spacing={4}>
						<Grid item xs={12} sm={6} md={4}>
							<Button
								onClick={() => toggleUi('batchForm')}
								style={{ height: "100%" }}
								fullWidth
								variant="outlined"
								color="primary"
								size="large"
								startIcon={<AddIcon />}
							>
								Tambah Batch
							</Button>
						</Grid>

						{batchesFiltered.map((batch) => (

							<Grid item key={batch.Record.id} xs={12} sm={6} md={4}>
								<BatchCard
									title={batch.Record.id}
									desc={<>
										<Typography gutterBottom variant="h4">
											{batch.Record.productState.name}
										</Typography>

										<Typography gutterBottom variant="caption">
											TGL. Produksi:<br />{batch.Record.date}
										</Typography>
									</>
									}
									to={"/batch/" + batch.Record.id + "/" + batch.Record.date}
									imgUrl={"http://" + process.env.REACT_APP_API_SERVER + "/" + batch.Record.productState.imgPath}
								/>
							</Grid>
						))}
					</Grid>
				}

			</Container>

			<BatchForm
				isNew={true}
				isOpenForm={uiToggle.batchForm}
				products={products}
				setProducts={setProducts}
				toggleForm={() => toggleUi('batchForm')}
				_parentHandleSubmit={() => {
					setIsLoading(true)
					ApiHandler.readBatches([{ key: 'date', value: month }])
						.then(res => res.json())
						.then(data => {
							setbatches(data.data)
							setIsLoading(false)
						})
				}}
			/>
		</>
	);
}

export default BatchesList;
