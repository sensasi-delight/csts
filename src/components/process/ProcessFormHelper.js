import InputAdornment from "@material-ui/core/InputAdornment"
import moment from "moment";


export const getInputProps = (isDisabled, adornmentText) => {
  let props = {
    disableUnderline: Boolean(isDisabled),
    disabled: Boolean(isDisabled),
    style: {
      color: "black"
    }
  }

  if (adornmentText) {
    props.endAdornment = <InputAdornment position="end">{adornmentText}</InputAdornment>
  }

  return props
}

export const getDefaultHelperText = isError => isError ? "Mohon mengisi isian ini" : ""
export const getDefaultHelperTextNumberField = isError => isError ? "Mohon mengisi angka 0 ke atas" : ""

export const getDatetimeHelperText = (isError, prevProccessDatetime) => isError
  ? "Mohon memilih tanggal di atas: " + moment(prevProccessDatetime).format('YYYY-MM-DD HH:mm')
  : ""

export const getNFailHelperText = (isError, NFailMax) => isError
  ? getDefaultHelperText(isError) + " antara 0 s/d " + NFailMax
  : ""

export const getNPackHelperText = (isError, remain) => isError
  ? ((remain < 0) ? "Jumlah kemasan melebihi ayam yang tersedia" : getDefaultHelperText(isError) + " antara 1 s/d " + remain)
  : ""