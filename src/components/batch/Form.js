import { useState } from "react";
import { getInputProps } from "../process/ProcessFormHelper";

import Batch from "../../classes/Batch";
import TagsField from "../TagsField";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import moment from "moment";
import TextField from "@material-ui/core/TextField";

import CloseIcon from '@material-ui/icons/Close';


export function Form({ isOpen, closeForm, afterSubmit, isDisabled }) {

  const dateTemp = moment().format('YYYY-MM-DD')

  const [batch, setBatch] = useState(new Batch())

  const [isLoading, setIsLoading] = useState(false)
  const [batchIdValidation, setBatchIdValidation] = useState({
    isError: false,
    message: null
  })


  const validateBatchId = () => new Promise(async resolve => {
    const isBatchIdEmpty = !batch.id?.trim()

    if (isBatchIdEmpty) {

      batchIdValidation.isError = true
      batchIdValidation.message = 'Mohon mengisi isian ini.'

      setBatchIdValidation(batchIdValidation)

      resolve(batchIdValidation)

      return 0;
    }


    const batchFetched = await Batch.find(batch.id?.trim(), batch.date?.trim())

    if (batchFetched.id) {
      batchIdValidation.isError = true
      batchIdValidation.message = 'Kode batch sudah digunakan, silahkan masukkan kode batch baru.'

      setBatchIdValidation(batchIdValidation)
    }

    resolve(batchIdValidation)
  })

  const asyncIsInputsValid = async () => {
    const batchIdValidation = await validateBatchId();
    return !batchIdValidation.isError;
  }

  const isInputsValid = () => {
    return !batchIdValidation.isError;
  }

  async function handleFormSubmit(e) {
    e.preventDefault()

    setIsLoading(true);

    if (!batch.date) {
      batch.date = dateTemp
      setBatch(new Batch(batch))
    }

    if (await asyncIsInputsValid()) {
      await batch.save()
      closeForm()
      afterSubmit()
      setBatch(new Batch())
    }

    setIsLoading(false);
  }

  const handleTextfieldChange = (e, attr) => {
    setIsLoading(true)

    switch (attr) {
      case 'date':
        batch.date = (e.target.value || dateTemp)
        break;

      case 'id':
        batch.id = e.target.value || null

        setBatchIdValidation({
          isError: false,
          message: null
        })
        break;



      case 'ingredients':
        batch.ingredients = e.target.value.split(',')
        break;

      default:
        break;
    }

    setIsLoading(false)

    setBatch(new Batch(batch))
  }


  return (
    <Dialog maxWidth="xs" open={isOpen} onClose={isLoading ? () => { } : closeForm}>

      {
        !isLoading &&
        <IconButton
          aria-label="close"
          onClick={closeForm}
          children={<CloseIcon />}
          style={{
            position: 'absolute',
            right: '.3em',
            top: '.3em',
          }}
        />
      }

      <DialogTitle>Buat Batch Baru</DialogTitle>

      <DialogContent>
        {
          isLoading ?
            <Grid container justifyContent="center">
              <CircularProgress />
            </Grid>
            :
            <form id="batchForm" noValidate autoComplete="off" onSubmit={handleFormSubmit}>

              <TextField
                fullWidth
                required

                margin='dense'
                label='Kode Batch'

                value={batch.id || ''}

                error={batchIdValidation.isError}

                helperText={batchIdValidation.message}
                InputProps={getInputProps(!batch.isNew() || isDisabled)}

                onChange={(e) => handleTextfieldChange(e, 'id')}
              />

              <TextField
                fullWidth
                required

                margin="dense"
                label="TGL. Produksi"
                type="date"

                value={batch.date || dateTemp}

                InputProps={getInputProps(isDisabled)}

                onChange={(e) => handleTextfieldChange(e, 'date')}
              />

              <TagsField
                fullWidth

                helperText="pisahkan dengan koma (,)"
                margin="dense"
                label="Bahan"

                values={batch.ingredients || []}
                InputProps={getInputProps(isDisabled)}
                setValues={ingredients => {
                  batch.ingredients = ingredients
                  setBatch({ ...batch })
                }}
              />
            </form>
        }
      </DialogContent>
      <DialogActions>
        {
          !isLoading &&
          <>
            <Button type="button" color="inherit" onClick={() => closeForm()}>
              {isDisabled ? 'Tutup' : 'Batal'}
            </Button>

            {
              !isDisabled &&
              <Button
                type="submit"
                disabled={!isInputsValid()}
                form="batchForm"
                color="primary"
              >
                Simpan
              </Button>
            }
          </>
        }
      </DialogActions>
    </Dialog>
  )
}