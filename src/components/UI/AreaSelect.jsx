import React, { useState, useEffect } from "react";
import { Cascader } from "antd";
import dataService from "../../services/data.service";

const levelMap = {
  1: 3,
  2: 2,
};

export default function AreaSelect({ defaultOptions, value, onChange }) {
  const [options, setOptions] = useState(defaultOptions);
  function handleChange(selected, selectedOptions) {
    onChange(selectedOptions);
  }

  async function loadData(selectedOptions) {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const level = selectedOptions.length;
    targetOption.loading = true;
    const res = await dataService.getAreaOptions({
      level: levelMap[level],
      parentCode: targetOption.value,
    });
    targetOption.loading = false;
    targetOption.children = res.map((item) => ({
      value: item.code,
      label: item.name,
      isLeaf: level === 2,
    }));
    setOptions([...options]);
  }

  return (
    <Cascader
      options={options}
      onChange={handleChange}
      loadData={loadData}
      changeOnSelect
      placeholder="请选择"
    />
  );
}
