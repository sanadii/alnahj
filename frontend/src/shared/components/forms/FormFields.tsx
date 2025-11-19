/**
 * FormFields Component
 * Dynamic form field renderer supporting multiple input types
 *
 * @component FormFields
 * @description Renders various form field types with validation support using Formik
 */

import React, { useState, useEffect } from 'react';
import { Row, Col, Label, Input, FormFeedback } from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import defaultAvatar from 'assets/images/users/default.jpg';
import config from '../../../config';
import Select from 'react-select';

const { api } = config;

let mediaUrl = '';
if (api && api.API_MEDIA) {
  mediaUrl = api.API_MEDIA.endsWith('/') ? api.API_MEDIA : `${api.API_MEDIA}/`;
}

interface FieldOption {
  id: number;
  label: string;
  value: number;
  image?: string;
  onClick?: () => void;
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
  inputGroupText?: string;
  inputGroupIcon?: string;
}

interface Validation {
  values: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  touched: any;
  errors: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

interface FormFieldsProps {
  field: Field;
  validation: Validation;
  selectedOption?: any;
  inLineStyle?: boolean;
}

const FormFields: React.FC<FormFieldsProps> = ({ field, validation, selectedOption, inLineStyle }) => {
  const { id, label, name, type, colSize, icon, iconBg, inputGroupText, inputGroupIcon, options } = field;
  const imageValue = validation?.values.image;
  const [imageSrc, setImageSrc] = useState(defaultAvatar);
  const [passwordShow, setPasswordShow] = useState(false);

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
    const selectedImage = e.target.files?.[0];
    if (selectedImage) {
      validation.setFieldValue('image', selectedImage);
    }
  };

  const dateformate = (e: any) => {
    const selectedDate = new Date(e);
    const formattedDate = `${selectedDate.getFullYear()}-${('0' + (selectedDate.getMonth() + 1)).slice(-2)}-${(
      '0' + selectedDate.getDate()
    ).slice(-2)}`;

    // Update the form field value directly with the formatted date
    validation.setFieldValue(name, formattedDate);
  };

