import { useEffect, useState } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';

import EditIcon from '@material-ui/icons/Edit';

import ApiHandler from "../../classes/ApiHandler";
import { Grid } from '@material-ui/core';



export default function SlaughtererTable(props) {
	const [response, setResponse] = useState({
		success: false,
		data: [],
		message: "belum dilakukan fetch"
	})


	useEffect(() => {
		ApiHandler.readSlaughterers()
			.then(res => res.json())
			.then(data => setResponse(data))
	}, [])


	return (
		<>
			{
				response.message === "belum dilakukan fetch" ?
					<Grid container justifyContent="center">
						<CircularProgress />
					</Grid>
					:
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								<TableCell>Kode</TableCell>
								<TableCell>Nama</TableCell>
								<TableCell>NO. Sertifikat Penyembelih Halal</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{response.data.length === 0 &&
								<TableRow>
									<TableCell colSpan="5">{response.success ? "belum ada data tersimpan" : response.message}</TableCell>
								</TableRow>
							}

							{response.data.map((row) => (
								<TableRow key={row.Record.id}>
									<TableCell>
										<img width="100px" src={"http://" + process.env.REACT_APP_API_SERVER + "/" + row.Record.imgPath} alt={"Foto " + row.Record.name} />
									</TableCell>
									<TableCell>{row.Record.id}</TableCell>
									<TableCell>{row.Record.name}</TableCell>
									<TableCell>{row.Record.certificateNo}</TableCell>
									<TableCell>
										<Tooltip title="Ubah">
											<IconButton size="small" onClick={() => props._handleEdit(row.Record.id)} color="primary">
												<EditIcon />
											</IconButton>

										</Tooltip>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
			}

		</>
	);
}