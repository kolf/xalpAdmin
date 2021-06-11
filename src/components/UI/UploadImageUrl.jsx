import React, { useState, useEffect } from "react";
import { Upload, message } from "antd";
import utils from "../../shared/utils";

export default function UploadImage({ onChange, value: propsValue }) {
  const [value, setValue] = useState(propsValue || "");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    if (e.file.status === "uploading") {
      setLoading(true);
    } else if (e.file.status === "done") {
      setLoading(false);
      const nextValue = e.file.response;
      setValue(nextValue);
      onChange(e.file.response);
    } else if (e.file.status === "error") {
      const errorMessage =
        e.file.response.error.message || "上传失败，请稍候再试！";
      utils.error(errorMessage);
      setLoading(false);
    }
  }

  return (
    <Upload
      name="file"
      listType="picture-card"
      className="file-uploader"
      showUploadList={false}
      action="api/UploadFile/UploadPicture"
      onChange={handleChange}
    >
      {value ? (
        <div className="upload-file">
          <img src={value} />
        </div>
      ) : (
        <div className="ant-upload-text">上传图片</div>
      )}
    </Upload>
  );
}
