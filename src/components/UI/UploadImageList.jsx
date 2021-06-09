import React, { useState, useEffect } from "react";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function UploadImage({ onChange, value: propsValue }) {
  const [value, setValue] = useState(propsValue || []);
  const [loading, setLoading] = useState(false);

  function handleChange({ fileList }) {
    setValue(fileList);
  }

  return (
    <Upload
      name="file"
      listType="picture-card"
      className="file-uploader-list"
      fileList={value}
      action="api/UploadFile/UploadFaceImage"
      onChange={handleChange}
    >
      {value.length > 0 ? null : (
        <div className="ant-upload-text">上传图片</div>
      )}
    </Upload>
  );
}
