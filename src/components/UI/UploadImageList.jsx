import React, { useState, useEffect } from "react";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function UploadImage({ onChange, value: propsValue }) {
  const [value, setValue] = useState(propsValue || []);
  function handleChange({ fileList }) {
    setValue(fileList);
    onChange(fileList);
  }

  return (
    <Upload
      name="file"
      listType="picture-card"
      className="file-uploader-list"
      fileList={value}
      showUploadList={{
        showRemoveIcon:true, showPreviewIcon:false
      }}
      action="api/UploadFile/UploadPicture"
      onChange={handleChange}
    >
      {value.length < 6 && <div className="ant-upload-text">上传图片</div>}
    </Upload>
  );
}
