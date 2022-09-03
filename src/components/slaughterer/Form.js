import { useEffect, useState } from "react";
import { getInputProps } from "../process/ProcessFormHelper";

import ApiHandler from "../../classes/ApiHandler";
import UploadButton from "../UploadButton";
import SingleLineImageList from "../SingleLineImageList";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import moment from "moment/moment";
import TextField from "@material-ui/core/TextField";

import CloseIcon from '@material-ui/icons/Close';


export default function SlaughtererForm(props) {

  const { isOpen, closeForm, isDisabled, slaughterers, slaughterer, title, handleAfterSubmit } = props;

  const [isLoading, setIsLoading] = useState(false)

  const [formSlaughterer, setFormSlaughterer] = useState({})
  const [isNew, setIsNew] = useState(!slaughterer?.createdAt)

  useEffect(() => {
    setFormSlaughterer(slaughterer || {})
    setIsNew(!slaughterer?.createdAt)

    setIdValidation({
      error: false,
      helperText: null
    })

    setNameValidation({
      error: false,
      helperText: null
    })

    setCertificateNoValidation({
      error: false,
      helperText: null
    })
  }, [slaughterer])


  // VALIDATION BLOCK ------------------------------------

  const [idValidation, setIdValidation] = useState({
    error: false,
    helperText: null
  })

  const [nameValidation, setNameValidation] = useState({
    error: false,
    helperText: null
  })

  const [certificateNoValidation, setCertificateNoValidation] = useState({
    error: false,
    helperText: null
  })


  const validateId = () => new Promise(async resolve => {
    const isIdEmpty = !formSlaughterer.id?.trim()

    if (isIdEmpty) {

      idValidation.error = true
      idValidation.helperText = 'Mohon mengisi isian ini.'

      setIdValidation(idValidation)

      resolve(idValidation)

      return;
    }

    const slaughtererFoundById = slaughterers.find(slaughtererExists => slaughtererExists.id === formSlaughterer.id.trim())
    const isNewAndExists = isNew && slaughtererFoundById
    const isNotNewAndNotExists = !isNew && !slaughtererFoundById


    if (isNewAndExists) {
      idValidation.error = true
      idValidation.helperText = 'Kode Juru Sembelih sudah digunakan, silahkan masukkan kode baru.'

      setIdValidation(idValidation)
    }

    if (isNotNewAndNotExists) {
      idValidation.error = true
      idValidation.helperText = 'Terjadi kesalahan, data Juru Sembelih tidak ditemukan.'

      setIdValidation(idValidation)
    }


    resolve(idValidation)
  })

  const validateName = () => new Promise(async resolve => {
    const isNameEmpty = !formSlaughterer.name

    if (isNameEmpty) {

      nameValidation.error = true
      nameValidation.helperText = 'Mohon mengisi isian ini.'

      setNameValidation(nameValidation)

    }

    resolve(nameValidation)
  })

  const validateCertificateNo = () => new Promise(async resolve => {

    const isCertificateEmpty = !formSlaughterer.certificateNo


    if (isCertificateEmpty) {

      certificateNoValidation.error = true
      certificateNoValidation.helperText = 'Mohon mengisi isian ini.'

      setCertificateNoValidation(certificateNoValidation)

    }

    resolve(certificateNoValidation)
  })

  const asyncIsInputsValid = async () => {
    const idValidation = await validateId();
    const nameValidation = await validateName();
    const certificateNoValidation = await validateCertificateNo();

    return !idValidation.error && !nameValidation.error && !certificateNoValidation.error;
  }

  const isInputsValid = () => {
    return !idValidation.error && !nameValidation.error && !certificateNoValidation.error;
  }



  // HANDLE BLOCK ------------------------------------

  const handleTextfieldChange = (e, attr) => {
    formSlaughterer[attr] = e.target.value

    if (!e.target.value) {
      delete formSlaughterer[attr]
    }

    if (attr === 'id') {
      setIdValidation({
        error: false,
        helperText: null
      })
    }

    if (attr === 'name') {
      setNameValidation({
        error: false,
        helperText: null
      })
    }

    if (attr === 'certificateNo') {
      setCertificateNoValidation({
        error: false,
        helperText: null
      })
    }

    setFormSlaughterer({ ...formSlaughterer })
  }


  const handleFormSubmit = async e => {
    e.preventDefault()

    setIsLoading(true);

    formSlaughterer.id = formSlaughterer.id?.trim()
    formSlaughterer.name = formSlaughterer.name?.trim()
    formSlaughterer.certificateNo = formSlaughterer.certificateNo?.trim()

    setFormSlaughterer({ ...formSlaughterer })


    const isInputsValid = await asyncIsInputsValid();

    if (!isInputsValid) {
      setIsLoading(false);
    }

    if (isInputsValid && isNew) {
      formSlaughterer.createdAt = moment().format()
      await ApiHandler.createSlaughterer(formSlaughterer)
    }

    if (isInputsValid && !isNew) {
      formSlaughterer.updatedAt = moment().format()
      await ApiHandler.updateSlaughterer(formSlaughterer)
    }

    if (isInputsValid && handleAfterSubmit) {
      handleAfterSubmit()
    }

    if (isInputsValid) {
      closeForm()
    }

    setIsLoading(false)
  }




  return (
    <Dialog maxWidth="xs" open={isOpen} onClose={isLoading ? null : closeForm}>

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


      <DialogTitle>{title || (isNew ? 'Masukkan Juru Sembelih Baru' : 'Ubah data: [' + slaughterer.id + '] ' + slaughterer.name)}</DialogTitle>

      <DialogContent>
        {
          isLoading ?
            <Grid container justifyContent="center">
              <CircularProgress />
            </Grid>
            :

            <>

              {
                formSlaughterer.imgPaths &&
                <SingleLineImageList
                  isDisabled={isDisabled}
                  processObj={formSlaughterer}
                  setProcess={setFormSlaughterer}
                />
              }

              {
                !isDisabled &&
                <UploadButton setIsImagesUploading={setIsLoading} processObj={formSlaughterer} />
              }

              <form id="slaughtererForm" noValidate autoComplete="off" onSubmit={handleFormSubmit}>

                <TextField
                  fullWidth
                  required

                  margin="dense"
                  label="Kode"

                  value={formSlaughterer.id || ''}

                  InputProps={getInputProps(!isNew || isDisabled)}
                  onChange={(e) => handleTextfieldChange(e, 'id')}

                  {...idValidation}
                />

                <TextField
                  fullWidth
                  required

                  margin="dense"
                  label="Nama"

                  value={formSlaughterer.name || ''}

                  InputProps={getInputProps(isDisabled)}
                  onChange={(e) => handleTextfieldChange(e, 'name')}

                  {...nameValidation}
                />


                <TextField
                  fullWidth
                  required

                  margin="dense"
                  label="Nomor Serfitikat"

                  value={formSlaughterer.certificateNo || ''}

                  InputProps={getInputProps(isDisabled)}
                  onChange={(e) => handleTextfieldChange(e, 'certificateNo')}

                  {...certificateNoValidation}
                />
              </form>
            </>
        }
      </DialogContent>
      <DialogActions>
        {
          !isLoading &&
          <>
            <Button type="button" color="inherit" onClick={closeForm}>
              {isDisabled ? 'Tutup' : 'Batal'}
            </Button>

            {
              !isDisabled &&
              <Button
                type="submit"
                disabled={!isInputsValid()}
                form="slaughtererForm"
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