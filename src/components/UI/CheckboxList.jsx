import React, { useState } from 'react';
import { Checkbox, Divider } from 'antd';
const CheckboxGroup = Checkbox.Group;

export default function CheckboxList({ options, value, onChange }) {
  const [firstOption, ...optionList] = options;
  const [firstValue, ...valueList] = value;

  function onCheckAllChange(e) {
    const nextValue = e.target.checked ? options.map((o) => o.value) : [];
    onChange(nextValue);
  }

  function onCheckChange(nextValueList) {
    let nextValue = [firstOption.value];

    if (nextValueList.length > 0) {
      nextValue = [firstOption.value, ...nextValueList];
    }

    onChange(nextValue);
  }

  return (
    <div style={{ paddingTop: 4, paddingBottom: 8 }}>
      <Checkbox onChange={onCheckAllChange} checked={!!firstValue}>
        {firstOption.label}
      </Checkbox>
      {optionList.length > 0 && (
        <div style={{ paddingLeft: 24, paddingTop: 4 }}>
          <CheckboxGroup
            options={optionList}
            value={valueList}
            onChange={onCheckChange}
          />
        </div>
      )}
    </div>
  );
}
