import { useState } from "react";
import { getDefaultHelperText, getInputProps, getDatetimeHelperText, getNFailHelperText } from "./ProcessFormHelper";

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


export default function StoringFormDialog(props) {

  const { isOpen, closeForm, handleSubmit, isDisabled, prevProcess } = props;

  const [processObj, setProcess] = useState(props.process)
  if (!processObj.nPackFails) {
    processObj.nPackFails = []
  }

  const datetimeTemp = moment().format('YYYY-MM-DDTHH:mm')

  const [isLoading, setIsLoading] = useState(false)

  const [isDatetimeError, setIsDatetimeError] = useState(false);
  const [isNPackFailsError, setIsNPackFailsError] = useState([]);
  const [isStoreAtError, setIsStoreAtError] = useState(false);


  const isInputValid = () => {
    const isNPackFailError = isNPackFailsError.find(isNPackFailError => isNPackFailError)
    return !isDatetimeError && !isNPackFailError && !isStoreAtError
  }

  const validateInput = () => {
    const isDatetimeBefore = moment(processObj.datetime).isBefore(prevProcess.datetime)
    const isDatetimeEmpty = !processObj.datetime
    setIsDatetimeError(isDatetimeEmpty || isDatetimeBefore)

    const isStoreAtNull = !processObj.storeAt
    setIsStoreAtError(isStoreAtNull)

    let isNPackFailsError = []
    prevProcess.products?.map((product, i) => {
      const nPackFail = processObj.nPackFails?.find(nPackFail => nPackFail.productId === product.id)

      if (nPackFail) {
        const isNPackFailNanOrLessThanZero = isNaN(parseInt(nPackFail.nPackFail)) || 0 > nPackFail.nPackFail
        const isNPackFailMoreThanFailMax = nPackFail.nPackFail > product.nPack
        return isNPackFailsError[i] = isNPackFailNanOrLessThanZero || isNPackFailMoreThanFailMax
      }

      return isNPackFailsError[i] = true
    })

    setIsNPackFailsError(isNPackFailsError)
  }

  const setIsErrorFalse = attr => {
    switch (attr) {
      case 'datetime':
        setIsDatetimeError(false)
        break;

      // case 'nPackFail':
      //   setIsNPackFailError(false)
      //   break;

      case 'storeAt':
        setIsStoreAtError(false)
        break;

      default:
        break;
    }
  }

  const handleTextfieldChange = (e, attr) => {
    setIsErrorFalse(attr)
    processObj[attr] = e.target.value

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

              <form id="StoringForm" noValidate autoComplete="off" onSubmit={handleFormSubmit}>

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

                  margin="dense"
                  label="Lokasi Penyimpanan"

                  error={isStoreAtError}

                  value={processObj.storeAt || ''}

                  helperText={getDefaultHelperText(isStoreAtError)}
                  InputProps={getInputProps(isDisabled)}
                  onChange={e => handleTextfieldChange(e, 'storeAt')}

                />

                {
                  prevProcess.products?.map((product, i) =>
                    <TextField
                      key={product.id}
                      fullWidth
                      required

                      label={"Jumlah " + product.name + " Gagal"}
                      margin="dense"
                      type="number"

                      error={isNPackFailsError[i]}

                      value={parseInt(processObj.nPackFails[i]?.nPackFail) || (processObj.nPackFails[i]?.nPackFail === 0 ? 0 : '')}

                      helperText={getNFailHelperText(isNPackFailsError[i], product.nPack)}
                      InputProps={getInputProps(isDisabled, 'Bks')}
                      onChange={e => {
                        isNPackFailsError[i] = false
                        setIsNPackFailsError([...isNPackFailsError])

                        if (!processObj.nPackFails[i]) {
                          processObj.nPackFails[i] = {}
                        }                        

                        processObj.nPackFails[i].productId = product.id
                        processObj.nPackFails[i].nPackFail = isNaN(parseInt(e.target.value)) ? e.target.value : parseInt(e.target.value)

                        return setProcess({ ...processObj })
                      }}
                    />
                  )
                }




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

            {!isDisabled &&
              <Button
                type="submit"
                disabled={!isInputValid()}
                form="StoringForm"
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
              </Button>}
          </>
        }
      </DialogActions>
    </Dialog>
  )

}