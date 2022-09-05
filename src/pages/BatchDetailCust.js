import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';

import ApiHandler from '../classes/ApiHandler';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

import CircularProgress from '@material-ui/core/CircularProgress';
import Container from "@material-ui/core/Container";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import SingleLineImageList from '../components/SingleLineImageList';
import SlaughtererForm from "../components/slaughterer/Form";
import QRCode from 'react-qr-code';
import Batch from '../classes/Batch';
import ProductForm from '../components/product/Form';
import ProductChip from '../components/ProductChip';
import SlaughtererChip from '../components/SlaughtererChip';

import WarningIcon from '@material-ui/icons/Warning';


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '2em',
    marginBottom: '2em'
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

  const pathnames = window.location.pathname.split('/')

  const [batchId, date] = pathnames.slice(-2);


  const [batch, setBatch] = useState(undefined)

  const [slaughtererDetail, setSlaughtererDetail] = useState({})
  const [isSlaughtererDetailOpen, setIsSlaughtererDetailOpen] = useState(false)

  const [productDetail, setProductDetail] = useState({});
  const [isShowProductDetail, setIsShowProductDetail] = useState(false);

  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState({})



  useEffect(() => {
    setIsLoading(true)
    ApiHandler.readBatch(batchId, [{ key: 'date', value: date }])
      .then(response => response.json())
      .then(response => {
        setResponse(response)
        setBatch({ ...(new Batch(response.data)) })
        setIsLoading(false)
      })
  }, [batchId, date])

  return (
    <>
      {
        isLoading
          ? <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>

          : !response.success
            ? <Container maxWidth="xs">
              <div>
                <WarningIcon color='error' style={{ fontSize: '5em' }} />
              </div>
              <Typography variant='h6'>
                {response.message}
              </Typography>
            </Container>

            : <>
              <Container className={classes.cardGrid} maxWidth="md" >
                <QRCode bgColor="#f0f8ff" style={{ paddingBottom: "2em" }} value={window.location.href} />
                <Typography variant="h4" component="h1" gutterBottom>Ringkasan</Typography>
                <Table size='small'>
                  <TableBody>
                    <TableRow>
                      <TableCell>Kode Batch</TableCell>
                      <TableCell>:</TableCell>
                      <TableCell>{batch?.id}</TableCell>

                    </TableRow>
                    <TableRow>
                      <TableCell>TGL. Produksi</TableCell>
                      <TableCell>:</TableCell>
                      <TableCell>{batch?.date}</TableCell>
                    </TableRow>

                    {
                      batch?.ingredients?.length > 0 &&
                      <TableRow>
                        <TableCell>Bahan</TableCell>
                        <TableCell>:</TableCell>
                        <TableCell>{batch?.ingredients?.join(', ') }</TableCell>
                      </TableRow>
                    }

                    <TableRow>
                      <TableCell>Total Ayam Reject</TableCell>
                      <TableCell>:</TableCell>
                      <TableCell>{batch?.processes.reduce((a, b) => a + (parseInt(b.nFail) || 0), 0)} Ekor</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Produk (jumlah kemasan)</TableCell>
                      <TableCell>:</TableCell>
                      <TableCell>{
                        batch?.getProducts()?.map(product => <ProductChip
                          key={product.id}
                          product={product}
                          label={product.name + " (" + product.nPack + ")"}
                          onClick={() => {
                            setProductDetail({ ...product })
                            return setIsShowProductDetail(true)
                          }} />
                        )
                      }</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Container >

              <Container className={classes.cardGrid} maxWidth="sm">
                <Typography variant="h4" component="h2">Rangkaian Proses</Typography>

                <Timeline>
                  {batch?.processes.map((processObj, i) => (

                    <TimelineItem key={processObj.id}>
                      <TimelineOppositeContent style={{ flex: 0.1, padding: 0 }} />
                      <TimelineSeparator>
                        <TimelineDot />
                        {i !== batch?.processes.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography gutterBottom >
                          {processObj.createdAt ? processObj.datetime.replace('T', ' ') : "..."}
                        </Typography>
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
                            processObj.imgPaths?.length > 0 &&
                            <SingleLineImageList isDisabled processObj={processObj} />
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
                                  processObj.note &&
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
                                  processObj.note &&
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
                                    {processObj.slaughterers.map(slaughterer =>
                                      <SlaughtererChip
                                        key={slaughterer.id}
                                        isDisabled={false}
                                        slaughterer={slaughterer}
                                        onClick={() => {
                                          setSlaughtererDetail({ ...slaughterer })
                                          setIsSlaughtererDetailOpen(true)
                                        }}
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
                                  processObj.note &&
                                  <TableRow>
                                    <TableCell>catatan</TableCell>
                                    <TableCell>:</TableCell>
                                    <TableCell>{processObj.note}</TableCell>
                                  </TableRow>
                                }
                              </TableBody>
                            </Table>
                          }

                          {
                            processObj.id === 6 &&
                            <Table size='small'>
                              <TableBody>
                                <TableRow>
                                  <TableCell>Durasi</TableCell>
                                  <TableCell>:</TableCell>
                                  <TableCell>{processObj.minuteDuration} Menit</TableCell>
                                </TableRow>
                                {
                                  processObj.note &&
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


                <SlaughtererForm
                  isDisabled
                  
                  isOpen={isSlaughtererDetailOpen}
                  slaughterer={slaughtererDetail}

                  closeForm={() => setIsSlaughtererDetailOpen(false)}
                  title={'Data Juru Sembelih: ' + slaughtererDetail.name}
                />

                <ProductForm
                  isDisabled

                  isOpen={isShowProductDetail}
                  product={productDetail}

                  closeForm={() => setIsShowProductDetail(false)}
                  title={'Rincian Produk: ' + productDetail.name}
                />
              </Container>
            </>
      }
    </>
  )
}