import { useState } from "react";
import { getInputProps, getDatetimeHelperText, getNFailHelperText } from "./ProcessFormHelper";

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


export default function DefeatheringFormDialog(props) {

  const { isOpen, closeForm, handleSubmit, isDisabled, nFailMax, prevProcess } = props;

  const [processObj, setProcess] = useState(props.process)
  const datetimeTemp = moment().format('YYYY-MM-DDTHH:mm')
  const [isLoading, setIsLoading] = useState(false)

  const [isDatetimeError, setIsDatetimeError] = useState(false);
  const [isNFailError, setIsNFailError] = useState(false);

  const isInputValid = () => {
    return !isDatetimeError && !isNFailError
  }

  const validateInput = () => {
    const isDatetimeBefore = moment(processObj.datetime).isBefore(prevProcess.datetime)
    const isDatetimeEmpty = !processObj.datetime
    setIsDatetimeError(isDatetimeEmpty || isDatetimeBefore)

    const isNFailNan = isNaN(parseInt(processObj.nFail))
    const isNFailOutRange = 0 > processObj.nFail || processObj.nFail > nFailMax
    setIsNFailError(isNFailNan || isNFailOutRange)
  }

  const setIsErrorFalse = attr => {
    switch (attr) {
      case 'datetime':
        setIsDatetimeError(false)
        break;

      case 'nFail':
        setIsNFailError(false)
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

      <DialogTitle>{processObj.name}</DialogTitle>

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

              <form id="DefeatheringForm" noValidate autoComplete="off" onSubmit={handleFormSubmit}>

                <TextField
                  fullWidth
                  required

                  label="Waktu Proses"
                  margin="normal"
                  type="datetime-local"

                  error={isDatetimeError}

                  value={processObj.datetime || datetimeTemp}

                  helperText={getDatetimeHelperText(isDatetimeError, prevProcess.datetime)}
                  InputProps={getInputProps(isDisabled)}
                  onChange={e => handleTextfieldChange(e, 'datetime')}
                />


                <TextField
                  fullWidth
                  required

                  label="Jumlah Gagal"
                  margin="dense"
                  type="number"

                  error={isNFailError}

                  value={parseInt(processObj.nFail) || (processObj.nFail === 0 ? 0 : '')}

                  helperText={getNFailHelperText(isNFailError, nFailMax)}
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

            {!
              isDisabled &&
              <Button
                type="submit"
                disabled={!isInputValid()}
                form="DefeatheringForm"
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