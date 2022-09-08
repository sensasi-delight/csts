import { useEffect, useState } from "react";
import { getInputProps, getDatetimeHelperText, getNFailHelperText, getDefaultHelperText, getNPackHelperText } from "./ProcessFormHelper";

import moment from "moment";

import ApiHandler from "../../classes/ApiHandler";
import ProductChip from "../ProductChip";
import ProductForm from "../product/Form";
import UploadButton from "../UploadButton";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from '@material-ui/icons/Close';
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
import Select from "@material-ui/core/Select";
import SingleLineImageList from "../SingleLineImageList";
import TextField from "@material-ui/core/TextField";


const getStyles = (product, selectedProducts) => {
  return {
    fontWeight:
      !selectedProducts || selectedProducts?.map(product => product.id).indexOf(product.id) === -1
        ? 400
        : 500,
  };
}

export default function PackingFormDialog(props) {

  const { isOpen, closeForm, handleSubmit, isDisabled, nFailMax, prevProcess } = props;

  const [processObj, setProcess] = useState(props.process)
  const datetimeTemp = moment().format('YYYY-MM-DDTHH:mm')
  const [isLoading, setIsLoading] = useState(false)


  const [isDatetimeError, setIsDatetimeError] = useState(false);
  const [isNFailError, setIsNFailError] = useState(false);
  const [isProductsError, setIsProductsError] = useState(false);
  const [isNPackErrors, setIsNPackErrors] = useState([]);

  const [productDetail, setProductDetail] = useState({})
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)


  const getProductOptions = product => (
    <MenuItem
      key={'product-' + product.Record.id}
      value={product.Record}
      style={getStyles(product.Record, processObj.products)}
    >
      <img
        width="70px"
        src={process.env.REACT_APP_API_SERVER + "/" + product.Record.imgPaths[0]}
        alt={"Foto " + product.Record.name}
        style={{ margin: '5px' }}
      /> {"(" + product.Record.id + ") - " + product.Record.name}

    </MenuItem>
  )

  const [products, setProducts] = useState({
    success: false,
    data: [],
    message: "belum dilakukan fetch"
  })

  useEffect(() => {
    if (!isDisabled && prevProcess.createdAt) {
      ApiHandler.readProducts()
        .then(res => res.json())
        .then(data => setProducts(data))
    }
  }, [prevProcess, isDisabled])


  const isInputValid = () => {
    const isNPackError = isNPackErrors.find(isNPackError => isNPackError)
    return !isDatetimeError && !isNFailError && !isNPackError
  }

  const validateInput = () => {
    const isDatetimeBefore = moment(processObj.datetime).isBefore(prevProcess.datetime)
    const isDatetimeEmpty = !processObj.datetime
    setIsDatetimeError(isDatetimeEmpty || isDatetimeBefore)

    const isNFailNan = isNaN(parseInt(processObj.nFail))
    const isNFailOutRange = 0 > processObj.nFail || processObj.nFail > nFailMax
    setIsNFailError(isNFailNan || isNFailOutRange)

    const isProductsEmpty = !processObj.products || processObj.products.length === 0
    setIsProductsError(isProductsEmpty)

    let isProductPacksError = []
    processObj.products?.map((product, i) => {
      const isNPackNanOrLessThanOne = isNaN(parseInt(product.nPack)) || 1 > product.nPack
      const isNPackOutRange = product.nPack > nFailMax - (processObj.nFail || 0)

      return isProductPacksError[i] = isNPackNanOrLessThanOne || isNPackOutRange
    })

    setIsNPackErrors(isProductPacksError)
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

                <form id="PackingForm" noValidate autoComplete="off" onSubmit={handleFormSubmit}>

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
                    error={isProductsError}
                  >
                    <InputLabel id="productsSelectLabel">Produk</InputLabel>
                    <Select
                      required
                      multiple

                      labelId="productsSelectLabel"
                      disabled={Boolean(isDisabled)}

                      value={processObj.products || []}
                      input={
                        <Input
                          {...getInputProps(isDisabled)}
                        />
                      }
                      renderValue={selected => (
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {
                            selected?.map(product =>
                              <ProductChip
                                key={product.id}
                                product={product}
                                onClick={() => {
                                  setProductDetail({ ...product })
                                  setIsProductDetailOpen(true)
                                }}
                                isDisabled={!isDisabled}
                              />
                            )
                          }
                        </div>
                      )}
                      onChange={e => handleTextfieldChange(e, 'products')}
                    >
                      {
                        products.data?.map(getProductOptions)
                      }
                    </Select>
                    <FormHelperText>{getDefaultHelperText(isProductsError)}</FormHelperText>
                  </FormControl>


                  {
                    processObj.products?.map((product, i) =>
                      <TextField
                        key={product.id}
                        fullWidth
                        required

                        type="number"
                        margin="dense"
                        label={"Jumlah Kemasan " + product.name}

                        error={isNPackErrors[i]}

                        value={parseInt(processObj.products[i].nPack) || (processObj.products[i].nPack === 0 ? 0 : '')}

                        helperText={getNPackHelperText(isNPackErrors[i], product.pcsPerChicken * (nFailMax - (processObj.nFail || 0)))}
                        InputProps={getInputProps(isDisabled, 'Bks')}
                        onChange={e => {
                          isNPackErrors[i] = false
                          setIsNPackErrors([...isNPackErrors])
                          processObj.products[i].nPack = isNaN(parseInt(e.target.value)) ? e.target.value : parseInt(e.target.value)

                          setProcess({ ...processObj })
                        }}

                      />
                    )

                  }


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
                  form="PackingForm"
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


      <ProductForm
        isOpen={isProductDetailOpen}
        isDisabled={true}
        closeForm={() => setIsProductDetailOpen(false)}
        product={productDetail}
        title={'Rincian Produk: [' + productDetail.id + '] ' + productDetail.name}
      />
    </>
  )

}