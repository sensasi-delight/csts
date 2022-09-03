import { useEffect, useState } from "react";
import { getInputProps } from "../process/ProcessFormHelper";

import ApiHandler from "../../classes/ApiHandler";
import TagsField from "../TagsField";
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


export default function ProductForm(props) {

  const { isOpen, closeForm, isDisabled, products, product, title, handleAfterSubmit } = props;

  const [isLoading, setIsLoading] = useState(false)

  const [formProduct, setFormProduct] = useState({})
  const [isNew, setIsNew] = useState(!product?.createdAt)


  useEffect(() => {
    setFormProduct(product || {})
    setIsNew(!product?.createdAt)

    setProductIdValidation({
      error: false,
      helperText: null
    })

    setNameValidation({
      error: false,
      helperText: null
    })
    
    setPcsPerChickenValidation({
      error: false,
      helperText: null
    })
  }, [product])




  // VALIDATION BLOCK ------------------------------------

  const [productIdValidation, setProductIdValidation] = useState({
    error: false,
    helperText: null
  })

  const [nameValidation, setNameValidation] = useState({
    error: false,
    helperText: null
  })

  const [pcsPerChickenValidation, setPcsPerChickenValidation] = useState({
    error: false,
    helperText: null
  })


  const validateProductId = () => new Promise(async resolve => {
    const isProductIdEmpty = !formProduct.id?.trim()

    if (isProductIdEmpty) {

      productIdValidation.error = true
      productIdValidation.helperText = 'Mohon mengisi isian ini.'

      setProductIdValidation(productIdValidation)

      resolve(productIdValidation)

      return;
    }

    const productFoundById = products.find(productExists => productExists.id === formProduct.id.trim())
    const isNewAndExists = isNew && productFoundById
    const isNotNewAndNotExists = !isNew && !productFoundById


    if (isNewAndExists) {
      productIdValidation.error = true
      productIdValidation.helperText = 'Kode produk sudah digunakan, silahkan masukkan kode produk baru.'

      setProductIdValidation(productIdValidation)
    }

    if (isNotNewAndNotExists) {
      productIdValidation.error = true
      productIdValidation.helperText = 'Terjadi kesalahan, data produk tidak ditemukan.'

      setProductIdValidation(productIdValidation)
    }


    resolve(productIdValidation)
  })

  const validateProductName = () => new Promise(async resolve => {
    const isNameEmpty = !formProduct.name?.trim()

    if (isNameEmpty) {

      nameValidation.error = true
      nameValidation.helperText = 'Mohon mengisi isian ini.'

      setNameValidation(nameValidation)

    }

    resolve(nameValidation)
  })

  const validatePcsPerChicken = () => new Promise(async resolve => {

    const isNan = isNaN(parseInt(formProduct.pcsPerChicken))
    const isLessThanZero = 0 > formProduct.pcsPerChicken

    if (isNan || isLessThanZero) {

      pcsPerChickenValidation.error = true
      pcsPerChickenValidation.helperText = 'Mohon mengisi isian 0 ke atas.'

      setPcsPerChickenValidation(pcsPerChickenValidation)

    }

    resolve(pcsPerChickenValidation)
  })

  const asyncIsInputsValid = async () => {
    const productIdValidation = await validateProductId();
    const nameValidation = await validateProductName();
    const pcsPerChickenValidation = await validatePcsPerChicken();

    return !productIdValidation.error && !nameValidation.error && !pcsPerChickenValidation.error;
  }

  const isInputsValid = () => {
    return !productIdValidation.error && !nameValidation.error && !pcsPerChickenValidation.error;
  }


  // HANDLE BLOCK ------------------------------------

  const handleTextfieldChange = (e, attr) => {
    formProduct[attr] = e.target.value

    if (!e.target.value) {
      delete formProduct[attr]
    }

    if (attr === 'id') {
      setProductIdValidation({
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

    setFormProduct({ ...formProduct })
  }

  const handleNumberfieldChange = (e, attr) => {
    formProduct[attr] = isNaN(parseInt(e.target.value)) ? null : parseInt(e.target.value)

    if (attr === 'pcsPerChicken') {
      setPcsPerChickenValidation({
        error: false,
        helperText: null
      })
    }

    setFormProduct({ ...formProduct })
  }

  const handleFormSubmit = async e => {
    e.preventDefault()

    setIsLoading(true);

    const isInputsValid = await asyncIsInputsValid();

    if (!isInputsValid) {
      setIsLoading(false);
    }

    if (isInputsValid && isNew) {
      formProduct.createdAt = moment().format()
      setFormProduct()
      await ApiHandler.createProduct(formProduct)
    }

    if (isInputsValid && !isNew) {
      formProduct.updatedAt = moment().format()

      await ApiHandler.updateProduct(formProduct)
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


      <DialogTitle>{title || (isNew ? 'Masukkan Produk Baru' : 'Ubah data: [' + product.id + '] ' + product.name)}</DialogTitle>

      <DialogContent>
        {
          isLoading ?
            <Grid container justifyContent="center">
              <CircularProgress />
            </Grid>
            :

            <>

              {
                formProduct.imgPaths &&
                <SingleLineImageList
                  isDisabled={isDisabled}
                  processObj={formProduct}
                  setProcess={setFormProduct}
                />
              }

              {
                !isDisabled &&
                <UploadButton setIsImagesUploading={setIsLoading} processObj={formProduct} />
              }

              <form id="productForm" noValidate autoComplete="off" onSubmit={handleFormSubmit}>
                <TextField
                  fullWidth
                  required

                  margin="dense"
                  label="Kode"

                  value={formProduct.id || ''}

                  InputProps={getInputProps(!isNew || isDisabled)}
                  onChange={(e) => handleTextfieldChange(e, 'id')}

                  {...productIdValidation}
                />

                <TextField
                  fullWidth
                  required

                  margin="dense"
                  label="Nama"

                  value={formProduct.name || ''}

                  InputProps={getInputProps(isDisabled)}
                  onChange={(e) => handleTextfieldChange(e, 'name')}

                  {...nameValidation}
                />

                {
                  !isDisabled &&

                  <TextField
                    fullWidth
                    required

                    margin="dense"
                    label="pcs/chicken"
                    type="number"

                    value={parseInt(formProduct.pcsPerChicken) || (formProduct.pcsPerChicken === 0 ? 0 : '')}

                    InputProps={getInputProps(isDisabled)}
                    onChange={(e) => handleNumberfieldChange(e, 'pcsPerChicken')}

                    {...pcsPerChickenValidation}
                  />
                }

                <TagsField
                  fullWidth

                  helperText="pisahkan dengan koma (,)"
                  margin="dense"
                  label="Bahan"

                  values={formProduct.ingredients || []}
                  InputProps={getInputProps(isDisabled)}
                  setValues={ingredients => {
                    formProduct.ingredients = ingredients
                    setFormProduct({ ...formProduct })
                  }}
                />

                <TextField
                  fullWidth

                  margin="dense"
                  label="NO. Sertifikat Halal"

                  value={formProduct.halalCertificateId || ''}

                  InputProps={getInputProps(isDisabled)}
                  onChange={(e) => handleTextfieldChange(e, 'halalCertificateId')}
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
                form="productForm"
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