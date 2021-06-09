import "braft-editor/dist/index.css";
import React from "react";
import BraftEditor from "braft-editor";
import { ContentUtils } from "braft-utils";
import { Upload } from "antd";
import { FileImageOutlined } from "@ant-design/icons";
import "./UploadEditer.less";

export default class UploadEditer extends React.Component {
  state = {
    editorState: BraftEditor.createEditorState(null),
  };

  handleChange = (editorState) => {
    this.setState({ editorState });
  };

  uploadHandler = (param) => {
    if (!param.file) {
      return false;
    }

    this.setState({
      editorState: ContentUtils.insertMedias(this.state.editorState, [
        {
          type: "IMAGE",
          url: URL.createObjectURL,
        },
      ]),
    });
  };

  render() {
    const controls = [
      "letter-spacing",
      "bold",
      "italic",
      "underline",
      "text-color",
      "separator",
      "link",
      "separator",
    ];
    const extendControls = [
      {
        key: "antd-uploader",
        type: "component",
        component: (
          <Upload
            accept="image/*"
            showUploadList={false}
            customRequest={this.uploadHandler}
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button
              type="button"
              className="control-item button upload-button"
              data-title="插入图片"
            >
              <FileImageOutlined />
            </button>
          </Upload>
        ),
      },
    ];

    return (
      <div className="upload-editor-root">
        <BraftEditor
          controlBarClassName="upload-editor-toolbar"
          value={this.state.editorState}
          onChange={this.handleChange}
          controls={controls}
          extendControls={extendControls}
          contentStyle={{ height: 160, width: "100%" }}
        />
      </div>
    );
  }
}
