import { useEffect, useState } from "react";
import { getDefaultHelperText, getInputProps, getDatetimeHelperText, getNFailHelperText } from "./ProcessFormHelper";

import ApiHandler from "../../classes/ApiHandler";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";
import Select from "@material-ui/core/Select";
import SingleLineImageList from "../SingleLineImageList";
import SlaughtererForm from "../slaughterer/Form";
import TextField from "@material-ui/core/TextField";
import UploadButton from "../UploadButton";

import CloseIcon from '@material-ui/icons/Close';
import SlaughtererChip from "../SlaughtererChip";



const getStyles = (slaughterer, selectedSlaughterers) => {
  return {
    fontWeight:
      !selectedSlaughterers || selectedSlaughterers?.map(slaughterer => slaughterer.id).indexOf(slaughterer.id) === -1
        ? 400
        : 500,
  };
}

export default function SlaughteringFormDialog(props) {

  const { isOpen, closeForm, handleSubmit, isDisabled, nFailMax, prevProcess } = props;

  const [processObj, setProcess] = useState(props.process)
  const datetimeTemp = moment().format('YYYY-MM-DDTHH:mm')

  const [isLoading, setIsLoading] = useState(false)

  const [isDatetimeError, setIsDatetimeError] = useState(false);
  const [isNFailError, setIsNFailError] = useState(false);
  const [isSlaughterersError, setIsSlaughterersError] = useState(false);
  const [isKnifeInfoError, setIsKnifeInfoError] = useState(false);

  const [slaughtererDetail, setSlaughtererDetail] = useState({})
  const [isSlaughtererDetailOpen, setIsSlaughtererDetailOpen] = useState(false)


  const isInputValid = () => {
    return !isDatetimeError && !isNFailError && !isSlaughterersError && !isKnifeInfoError
  }

  const validateInput = () => {
    const isDatetimeBefore = moment(processObj.datetime).isBefore(prevProcess.datetime)
    const isDatetimeEmpty = !processObj.datetime
    setIsDatetimeError(isDatetimeEmpty || isDatetimeBefore)

    const isNFailNan = isNaN(parseInt(processObj.nFail))
    const isNFailOutRange = 0 > processObj.nFail || processObj.nFail > nFailMax
    setIsNFailError(isNFailNan || isNFailOutRange)

    const isSlaughterersEmpty = !processObj.slaughterers || processObj.slaughterers.length === 0
    setIsSlaughterersError(isSlaughterersEmpty)

    const isKnifeInfoEmpty = !processObj.knifeInfo
    setIsKnifeInfoError(isKnifeInfoEmpty)
  }

  const setIsErrorFalse = attr => {
    switch (attr) {
      case 'datetime':
        setIsDatetimeError(false)
        break;

      case 'nFail':
        setIsNFailError(false)
        break;

      case 'knifeInfo':
        setIsKnifeInfoError(false)
        break;

      case 'slaughterers':
        setIsSlaughterersError(false)
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


  const [slaughterers, setSlaughterers] = useState({
    success: false,
    data: [],
    message: "belum dilakukan fetch"
  })

  const getSlaughtererOptions = slaughterer => (
    <MenuItem
      key={'slaughterer-' + slaughterer.Record.id}
      value={slaughterer.Record}
      style={getStyles(slaughterer.Record, processObj.slaughterers)}
    >
      <img
        width="70px"
        src={"http://" + process.env.REACT_APP_API_SERVER + "/" + slaughterer.Record.imgPaths[0]}
        alt={"Foto " + slaughterer.Record.name}
        style={{ margin: '5px' }}
      /> {"(" + slaughterer.Record.id + ") - " + slaughterer.Record.name}

    </MenuItem>
  )


  useEffect(() => {
    if (!isDisabled && prevProcess.createdAt) {
      ApiHandler.readSlaughterers()
        .then(res => res.json())
        .then(data => setSlaughterers(data))
    }
  }, [prevProcess, isDisabled])

  return (
    <>
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

                <form id="SlaughteringForm" noValidate autoComplete="off" onSubmit={handleFormSubmit}>

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

                  <FormControl
                    fullWidth
                    style={{ margin: '0.5em 0' }}
                    error={isSlaughterersError}
                  >
                    <InputLabel id="slaughtererSelectLabel">Penyembelih</InputLabel>
                    <Select
                      required
                      multiple

                      labelId="slaughtererSelectLabel"
                      disabled={isDisabled}

                      value={processObj.slaughterers || []}
                      input={
                        <Input
                          {...getInputProps(isDisabled)}
                        />
                      }
                      renderValue={selected => (
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {
                            selected.map(slaughterer =>
                              <SlaughtererChip
                                key={slaughterer.id}
                                isDisabled={!isDisabled}
                                slaughterer={slaughterer}
                                onClick={() => {
                                  setSlaughtererDetail({ ...slaughterer })
                                  setIsSlaughtererDetailOpen(true)
                                }}
                              />
                            )
                          }
                        </div>
                      )}
                      onChange={e => handleTextfieldChange(e, 'slaughterers')}
                    >
                      {
                        slaughterers.data?.map(getSlaughtererOptions)
                      }
                    </Select>
                    <FormHelperText>{getDefaultHelperText(isSlaughterersError)}</FormHelperText>
                  </FormControl>


                  <TextField
                    fullWidth
                    required

                    margin="dense"
                    label="Pisau (merk + tajam)"

                    error={isKnifeInfoError}

                    value={processObj.knifeInfo || ''}

                    helperText={getDefaultHelperText(isKnifeInfoError)}
                    InputProps={getInputProps(isDisabled)}
                    onChange={e => handleTextfieldChange(e, 'knifeInfo')}

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

              {
                !isDisabled &&
                <Button
                  type="submit"
                  disabled={!isInputValid()}
                  form="SlaughteringForm"
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

      <SlaughtererForm
        isDisabled

        isOpen={isSlaughtererDetailOpen}
        slaughterer={slaughtererDetail}

        closeForm={() => setIsSlaughtererDetailOpen(false)}
        title={'Data Juru Sembelih: ' + slaughtererDetail.name}
      />
    </>
  )

}