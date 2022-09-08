import { useEffect, useState } from 'react';

import ApiHandler from '../../classes/ApiHandler';

import ProductForm from "./Form";

import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';


export default function ProductTable(props) {

  const { sendHandleCreate } = props

  const [product, setProduct] = useState({})

  const [isLoading, setIsLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const [products, setProducts] = useState([])

  const [response, setResponse] = useState({})

  const handleCreate = () => {
    setProduct({})
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

    return ApiHandler.readProducts()
      .then(response => response.json())
      .then(response => {
        setResponse(response)
        setProducts(response.data.map(row => row.Record))
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
          ? <Grid
            container
            justifyContent="center"
          >
            <CircularProgress />
          </Grid>
          : <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Kode</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Bahan</TableCell>
                <TableCell>NO. Sertifikat Halal</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                response.ok && products.length === 0 &&
                <TableRow>
                  <TableCell colSpan="5">{response.success ? "belum ada data tersimpan" : response.message}</TableCell>
                </TableRow>
              }

              {
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {
                        product.imgPaths?.length > 0 &&
                        <img width="100px" src={process.env.REACT_APP_API_SERVER + "/" + product.imgPaths[0]} alt={"Foto " + product.name} />
                      }
                    </TableCell>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.ingredients.join(', ')}</TableCell>
                    <TableCell>{product.halalCertificateNo}</TableCell>
                    <TableCell>
                      <Tooltip title="Ubah">
                        <IconButton size="small" onClick={() => {
                          setProduct(product)
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

      <ProductForm
        isOpen={isFormOpen}
        closeForm={closeForm}
        handleAfterSubmit={fetchData}
        product={product}
        products={products}
      />

    </>
  );
}