import React, { useState, useEffect } from 'react';
import { Row, Col, Label, Input, FormFeedback } from 'reactstrap';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import Flatpickr from 'react-flatpickr';

import defaultAvatar from 'assets/images/users/default.jpg';
import config from '../../../config';

// Form
import FormStructureRenderer from './FormStructureRenderer';
import SearchDropDown from './SearchDropDown';

const { api } = config;

let mediaUrl = '';
if (api && api.MEDIA_URL) {
  mediaUrl = api.MEDIA_URL.endsWith('/') ? api.MEDIA_URL : `${api.MEDIA_URL}/`;
}

interface FieldOption {
  id: number;
  label: string;
  value: number;
  image?: string;
  onClick?: () => void;

  // text/number
  inputGroupText?: string;
}

interface Field {
  id: string;
  label: string;
  name: string;
  type: string;
  colSize?: number;
  icon?: string;
  iconBg?: string;
  options?: FieldOption[];

  // text/number
  // inputGroupText?: string;
}

interface Validation {
  values: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  touched: any;
  errors: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

interface FieldComponentProps {
  field: any;
  validation?: Validation;
  selectedOption?: any;
  inLineStyle?: boolean;
  formStructure?: string;
}

// Update the FieldComponentProps interface to include all required properties

// Update the FieldComponent to handle the expected event signatures
const FieldComponent: React.FC<FieldComponentProps> = ({ field, validation, formStructure }) => {
  const {
    id,
    label,
    name,
    type,
    colSize,
    value,
    className,
    placeholder,
    isSearchable,
    isClearable,
    onChange,
    onBlur,
    onInputChange,
    options,
    icon,
    prefix,
    suffix,
    iconBg
  } = field;
  const imageValue = validation?.values.image;

  const [imageSrc, setImageSrc] = useState(defaultAvatar);

  const onChangeHandler = (onChange && onChange) || validation.handleChange;
  const onBlurHandler = (onBlur && onBlur) || validation.handleBlur;
  const invalidHandler = !!(validation.touched[name] && validation.errors[name]);

  const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',

    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10
    }
  });

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = data.color;
      return {
        ...styles,
        backgroundColor: isDisabled ? undefined : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : undefined,

        cursor: isDisabled ? 'not-allowed' : 'default',

        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled ? (isSelected ? data.color : color.alpha(0.3).css()) : undefined
        }
      };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) })
  };

  // const customStyles = {
  //   control: (provided) => ({
  //     ...provided,
  //     minHeight: "32px",
  //     height: "32px",
  //     padding: "0.25rem 0.5rem",
  //     fontSize: "1rem",
  //     border: "0px",
  //     boxShadow: "none",
  //     "&:hover": {
  //       borderColor: "var(--vz-input-border-custom)",
  //     },
  //   }),
  //   // Add other style overrides if needed
  // };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '20px',
      // minHeight: "32px",
      // height: "32px",
      padding: '0px',
      fontSize: '1rem',
      border: '0px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'var(--vz-input-border-custom)'
      }

      // Add other styles as needed
    }),
    input: (provided) => ({
      ...provided,
      minHeight: '20px',
      margin: '0'
      // Add other styles as needed
    }),
    indicatorContainer: (provided) => ({
      // ...provided,
      padding: '0px'
      // Add other styles as needed
    })
    // Add other style overrides if needed
  };
  useEffect(() => {
    if (imageValue) {
      if (typeof imageValue === 'string') {
        if (imageValue.startsWith('http://') || imageValue.startsWith('https://')) {
          // If the URL is absolute, use it as is
          setImageSrc(imageValue);
        } else {
          // If the URL is relative, prepend the media URL
          setImageSrc(`${mediaUrl}${imageValue}`);
        }
      } else if (imageValue instanceof File) {
        // If imageValue is a File object
        const objectUrl = URL.createObjectURL(imageValue);
        setImageSrc(objectUrl);
      }
    } else {
      setImageSrc(defaultAvatar);
    }
  }, [imageValue]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files && e.target.files[0];
    if (selectedImage) {
      validation.setFieldValue('image', selectedImage);
    }
  };

  const DateFormat = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const DateTimeFormat = (e, type) => {
    const updatedDate = e[0];
    if (type === 'date') {
      // Format as date only
      validation.setFieldValue(name, DateFormat(updatedDate.toISOString()));
    } else {
      // Format as datetime
      validation.setFieldValue(name, updatedDate.toISOString());
    }

    onChangeHandler(e);
  };

  const renderInputFields = () => {
    // Group text-like fields
    if (['text', 'tel', 'email', 'social', 'link'].includes(type)) {
      const inputType = type === 'link' ? 'url' : type === 'social' ? 'text' : type;
      return (
        <Input
          type={inputType}
          name={name}
          id={id}
          placeholder={placeholder || label}
          onChange={onChangeHandler}
          className="form-control"
          onBlur={onBlurHandler}
          value={value ?? validation.values[name] ?? ''}
          invalid={invalidHandler}
          aria-invalid={invalidHandler}
          aria-describedby={invalidHandler ? `${id}-error` : undefined}
          // Optionally, add pattern for URLs
          {...(type === 'link' ? { pattern: 'https?://.+' } : {})}
        />
      );
    }

    switch (type) {
      case 'searchDropdown':
        return <SearchDropDown validation={validation} field={field} onChangeHandler={onChangeHandler} />;
      case 'textarea':
        return (
          <Input
            type="textarea"
            name={name}
            id={id}
            placeholder={label}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={validation.values[name] || ''}
            invalid={invalidHandler}
          />
        );
      case 'select':
        return (
          <Input
            type="select"
            className="form-control"
            name={name}
            id={id}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={value || validation.values[name] || ''}
            invalid={validation.touched[name] && validation.errors[name]}
          >
            {/* <option value="">-- اختر --</option> */}
            {field.options &&
              field.options.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
          </Input>
        );
      case 'reactSelect':
        return (
          <Select
            id={id}
            name={name}
            isSearchable={true}
            className="form-control form-control"
            styles="input-group input-group"
            // ... other props
            // classNamePrefix="sanad-select sanad2-select"
            isClearable={true}
            options={options}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            // value={value || options.find((option) => option.value === validation.values[name]) || ""}
            value={value}
          />
        );
      case 'creatableSelect':
        return (
          <CreatableSelect
            id={id}
            name={name}
            isSearchable={true}
            isClearable={true}
            className="form-control"
            // no auto complete
            placeholder={placeholder}
            options={options}
            onInputChange={onInputChange}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            // value={validation.values[name] || ""}
            // Ensure you handle 'invalid' prop correctly
          />
        );
      case 'date':
      case 'time':
      case 'dateTime':
        return (
          <Flatpickr
            name={name}
            id={id}
            className="form-control"
            placeholder={label}
            options={{
              enableTime: type === 'dateTime' || type === 'time',
              noCalendar: type === 'time',
              dateFormat: type === 'dateTime' ? 'Y-m-d H:i' : type === 'time' ? 'H:i' : 'Y-m-d'
            }}
            onChange={(e) => DateTimeFormat(e, type)}
            value={value || validation.values[name] || ''}
          />
        );
      case 'image':
        return (
          <div className="profile-user position-relative d-inline-block mx-auto mb-4">
            <img src={imageSrc} className="rounded-circle avatar-xl img-thumbnail user-profile-image" alt="user-profile" />
            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
              <Input
                id={id}
                name={name}
                type="file"
                className="profile-img-file-input"
                accept="image/png, image/gif, image/jpeg"
                onChange={handleImageSelect}
                onBlur={onBlurHandler}
                invalid={validation.touched[name] && validation.errors[name] ? true : undefined}
              />
              <Label htmlFor={id} className="profile-photo-edit avatar-xs">
                <span className="avatar-title rounded-circle bg-light text-body">
                  <i className="ri-camera-fill"></i>
                </span>
              </Label>
            </div>
            {validation.touched[name] && validation.errors[name] && <FormFeedback type="invalid">{validation.errors[name]}</FormFeedback>}
          </div>
        );
      case 'password':
        return (
          <Input
            type="password"
            name={name}
            id={id}
            placeholder={label}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={validation.values[name] || ''}
            invalid={validation.touched[name] && validation.errors[name] ? true : undefined}
          />
        );
      case 'check':
        return (
          <div className="form-check d-flex align-items-center gap-2">
            <Input
              type="checkbox"
              className="form-check-input"
              id={id}
              name={name}
              checked={!!(value ?? validation.values[name])}
              onChange={(e) => validation.setFieldValue(name, e.target.checked)}
            />
            <Label className="form-check-label mb-0" htmlFor={id}>
              {field.option || label}
            </Label>
            {field.text !== undefined && (
              <Input
                type="text"
                className="form-control form-control ms-2"
                placeholder={typeof field.text === 'string' ? field.text : 'Enter details'}
                value={validation.values[`${name}_text`] || ''}
                onChange={(e) => validation.setFieldValue(`${name}_text`, e.target.value)}
              />
            )}
          </div>
        );
      // ... other cases
      default:
        return null;
    }
  };

  const generatePrefixSuffix = (prefix) => {
    if (!prefix) return null;

    if (prefix.type === 'icon') {
      return (
        <div className="avatar-xs d-block flex-shrink-0 me-3">
          <span className={`avatar-title rounded-circle fs-16 ${prefix.iconBg}`}>
            <i className={prefix.icon}></i>
          </span>
        </div>
      );
    } else if (prefix.type === 'text') {
      return <span className="input-group-text">{prefix.text}</span>;
    }

    return null;
  };

  // Helper: Render label above field
  const renderLabel = () => (
    <Label htmlFor={id} className="form-label fw-semibold">
      {label}
    </Label>
  );

  // Error rendering (always use FormFeedback for accessibility)
  const renderError = () =>
    validation?.touched?.[name] && validation?.errors?.[name] ? (
      <FormFeedback id={`${id}-error`} type="invalid" className="d-block">
        {validation.errors[name]}
      </FormFeedback>
    ) : null;

  // Main render
  return (
    <Row>
      <div className={`mb-3 ${formStructure === 'row' ? 'px-2' : ''}`}>
        {/* Always show label above field */}
        {renderLabel()}
        <div className="input-group">
          {generatePrefixSuffix(prefix)}
          {renderInputFields()}
          {suffix && <span className="input-group-text">{suffix.text}</span>}
        </div>
        {renderError()}
      </div>
    </Row>
  );
};

export default FieldComponent;
