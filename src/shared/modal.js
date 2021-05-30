import React from "react";
import ReactDOM from "react-dom";
import { Modal, ConfigProvider } from "antd";
import Draggable from "react-draggable";
import zhCN from "antd/lib/locale/zh_CN";
const IS_REACT_16 = !!ReactDOM.createPortal;

class Mod extends React.Component {
  static defaultProps = {
    width: 520,
  };

  state = {
    disabled: true,
    bounds: { left: 0, top: 0, bottom: 0, right: 0 },
  };

  draggleRef = React.createRef();

  onStart = (e, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = this.draggleRef.current.getBoundingClientRect();
    this.setState({
      bounds: {
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y),
      },
    });
  };

  render() {
    const { title, children, wrapClassName, ...otherProps } = this.props;
    const { bounds, disabled } = this.state;
    return (
      <ConfigProvider locale={zhCN}>
        <Modal
          {...otherProps}
          title={title}
          title={
            title ? (
              <div
                style={{
                  width: "100%",
                  cursor: "move",
                }}
                onMouseOver={() => {
                  if (disabled) {
                    this.setState({
                      disabled: false,
                    });
                  }
                }}
                onMouseOut={() => {
                  this.setState({
                    disabled: true,
                  });
                }}
              >
                {title}
              </div>
            ) : null
          }
          modalRender={(modal) => (
            <Draggable
              disabled={disabled}
              bounds={bounds}
              onStart={(event, uiData) => this.onStart(event, uiData)}
            >
              <div ref={this.draggleRef}>{modal}</div>
            </Draggable>
          )}
          wrapClassName={wrapClassName}
          bodyStyle={{
            ...otherProps.bodyStyle,
            maxHeight: this.bodyMaxHeight,
            overflowY: "auto",
          }}
          cancelText="取消"
          okText="确定"
        >
          {children}
        </Modal>
      </ConfigProvider>
    );
  }
}

function modal(config) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  let currentConfig = {
    ...config,
    onCancel: close,
    visible: true,
  };

  function close(...args) {
    currentConfig = {
      ...currentConfig,
      visible: false,
      afterClose: destroy.bind(this, ...args),
    };
    if (IS_REACT_16) {
      render(currentConfig);
    } else {
      destroy(...args);
    }
  }
  function update(newConfig) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    render(currentConfig);
  }
  function confirmLoading() {
    update({
      confirmLoading: true,
    });
  }
  function destroy(...args) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    const triggerCancel =
      args && args.length && args.some((arg) => arg && arg.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }
  }
  function render(props) {
    ReactDOM.render(<Mod {...props}>{props.content}</Mod>, div);
  }

  render(currentConfig);
  return {
    close,
    update,
    confirmLoading,
  };
}

export default modal;
