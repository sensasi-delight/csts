import { useEffect, useState } from 'react';

import ApiHandler from "../../classes/ApiHandler";

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

import EditIcon from '@material-ui/icons/Edit';
import SlaughtererForm from './Form';


export default function SlaughtererTable(props) {

  const { sendHandleCreate } = props

  const [slaughterer, setSlaughterer] = useState({})

  const [isLoading, setIsLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const [slaughterers, setSlaughterers] = useState([])

  const [response, setResponse] = useState({
    success: false,
    data: [],
    message: "belum dilakukan fetch"
  })

  const handleCreate = () => {
    setSlaughterer({})
    openForm()
  }

  const openForm = () => {
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
  }

  const fetchData = async () => {
    setIsLoading(true)

    return ApiHandler.readSlaughterers()
      .then(response => response.json())
      .then(response => {
        setResponse(response)
        return setSlaughterers(response.data.map(row => row.Record))
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    sendHandleCreate(() => handleCreate)

    fetchData()
  }, [])


  return (
    <>
      {
        isLoading
        ?
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
              {
                response.data.length === 0 &&
                <TableRow>
                  <TableCell colSpan="5">{response.success ? "belum ada data tersimpan" : response.message}</TableCell>
                </TableRow>
              }

              {
                slaughterers?.map(slaughterer => (
                  <TableRow key={slaughterer.id}>
                    <TableCell>
                      {
                        slaughterer.imgPaths?.length > 0 &&
                        <img width="100px" src={"http://" + process.env.REACT_APP_API_SERVER + "/" + slaughterer.imgPaths[0]} alt={"Foto " + slaughterer.name} />
                      }
                    </TableCell>
                    <TableCell>{slaughterer.id}</TableCell>
                    <TableCell>{slaughterer.name}</TableCell>
                    <TableCell>{slaughterer.certificateNo}</TableCell>
                    <TableCell>
                      <Tooltip title="Ubah">
                        <IconButton size="small" onClick={() => {
                          setSlaughterer(slaughterer)
                          openForm()
                        }} color="primary">
                          <EditIcon />
                        </IconButton>

                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
      }

      <SlaughtererForm
        isOpen={isFormOpen}
        closeForm={closeForm}
        handleAfterSubmit={fetchData}
        slaughterer={slaughterer}
        slaughterers={slaughterers}
      />

    </>
  );
}