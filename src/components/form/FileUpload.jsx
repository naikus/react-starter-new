import React, {useRef, useState} from "react";
import PropTypes from "prop-types";

import {registerFieldType} from "./Form";

function FileItem({file, onRemove}) {
  const {name, size, type} = file;
  return (
    <div key={name} className="file-item">
      <i className="icon-file" />
      <div className="file-details">
        <span className="file-name">{name}</span>
        <div className="file-meta">
          {type ? <span className="badge file-type">{type}</span> : null}
          <span className="badge file-size">{size}b</span>
        </div>
      </div>
      
      <i className="icon icon-trash" onClick={onRemove} />
    </div>
  );
}
FileItem.displayName = "FileItem";
FileItem.propTypes = {
  file: PropTypes.object.isRequired,
  onRemove: PropTypes.func
};


function FileUpload(props) {
  const {value, onChange, multiple, accept, disabled} = props,
      inputRef = useRef(), 
      NO_DISPLAY = {display: "none"},
      [data, setData] = useState(value || []),
      files = data.map(file => {
        return (
          <FileItem key={file.name}
              file={file}
              onRemove={() => {
                const newData = data.filter(f => f.name !== file.name);
                setData(newData);
                onChange && onChange(newData);
              }} />
        );
      }),
      handleChange = e => {
        const fileList = e.target.files;
        if(!fileList.length) {
          return;
        }

        const files = [];
        for(let i = 0; i < fileList.length; i++) {
          files.push(fileList[i]);
        }
        setData(files);
        onChange && onChange(files);
      },
      removeAll = () => {
        if(disabled) {return;}
        setData([]);
        onChange && onChange([]);
      };

  return (
    <div className="file-upload-input">
      <input style={NO_DISPLAY} onChange={handleChange} 
          ref={inputRef} 
          type="file" 
          className="file-input"
          multiple={multiple}
          accept={accept}
          disabled={disabled} />
      <div className="content">
        <div className="actions">
          <span className={`action icon-trash`} onClick={removeAll} disabled={data.length === 0 || disabled} />
          <span className="action icon-folder" onClick={() => inputRef.current.click()} disabled={disabled} />
        </div>
        <div className="files">
          {files}
        </div>
      </div>
    </div>
  );
}
FileUpload.displayName = "FileUpload";
FileUpload.propTypes = {
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  disabled: PropTypes.bool
};

registerFieldType("file-upload", FileUpload);

export default FileUpload;