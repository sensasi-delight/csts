import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import { Box } from "@material-ui/core";


export default function TagsField(props) {

  const { setValues, values, InputProps, ...other } = props;
  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectedItems] = useState(values || []);

  useEffect(() => {
    setValues(selectedItems);
  }, [selectedItems]);

  const handleKeyUp = event => {
    if (event.key === ',') {
      event.target.value = event.target.value.replace(',', '')

      const newSelectedItems = [...selectedItems];
      const duplicatedValues = newSelectedItems.indexOf(
        event.target.value.trim()
      );

      if (duplicatedValues !== -1) {
        setInputValue('');
        return;
      }

      if (!event.target.value.replace(/\s/g, "").length) return;

      newSelectedItems.push(event.target.value.trim());
      setSelectedItems(newSelectedItems);
      setInputValue('');
    }
  }

  const handleKeyDown = e => {
    if (
      selectedItems.length &&
      !inputValue.length &&
      e.key === "Backspace"
    ) {
      setSelectedItems(selectedItems.slice(0, selectedItems.length - 1));
    }
  }

  const handleDelete = item => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems.splice(newSelectedItems.indexOf(item), 1);
    setSelectedItems(newSelectedItems);
  };

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  const getInputProps = () => {
    let tagsInputProps = { ...InputProps }

    if (selectedItems.length) {
      tagsInputProps.startAdornment = <Box component='div'>
      {/* <InputAdornment position="start"> */}
        {
          selectedItems.map(ingredient =>
            <Chip
              variant="outlined"
              onDelete={() => handleDelete(ingredient)}
              key={ingredient}
              label={ingredient}
              style={{ margin: 2 }}
            />
          )
        }
        </Box>
      // </InputAdornment>
    }

    return tagsInputProps
  }

  return (
    <TextField
      value={inputValue}
      InputProps={getInputProps()}
      onChange={handleInputChange}
      onKeyUp={handleKeyUp}
      onKeyDown={handleKeyDown}
      {...other}
    />
  );
}

TagsField.defaultProps = {
  values: []
};

TagsField.propTypes = {
  setValues: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.string)
};