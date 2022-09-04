import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import CircularProgress from "@material-ui/core/CircularProgress";

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
import Batch from "../classes/Batch";

import moment from "moment";
import ProductChip from "../components/ProductChip";
import ProductForm from "../components/product/Form";

const API_SERVER = process.env.REACT_APP_API_SERVER

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
  cardRoot: {
    maxWidth: 345,
  },
  cardMedia: {
    height: 140,
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
        uiToggle.defeatheringFormDialog = !uiToggle.defeatheringFormDialog

        break;

      case 9:
        uiToggle.headCuttingFormDialog = !uiToggle.headCuttingFormDialog

        break;

      case 10:
        uiToggle.eviscerationFormDialog = !uiToggle.eviscerationFormDialog

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

  const [batch, setBatch] = useState(undefined);

  const [productDetail, setProductDetail] = useState({});
  const [isShowProductDetail, setIsShowProductDetail] = useState(false);

  useEffect(() => {
    ApiHandler.readBatch(batchId, [{ key: 'date', value: date }])
      .then(response => response.json())
      .then(response => {
        const batchFetched = response.data
        return setBatch(new Batch(batchFetched));
      })
  }, [batchId, date])


  const handleUpdateBatch = async editedProcess => {

    if (batch.getProcess(editedProcess.id)) {
      batch.setProcess(editedProcess)
    } else {
      editedProcess.createdAt = moment().format()
      batch.processes.push(editedProcess)
    }

    return ApiHandler.updateBatch(batch, date)
      .then(res => res.json())
  }

  const handleCardClick = (processId) => {
    toggleForm(processId)
  }

  const ProcessCard = ({ process, i }) => {
    const isHalalCriticalPoint = [1, 4, 5, 6].includes(process.id)
    const isProcessHasFinished = process.createdAt
    const isProcessHasImage = process.imgPaths.length > 0

    return (
      <Grid item key={process.id} xs={12} sm={6} md={4}>
        <Card
          className={classes.cardRoot} elevation={4}>
          <CardActionArea onClick={() => handleCardClick(process.id)}>
            {
              isProcessHasFinished && isProcessHasImage &&
              <CardMedia
                className={classes.cardMedia}
                image={"http://" + API_SERVER + "/" + process.imgPaths[0]}
                title={process.name}
              />
            }

            <CardHeader
              title={(i + 1) + (isHalalCriticalPoint ? ' ⭐' : null)}
              subheader={isHalalCriticalPoint ? 'titik kritis halal' : null}
            />

            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                {process.name}
              </Typography>

              {
                process.createdAt
                  ? <div style={{ color: "#4caf50" }}>
                    <Typography variant="caption">
                      telah diproses:
                    </Typography>
                    <Typography style={{ fontWeight: "bold" }}>
                      {process.datetime.replace('T', '\n')}
                    </Typography>
                  </div>
                  : <Typography style={{ color: '#ff9100', fontWeight: "bold" }}>
                    *silahkan masukkan data
                  </Typography>
              }

            </CardContent>
          </CardActionArea>

          <CardActions>
            <Button
              color="primary"
              onClick={() => handleCardClick(process.id)}
            >

              {process.createdAt ? "Lihat data" : "Masukkan data"}
            </Button>
          </CardActions>
        </Card>

      </Grid>
    )
  }


  return (

    batch && batch.processes ?
      <>
        <Container className={classes.cardGrid} maxWidth="md">

          <Grid container spacing={4}>

            <Grid item xs={12} sm={4} style={{ textAlign: "center" }}>
              <QRCode bgColor="#f0f8ff" value={qrValue} />
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
                    <TableCell>Bahan</TableCell>
                    <TableCell>:</TableCell>
                    <TableCell>{batch.ingredients?.join(', ')}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Total Ayam (sisa / diterima)</TableCell>
                    <TableCell>:</TableCell>
                    <TableCell>{batch.getChickenQty()} / {batch.getNReceived()} Ekor</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Total Reject</TableCell>
                    <TableCell>:</TableCell>
                    <TableCell>{batch.getNfail()} Ekor</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Produk</TableCell>
                    <TableCell>:</TableCell>
                    <TableCell>{
                      batch.getProducts()?.map(product => <ProductChip
                        key={product.id}
                        product={product}
                        label={product.name + " (" + batch.getProductQty(product.id) + "/" + product.nPack + ")"}
                        onClick={() => {
                          setProductDetail({ ...product })
                          return setIsShowProductDetail(true)
                        }} />
                      )
                    }</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          </Grid>

        </Container>

        <Container maxWidth="md" style={{ paddingBottom: "8em" }}>
          <Grid container spacing={4}>
            {
              batch.processes.map((process, i) => <ProcessCard key={process.id} process={process} i={i} />)
            }

            {
              batch.getUpcomingProcess() && <ProcessCard process={batch.getUpcomingProcess()} i={batch.processes.length} />
            }
          </Grid>
        </Container>

        <ReceiveFormDialog
          batchDate={batch.date}
          isDisabled={Boolean(batch.getProcess(1))}
          isOpen={uiToggle.receiveFormDialog}
          process={batch.getReceiveProcess() || batch.getProcessTemplate(1)}

          closeForm={() => toggleForm(1)}
          handleSubmit={handleUpdateBatch}
        />

        {
          batch.getPrevProcess(2) &&
          <AntemortemFormDialog
            isDisabled={Boolean(batch.getProcess(2))}
            isOpen={uiToggle.antemortemFormDialog}
            prevProcess={batch.getPrevProcess(2)}
            process={batch.getProcess(2) || batch.getProcessTemplate(2)}

            closeForm={() => toggleForm(2)}
            handleSubmit={handleUpdateBatch}
            nFailMax={batch.getChickenQty()}
          />
        }

        {
          batch.getPrevProcess(3) &&
          <HangingFormDialog
            isDisabled={Boolean(batch.getProcess(3))}
            isOpen={uiToggle.hangingFormDialog}
            prevProcess={batch.getPrevProcess(3)}
            process={batch.getProcess(3) || batch.getProcessTemplate(3)}

            closeForm={() => toggleForm(3)}

            handleSubmit={handleUpdateBatch}
            nFailMax={batch.getChickenQty()}
          />
        }

        {
          batch.getPrevProcess(4) &&
          <StunningFormDialog
            isDisabled={Boolean(batch.getProcess(4))}


            isOpen={uiToggle.stunningFormDialog}
            prevProcess={batch.getPrevProcess(4)}
            process={batch.getProcess(4) || batch.getProcessTemplate(4)}

            closeForm={() => toggleForm(4)}

            handleSubmit={handleUpdateBatch}
            nFailMax={batch.getChickenQty()}
          />
        }

        {
          batch.getPrevProcess(5) &&
          <SlaughteringFormDialog
            isDisabled={Boolean(batch.getProcess(5))}


            isOpen={uiToggle.slaughteringFormDialog}
            prevProcess={batch.getPrevProcess(5)}
            process={batch.getProcess(5) || batch.getProcessTemplate(5)}

            closeForm={() => toggleForm(5)}

            handleSubmit={handleUpdateBatch}
            nFailMax={batch.getChickenQty()}
          />
        }

        {
          batch.getPrevProcess(6) &&
          <BleedingFormDialog
            isDisabled={Boolean(batch.getProcess(6))}

            isOpen={uiToggle.bleedingFormDialog}
            prevProcess={batch.getPrevProcess(6)}
            process={batch.getProcess(6) || batch.getProcessTemplate(6)}

            closeForm={() => toggleForm(6)}

            handleSubmit={handleUpdateBatch}
            nFailMax={batch.getChickenQty()}
          />
        }

        {
          batch.getPrevProcess(7) &&
          <ScaldingFormDialog
            isDisabled={Boolean(batch.getProcess(7))}

            isOpen={uiToggle.scaldingFormDialog}
            prevProcess={batch.getPrevProcess(7)}
            process={batch.getProcess(7) || batch.getProcessTemplate(7)}

            closeForm={() => toggleForm(7)}
            handleSubmit={handleUpdateBatch}
            nFailMax={batch.getChickenQty()}
          />
        }

        {
          batch.getPrevProcess(8) &&
          <DefeatheringFormDialog
            isDisabled={Boolean(batch.getProcess(8))}

            isOpen={uiToggle.defeatheringFormDialog}
            prevProcess={batch.getPrevProcess(8)}
            process={batch.getProcess(8) || batch.getProcessTemplate(8)}

            closeForm={() => toggleForm(8)}
            handleSubmit={handleUpdateBatch}
            nFailMax={batch.getChickenQty()}
          />
        }

        {
          batch.getPrevProcess(9) &&
          <HeadCuttingFormDialog
            isDisabled={Boolean(batch.getProcess(9))}

            isOpen={uiToggle.headCuttingFormDialog}
            prevProcess={batch.getPrevProcess(9)}
            process={batch.getProcess(9) || batch.getProcessTemplate(9)}

            closeForm={() => toggleForm(9)}
            handleSubmit={handleUpdateBatch}
            nFailMax={batch.getChickenQty()}
          />
        }

        {
          batch.getPrevProcess(10) &&
          <EviscerationFormDialog
            isDisabled={Boolean(batch.getProcess(10))}

            isOpen={uiToggle.eviscerationFormDialog}
            prevProcess={batch.getPrevProcess(10)}
            process={batch.getProcess(10) || batch.getProcessTemplate(10)}

            closeForm={() => toggleForm(10)}
            handleSubmit={handleUpdateBatch}
            nFailMax={batch.getChickenQty()}
          />
        }

        {
          batch.getPrevProcess(11) &&
          <ChillingFormDialog
            isDisabled={Boolean(batch.getProcess(11))}

            isOpen={uiToggle.chillingFormDialog}
            prevProcess={batch.getPrevProcess(11)}
            process={batch.getProcess(11) || batch.getProcessTemplate(11)}

            closeForm={() => toggleForm(11)}
            handleSubmit={handleUpdateBatch}
            nFailMax={batch.getChickenQty()}
          />
        }

        {
          batch.getPrevProcess(12) &&
          <GradingFormDialog
            isDisabled={Boolean(batch.getProcess(12))}

            isOpen={uiToggle.gradingFormDialog}
            prevProcess={batch.getPrevProcess(12)}
            process={batch.getProcess(12) || batch.getProcessTemplate(12)}

            closeForm={() => toggleForm(12)}
            handleSubmit={handleUpdateBatch}
            nFailMax={batch.getChickenQty()}
          />
        }

        {
          batch.getPrevProcess(13) &&
          <PackingFormDialog
            isDisabled={Boolean(batch.getProcess(13))}

            isOpen={uiToggle.packingFormDialog}
            prevProcess={batch.getPrevProcess(13)}
            process={batch.getProcess(13) || batch.getProcessTemplate(13)}

            closeForm={() => toggleForm(13)}
            handleSubmit={handleUpdateBatch}
            nFailMax={batch.getChickenQty()}
          />
        }

        {
          batch.getPrevProcess(14) &&
          <StoringFormDialog

            isDisabled={Boolean(batch.getProcess(14))}

            isOpen={uiToggle.storingFormDialog}
            prevProcess={batch.getPrevProcess(14)}
            process={batch.getProcess(14) || batch.getProcessTemplate(14)}

            closeForm={() => toggleForm(14)}
            handleSubmit={handleUpdateBatch}
          />
        }
        

        <ProductForm
          isOpen={isShowProductDetail}
          isDisabled={true}
          closeForm={() => setIsShowProductDetail(false)}
          product={productDetail}
          title={'Rincian Produk: ' + productDetail.name}
        />
      </>
      :
      <Grid container justifyContent="center" className={classes.cardGrid}>
        <CircularProgress />
      </Grid>
  );
}

export default BatchDetail;
