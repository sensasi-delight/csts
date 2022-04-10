import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
// import CircularProgress from '@material-ui/core/CircularProgress';

import HomeIcon from "@material-ui/icons/Home";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FeaturedPlayListIcon from "@material-ui/icons/FeaturedPlayList";
import PeopleIcon from "@material-ui/icons/People";
import { useEffect, useState } from "react";
import FullscreenDialog from "./FullscreenDialog";
import { AddCircle } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";

import ProductTable from "./product/ListTable";
import ProductForm from "./product/Form";

import SlaughtererTable from "./slaughterer/ListTable";
import SlaughtererForm from "./slaughterer/Form";

import ApiHandler from "../classes/ApiHandler";


const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	// menuButton: {
	// },
	barTitle: {
		marginLeft: theme.spacing(2),
		flexGrow: 1,
	},

	grow: {
		flexGrow: 1,
	},

	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	}
}));

const emptySlaughterer = {
	id: "",
	name: "",
	imgPath: "",
	certificateNo: "",
	certificateImgPath: ""
}

const emptyProduct = {
	id: "",
	name: "",
	imgPath: "",
	ingredients: [],
	halalCertificateId: ""
}

export default function MainAppBar() {
	const classes = useStyles()

	const [uiToggle, setUiToggle] = useState({
		rightDrawer: false,
		productTable: false,
		productForm: false,

		slaughtererTable: false,
		slaughtererForm: false,
	})

	const [isLoading, setIsLoading] = useState(false)


	const [productId, setProductId] = useState(undefined)
	const [product, setProduct] = useState(emptyProduct)
	const [slaughtererId, setSlaughtererId] = useState(undefined)
	const [slaughterer, setSlaughterer] = useState(emptySlaughterer)
	const [isNew, setIsNew] = useState(true)

	useEffect(() => {
		if (productId) {
			setIsLoading(true)

			setIsNew(false)
			ApiHandler.readProduct(productId)
				.then(res => res.json())
				.then(data => setProduct(data.data))
				.finally(setIsLoading(false))
		} else {
			setIsNew(true)
			setProduct({...emptyProduct})
		}
	}, [productId])


	useEffect(() => {
		if (slaughtererId) {
			setIsNew(false)
			ApiHandler.readSlaughterer(slaughtererId)
				.then(res => res.json())
				.then(data => setSlaughterer(data.data))
		} else {
			setIsNew(true)
			setSlaughterer({...emptySlaughterer})
		}
	}, [slaughtererId])




	const TitleGrid = (props) => {
		return (
			<Grid container>
				<Grid item xs={8}>
					<Typography component="h2" variant="h6" color="primary" gutterBottom>
						{props._title}
					</Typography>
				</Grid>

				<Grid container item xs={4}
					justifyContent="flex-end"
					alignItems="flex-start"
				>
					{props._icon &&
						<Tooltip title={props._tooltip}>
							<IconButton
								size="small"
								color='primary'
								onClick={props._onClick}
							>
								{props._icon}
							</IconButton>
						</Tooltip>
					}

					<Tooltip title="Tutup" style={{
						marginLeft: 8
					}}>
						<IconButton
							size="small"
							onClick={() => props.toggleClose()}
						// color='secondary'
						// onClick={props._onClick}
						>
							<CloseIcon />
						</IconButton>
					</Tooltip>

				</Grid>
			</Grid>
		)

	}

	return (
		<div className={classes.root}>
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					<IconButton edge="start" color="inherit" component={Link} to={''}>
						<HomeIcon />
					</IconButton>
					<Typography variant="h6" className={classes.barTitle}>
						{/* test */}
					</Typography>
					<IconButton
						edge="end"
						color="inherit"
						onClick={() => setUiToggle({ ...uiToggle, rightDrawer: true })}
					>
						<MoreVertIcon />
					</IconButton>
				</Toolbar>
			</AppBar>


			<Drawer anchor="right" open={uiToggle.rightDrawer}
				onClose={() => setUiToggle({ ...uiToggle, rightDrawer: false })}
			>
				<div style={{ width: 250 }} role="presentation">
					{/* <List>
						{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
							<ListItem button key={text}>
								<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
								<ListItemText primary={text} />
							</ListItem>
						))}
					</List>
					<Divider /> */}
					<List>
						<ListSubheader>Data</ListSubheader>
						<ListItem button onClick={() => setUiToggle({ ...uiToggle, productTable: true })}>
							<ListItemIcon>
								<FeaturedPlayListIcon />
							</ListItemIcon>
							<ListItemText primary="Produk" />
						</ListItem>
						<ListItem button onClick={() => setUiToggle({ ...uiToggle, slaughtererTable: true })}>
							<ListItemIcon>
								<PeopleIcon />
							</ListItemIcon>
							<ListItemText primary="Juru Sembelih" />
						</ListItem>
					</List>
				</div>
			</Drawer>

			<FullscreenDialog _isOpen={uiToggle.productTable} isLoading={isLoading}>
				<TitleGrid
					toggleClose={() => setUiToggle({ ...uiToggle, productTable: false })}
					_title='Daftar Produk'
					_icon={<AddCircle />}
					_tooltip="Tambah"
					_onClick={() => {
						setProductId(undefined)
						setProduct({...emptyProduct})
						setUiToggle({ ...uiToggle, productTable: false, productForm: true })
					}}
				/>
				<ProductTable _handleEdit={(value) => {
					setProductId(value)
					setUiToggle({ ...uiToggle, productTable: false, productForm: true })
				}} />
			</FullscreenDialog>


			<FullscreenDialog
				isLoading={isLoading}
				_isForm
				_isOpen={uiToggle.productForm}
				_handleCloseForm={() => setUiToggle({ ...uiToggle, productTable: true, productForm: false })}
				_handleSubmit={(e) => {
					setIsLoading(true)

					if (isNew) {
						ApiHandler.createProduct(product)
							.then(res => res.json())
							.then(data => {
								setUiToggle({ ...uiToggle, productTable: true, productForm: false })
								setIsLoading(false)
							})
					} else {
						ApiHandler.updateProduct(product)
							.then(res => res.json())
							.then(data => {
								setUiToggle({ ...uiToggle, productTable: true, productForm: false })
								setIsLoading(false)
							})
					}
				}}
				_title={isNew ? "Tambah Produk" : "Ubah " + product.name}
			>
				<ProductForm isNew={isNew} product={product} setProduct={setProduct}/>
			</FullscreenDialog>


			{/* SLAUGHTERER BLOCK */}
			<FullscreenDialog _isOpen={uiToggle.slaughtererTable}>
				<TitleGrid
					toggleClose={() => setUiToggle({ ...uiToggle, slaughtererTable: false })}
					_title='Daftar Penyembelih'
					_icon={<AddCircle />}
					_tooltip="Tambah"
					_onClick={() => {
						setSlaughtererId(undefined)
						setSlaughterer({...emptySlaughterer})
						setUiToggle({ ...uiToggle, slaughtererTable: false, slaughtererForm: true })
					}}
				/>
				<SlaughtererTable _handleEdit={(value) => {
					setUiToggle({ ...uiToggle, slaughtererTable: false, slaughtererForm: true })
					setSlaughtererId(value)
				}} />
			</FullscreenDialog>


			<FullscreenDialog
				isLoading={isLoading}
				_isForm
				_isOpen={uiToggle.slaughtererForm}
				_handleCloseForm={() => setUiToggle({ ...uiToggle, slaughtererTable: true, slaughtererForm: false })}
				_handleSubmit={(e) => {
					setIsLoading(true)

					if (isNew) {
						ApiHandler.createSlaughterer(slaughterer)
							.then(res => res.json())
							.then(data => {
								setUiToggle({ ...uiToggle, slaughtererTable: true, slaughtererForm: false })
								setIsLoading(false)

							})
					} else {
						ApiHandler.updateSlaughterer(slaughterer)
							.then(res => res.json())
							.then(data => {
								setUiToggle({ ...uiToggle, slaughtererTable: true, slaughtererForm: false })
								setIsLoading(false)

							})
					}
				}}
				_title={isNew ? "Tambah Penyembelih" : "Ubah " + slaughterer.name}
			>
				<SlaughtererForm isNew={isNew} slaughterer={slaughterer} setSlaughterer={setSlaughterer} />
			</FullscreenDialog>
		</div>
	);
}