  // Dropzone file upload
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  const handleAcceptedFiles = (files: any[]) => {
    const filesWithPreview = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size)
      })
    );
    setSelectedFiles(filesWithPreview);
    validation.setFieldValue(name, filesWithPreview);
  };

  // Formats the size
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const renderInput = () => {
    switch (type) {
      case 'seperator':
        return <hr />;

      case 'title':
        return <h4 className="color-secondary">{label}</h4>;

      case 'info':
        return <h4>{validation.values[name] || 0}</h4>;

      case 'text':
      case 'tel':
      case 'email':
      case 'social':
        return (
          <div className="d-flex">
            {icon && (
              <div className="avatar-xs d-block flex-shrink-0 me-3">
                <span className={`avatar-title rounded-circle fs-16 ${iconBg}`}>
                  <i className={icon}></i>
                </span>
              </div>
            )}
            <Input
              type={type !== 'social' ? type : 'text'}
              name={name}
              id={id}
              className="form-control"
              placeholder={`Enter ${label}`}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values[name] || ''}
              invalid={validation.touched[name] && validation.errors[name]}
            />
          </div>
        );

      case 'number':
        return (
          <Input
            type="number"
            id={id}
            name={name}
            placeholder={`Enter ${label}`}
            value={validation.values[name] || 0}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            invalid={validation.touched[name] && validation.errors[name]}
          />
        );

      case 'textarea':
        return (
          <Input
            type="textarea"
            id={id}
            name={name}
            placeholder={`Enter ${label}`}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values[name] || ''}
            invalid={validation.touched[name] && validation.errors[name]}
          />
        );

      case 'select':
        return (
          <Input
            type="select"
            className="form-control"
            name={name}
            id={id}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values[name] || ''}
            invalid={validation.touched[name] && validation.errors[name]}
          >
            {options &&
              options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </Input>
        );

      case 'imageSelect':
        return (
          <div className="avatar-group d-flex center">
            {options &&
              options.map((option) => (
                <div
                  key={option.value}
                  className={`avatar-group-item ${selectedOption === option.id ? 'selected' : ''}`}
                  onClick={() => option.onClick && option.onClick()}
                >
                  <img src={option.image || defaultAvatar} alt="" className="rounded-circle avatar-sm" />
                  <div className="avatar-group-name">{option.label}</div>
                </div>
              ))}
          </div>
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
                onBlur={validation.handleBlur}
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
          <div className="position-relative auth-pass-inputgroup mb-3">
            <Input
              type={passwordShow ? 'text' : 'password'}
              name={name}
              className="form-control pe-5"
              id={id}
              placeholder={`Enter ${label}`}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values[name] || ''}
              invalid={validation.touched[name] && validation.errors[name]}
            />
            <button
              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
              type="button"
              id="password-addon"
              onClick={() => setPasswordShow(!passwordShow)}
            >
              <i className="ri-eye-fill align-middle"></i>
            </button>
          </div>
        );

      case 'date':
        return (
          <Flatpickr
            name={name}
            id={id}
            className="form-control"
            placeholder={`Choose ${label}`}
            options={{
              altInput: true,
              altFormat: 'Y-m-d',
              dateFormat: 'Y-m-d'
            }}
            onChange={(e) => dateformate(e)}
            value={validation.values[name] || ''}
          />
        );

      case 'select2':
        return (
          <Select
            value={validation.values[name] || ''}
            options={options}
            id="choices-single-default"
            className="select-flag-templating mb-0"
            onChange={(selectedOption: any) => validation.setFieldValue(name, selectedOption)}
          />
        );

      case 'dropzone':
        return (
          <div className="dropzone-area">
            <div
              className="dz-message needsclick"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = 'image/*,application/pdf,.doc,.docx';
                input.onchange = (e: any) => {
                  if (e.target.files) {
                    handleAcceptedFiles(Array.from(e.target.files));
                  }
                };
                input.click();
              }}
              style={{
                border: '2px dashed #ced4da',
                borderRadius: '0.25rem',
                padding: '3rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div className="mb-3">
                <i className="display-4 text-muted ri-upload-cloud-2-fill"></i>
              </div>
              <h4>Drop files here or click to upload.</h4>
            </div>
            {selectedFiles.length > 0 && (
              <div className="list-unstyled mb-0 mt-3" id="file-previews">
                {selectedFiles.map((file: any, index: number) => (
                  <div key={index} className="border rounded p-2 mb-2" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      data-dz-thumbnail=""
                      className="avatar-sm rounded bg-light"
                      alt={file.name}
                      src={file.preview}
                      style={{ objectFit: 'cover', width: '48px', height: '48px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div className="text-muted font-weight-bold">{file.name}</div>
                      <p className="mb-0">
                        <strong>{file.formattedSize}</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        const newFiles = selectedFiles.filter((_, i) => i !== index);
                        setSelectedFiles(newFiles);
                        validation.setFieldValue(name, newFiles);
                      }}
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'file':
        return (
          <Input
            type="file"
            id={id}
            name={name}
            className="form-control"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files[0]) {
                validation.setFieldValue(name, e.target.files[0]);
              }
            }}
            onBlur={validation.handleBlur}
            invalid={validation.touched[name] && validation.errors[name]}
          />
        );

      default:
        return null;
    }
  };

  return (
    <FormFieldLayout inLineStyle={inLineStyle} label={label} id={id} colSize={colSize} type={type}>
      {(inputGroupText || inputGroupIcon) && !['separator', 'title'].includes(type) ? (
        <div className="input-group mb-3">
          <span className="input-group-text">
            {inputGroupText && inputGroupText}
            {inputGroupIcon && <i className={inputGroupIcon}></i>}
          </span>
          {renderInput()}
        </div>
      ) : (
        renderInput()
      )}

      {type !== 'separator' && type !== 'title' && type !== 'image' && validation.touched[name] && validation.errors[name] && (
        <FormFeedback type="invalid" className="d-block">
          {validation.errors[name]}
        </FormFeedback>
      )}
    </FormFieldLayout>
  );
};

const FormFieldLayout: React.FC<{
  inLineStyle?: boolean;
  label: string;
  id: string;
  colSize?: number;
  type: string;
  children: React.ReactNode;
}> = ({ inLineStyle, label, id, colSize, type, children }) => {
  if (type === 'separator' || type === 'title') {
    return <>{children}</>;
  }

  return inLineStyle ? (
    <Row key={id} className="mb-3">
      <Col lg={3} className="align-self-center">
        <Label htmlFor={id} className="form-label">
          {label}
        </Label>
      </Col>
      <Col lg={9}>{children}</Col>
    </Row>
  ) : (
    <Col lg={colSize} className="mb-3">
      <Label htmlFor={id} className="form-label">
        {label}
      </Label>
      {children}
    </Col>
  );
};

export default FormFields;
