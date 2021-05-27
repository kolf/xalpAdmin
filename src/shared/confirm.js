import React from "react";
import { Space, Button } from "antd";
import modal from "./modal";

export default function confirm(config) {
  const mod = modal({
    width: 400,
    footer: null,
    content: (
      <div className="ant-modal-confirm-body-wrapper">
        <div className="ant-modal-confirm-body">
          <span
            role="img"
            aria-label="exclamation-circle"
            className="anticon anticon-exclamation-circle"
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="exclamation-circle"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
              <path d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>
            </svg>
          </span>
          {config.title && (
            <span className="ant-modal-confirm-title">{config.title}</span>
          )}
          <div className="ant-modal-confirm-content">{config.content}</div>
        </div>
        <div className="ant-modal-confirm-btns">
          <Space>
            <Button
              onClick={() => {
                mod.close();
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={(e) => {
                config.onOk();
              }}
            >
              确定
            </Button>
          </Space>
        </div>
      </div>
    ),
  });
  return mod;
}
