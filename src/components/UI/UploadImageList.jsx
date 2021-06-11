import React, { useState, useEffect } from "react";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function UploadImage({ onChange, value }) {
  const [fileList, setFileList] = useState(value || []);
  function handleChange({ fileList }) {
    setFileList(fileList);
    onChange(fileList);
  }

  return (
    <Upload
      name="file"
      listType="picture-card"
      className="file-uploader-list"
      fileList={fileList}
      showUploadList={{
        showRemoveIcon: true,
        showPreviewIcon: false,
      }}
      action="api/UploadFile/UploadPicture"
      onChange={handleChange}
    >
      {fileList.length < 6 && <div className="ant-upload-text">上传图片</div>}
    </Upload>
  );
}
