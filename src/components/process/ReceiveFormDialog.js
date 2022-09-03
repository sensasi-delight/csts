import { useState } from "react";
import { getDefaultHelperText, getInputProps, getDatetimeHelperText, getNFailHelperText, getDefaultHelperTextNumberField } from "./ProcessFormHelper";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from '@material-ui/icons/Close';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import moment from "moment";
import SingleLineImageList from "../SingleLineImageList";
import TextField from "@material-ui/core/TextField";
import UploadButton from "../UploadButton";


export default function ReceiveFormDialog(props) {

  const { isOpen, closeForm, handleSubmit, isDisabled, batchDate } = props;

  const [processObj, setProcess] = useState(props.process)
  const datetimeTemp = moment().format('YYYY-MM-DDTHH:mm')
  const [isLoading, setIsLoading] = useState(false)

  const [isDatetimeError, setIsDatetimeError] = useState(false);
  const [isNFailError, setIsNFailError] = useState(false);
  const [isFromError, setIsFromError] = useState(false);
  const [isQtyEstimatedError, setIsQtyEstimatedError] = useState(false);

  const validateInput = () => {

    const isDatetimeBeforeThanBatch = moment(processObj.datetime).isBefore(batchDate)
    const isDatetimeEmpty = !processObj.datetime
    setIsDatetimeError(isDatetimeEmpty || isDatetimeBeforeThanBatch)

    const isFromEmpty = !processObj.from
    setIsFromError(isFromEmpty);

    const isQtyEstimatedNanOrLessThanZero = isNaN(parseInt(processObj.qtyEstimated)) || processObj.qtyEstimated < 0
    setIsQtyEstimatedError(isQtyEstimatedNanOrLessThanZero);

    const isNFailNan = isNaN(parseInt(processObj.nFail))
    const isNFailOutRange = 0 > processObj.nFail || processObj.nFail > processObj.qtyEstimated
    setIsNFailError(isNFailNan || isNFailOutRange)
  }

  const isInputValid = () => {
    return (!isDatetimeError) && (!isNFailError) && (!isFromError) && (!isQtyEstimatedError)
  }

  const setIsErrorFalse = attr => {
    switch (attr) {
      case 'datetime':
        setIsDatetimeError(false)
        break;

      case 'nFail':
        setIsNFailError(false)
        break;

      case 'qtyEstimated':
        setIsQtyEstimatedError(false)
        break;

      case 'from':
        setIsFromError(false)
        break;

      default:
        break;
    }
  }

  const handleTextfieldChange = (e, attr) => {
    setIsErrorFalse(attr)
    processObj[attr] = e.target.value ? e.target.value : null

    setProcess({ ...processObj })
  }

  const handleNumberfieldChange = (e, attr) => {
    setIsErrorFalse(attr)
    processObj[attr] = isNaN(parseInt(e.target.value)) ? null : parseInt(e.target.value)

    setProcess({ ...processObj })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    if (isInputValid()) {
      setIsLoading(true);
      handleSubmit(processObj).then(() => {
        closeForm();
        setIsLoading(false);
      });
    }
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

      <DialogTitle>Data {processObj.name}</DialogTitle>

      <DialogContent>
        {
          isLoading ?
            <Grid container justifyContent="center">
              <CircularProgress />
            </Grid>
            :
            <>
              {
                processObj.imgPaths &&
                <SingleLineImageList
                  isDisabled={isDisabled}
                  imgPaths={processObj.imgPaths}
                  processObj={processObj}
                  setProcess={setProcess}
                />
              }

              {
                !isDisabled &&
                <UploadButton setIsImagesUploading={setIsLoading} processObj={processObj} />
              }

              <form id="ReceivedForm" noValidate autoComplete="off" onSubmit={handleFormSubmit}>

                <TextField
                  fullWidth
                  required

                  label="Waktu Proses"
                  margin="normal"
                  type="datetime-local"

                  error={isDatetimeError}

                  value={processObj.datetime || datetimeTemp}

                  helperText={getDatetimeHelperText(isDatetimeError, batchDate)}
                  InputProps={getInputProps(isDisabled)}
                  onChange={e => handleTextfieldChange(e, 'datetime')}
                />

                <TextField
                  required
                  fullWidth

                  label="Terima Dari"
                  margin="dense"

                  error={isFromError}

                  value={processObj.from || ""}

                  helperText={getDefaultHelperText(isFromError)}
                  InputProps={getInputProps(isDisabled)}
                  onChange={e => handleTextfieldChange(e, 'from')}
                />

                <TextField
                  fullWidth
                  required

                  margin="dense"
                  label="Jumlah Terima"
                  type="number"

                  error={isQtyEstimatedError}

                  value={parseInt(processObj.qtyEstimated) || (processObj.qtyEstimated === 0 ? 0 : '')}

                  helperText={getDefaultHelperTextNumberField(isQtyEstimatedError)}
                  InputProps={getInputProps(isDisabled, 'Ekor')}
                  onChange={e => handleNumberfieldChange(e, 'qtyEstimated')}
                />

                <TextField
                  required
                  fullWidth

                  margin="dense"
                  label="Jumlah Gagal"
                  type="number"

                  error={isNFailError}

                  value={parseInt(processObj.nFail) || (processObj.nFail === 0 ? 0 : '')}

                  helperText={getNFailHelperText(isNFailError, processObj.qtyEstimated)}
                  InputProps={getInputProps(isDisabled, 'Ekor')}
                  onChange={e => handleNumberfieldChange(e, 'nFail')}
                />


                <TextField
                  fullWidth
                  multiline

                  label="Catatan Tambahan"
                  margin="dense"

                  value={processObj.note || ''}

                  InputProps={getInputProps(isDisabled)}
                  onChange={e => handleTextfieldChange(e, 'note')}
                />

              </form>
            </>
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
                disabled={!isInputValid()}
                form="ReceivedForm"
                color="primary"
                onClick={() => {
                  if (!processObj.datetime) {
                    processObj.datetime = datetimeTemp
                    setProcess({ ...processObj })
                  }

                  validateInput()
                }}
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