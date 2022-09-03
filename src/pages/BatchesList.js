import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
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

  const [batchesFiltered, setbatchesFiltered] = useState([])
  const [month, setMonth] = useState(yearMonthText)

  const [isOpenBatchForm, setIsOpenBatchForm] = useState(false)

  useEffect(() => {
    fetchBatches();
  }, [month])


  useEffect(() => {
    const batchesFiltered = batches.filter(batch =>
      batch.Record.id.toLowerCase().includes(_query.toLowerCase())
      || (batch.Record.processes && batch.Record.processes[12].products.map(product => product.name).join(' ').toLowerCase().includes(_query.toLowerCase()))
    )
    batchesFiltered.sort((a, b) => a.Record.date < b.Record.date ? -1 : a.Record.date > b.Record.date ? 1 : 0).reverse()
    setbatchesFiltered(batchesFiltered)
  }, [_query, batches])

  const fetchBatches = () => {
    setIsLoading(true)
    return ApiHandler.readBatches([{ key: 'date', value: month }])
      .then(res => res.json())
      .then(data => {
        setbatches(data.data)
        setIsLoading(false)
      })
  }

  const ShowBatchFormButton = () => (
    <Button
      fullWidth

      color="primary"
      size="large"
      variant="outlined"

      startIcon={<AddIcon />}
      style={{ height: "100%" }}

      onClick={() => setIsOpenBatchForm(true)}
    >
      Tambah Batch
    </Button>
  )


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
          onChange={(e) => setMonth(e.target.value)}
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
        {
          isLoading
            ? (
              <Grid container justifyContent="center">
                <CircularProgress />
              </Grid>
            ) : (
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={4}>
                  <ShowBatchFormButton/>
                </Grid>

                {
                  batchesFiltered.map((batch) => (
                    <Grid item key={batch.Record.id} xs={12} sm={6} md={4}>
                      <BatchCard batch={batch.Record} />
                    </Grid>
                  ))
                }
              </Grid>
            )
        }

      </Container>

      <BatchForm
        isOpen={isOpenBatchForm}
        closeForm={() => setIsOpenBatchForm(false)}
        afterSubmit={() => fetchBatches()}
      />
    </>
  );
}

export default BatchesList;
