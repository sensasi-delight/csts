import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
import ApiHandler from "../../classes/ApiHandler";
import FullscreenDialog from "../FullscreenDialog";


const emptyBatch = {
	id: "",
	productState: {
		id: "",
		name: "string",
		imgPath: "string",
		ingredients: [
			"string"
		],
		halalCertificateId: "string"
	},
	date: "",
	// qty: 0,
	ingredients: [],
	invoices: [
		// {
		// 	id: string",
		// 	qty: 0
		// }
	]
}



export function Form(props) {

	const { isNew, isOpenForm, toggleForm, _parentHandleSubmit} = props;

	const [batch, setBatch] = useState(props.batch || emptyBatch)


	const [products, setProducts] = useState(props.products) // for select input

	if (!products) {
		setProducts([])
		ApiHandler.readProducts()
			.then(res => res.json())
			.then(data => {
				setProducts(data.data)
				props.setProducts(data.data)
			})
	}

	return (
		<FullscreenDialog
			_isForm
			_title={isNew ? "Tambah Batch" : 'Ubah Batch'}
			_isOpen={isOpenForm}
			_handleCloseForm={toggleForm}
			_handleSubmit={() => {
				toggleForm()
				if (isNew) {
					ApiHandler.createBatch(batch).then(() => _parentHandleSubmit())
				} else {
					ApiHandler.updateBatch(batch).then(() => _parentHandleSubmit())
				}
			}}
		>
			<TextField
				required
				autoComplete="off"
				margin="dense"
				label="Kode Batch"
				value={batch.id}
				disabled={!isNew}
				fullWidth
				onChange={(e) => {
					batch.id = e.target.value
					setBatch({ ...batch })
				}}
			/>

			<TextField
				required
				autoComplete="off"
				margin="dense"
				label="TGL Produksi"
				type="date"
				value={batch.date}
				fullWidth
				InputLabelProps={{
					shrink: true,
				}}
				onChange={(e) => {
					batch.date = e.target.value
					setBatch({ ...batch })
				}}
			/>


			<FormControl style={{ width: '100%' }} >
				<InputLabel id="demo-simple-select-label">Produk</InputLabel>
				{products ?
					<Select
						fullWidth
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={batch.productState.id}
						onChange={(e) => {
							batch.productState = products.find(product => product.Record.id === e.target.value).Record
							setBatch({ ...batch })
						}}
					>
						<MenuItem disabled value=''></MenuItem>
						{products.map((product, i) => <MenuItem key={product.Record.id} value={product.Record.id}>{product.Record.id} - {product.Record.name}</MenuItem>)}
					</Select> : <Typography>Sedang memuat...</Typography>
				}
			</FormControl>


			<TextField
				required
				autoComplete="off"
				margin="dense"
				label="Kode Batch Bahan"
				value={batch.ingredients.join(',')}
				fullWidth
				onChange={(e) => {
					batch.ingredients = e.target.value.split(',')
					setBatch({ ...batch })
				}}
				helperText="pisahkan dengan koma (,)"
			/>

		</FullscreenDialog>
	)

}