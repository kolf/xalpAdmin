import "braft-editor/dist/index.css";
import React from "react";
import BraftEditor from "braft-editor";
import { ContentUtils } from "braft-utils";
import { Upload } from "antd";
import { FileImageOutlined } from "@ant-design/icons";
import "./UploadEditer.less";

export default class UploadEditer extends React.PureComponent {
  state = {
    editorState: BraftEditor.createEditorState(this.props.value),
  };

  handleChange = (editorState) => {
    this.setState({ editorState });
    this.props.onChange(editorState.toHTML());
  };

  uploadHandler = (e) => {
    if (e.file.status === "uploading") {
    } else if (e.file.status === "done") {
      const nextValue = e.file.response;
      this.setState(
        {
          editorState: ContentUtils.insertMedias(this.state.editorState, [
            {
              type: "IMAGE",
              url: nextValue,
            },
          ]),
        },
        () => {
          this.props.onChange(this.state.editorState.toHTML());
        }
      );
    } else if (e.file.status === "error") {
      // const errorMessage =
      //   e.file.response.error.message || "上传失败，请稍候再试！";
      // utils.error(errorMessage);
    }
  };

  render() {
    const excludeControls = [
      "letter-spacing",
      "line-height",
      "clear",
      "headings",
      "list-ol",
      "list-ul",
      "remove-styles",
      "superscript",
      "subscript",
      "hr",
      "text-align",
    ];

    const controls = [
      "clear",
      "headings",
      "list-ol",
      "list-ul",
      "remove-styles",
      "superscript",
      "subscript",
      "hr",
      "text-align",
    ];
    const extendControls = [
      {
        key: "antd-uploader",
        type: "component",
        component: (
          <Upload
            accept="image/*"
            action="api/UploadFile/UploadPicture"
            showUploadList={false}
            onChange={this.uploadHandler}
          >
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
          contentStyle={{ height: 160, width: "100%", fontSize: 14 }}
        />
      </div>
    );
  }
}
