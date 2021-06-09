import React, { useState, useEffect } from "react";
import { Cascader } from "antd";
import dataService from "../../services/data.service";
export default function AreaSelect({ defaultOptions, value, onChange }) {
  const [options, setOptions] = useState(defaultOptions);
  function handleChange() {}

  async function loadData(selectedOptions) {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const res = await dataService.getAreaOptions({ leval: 2, parentCode: 0 });
    console.log(res, "res");

    // // load options lazily
    // setTimeout(() => {
    //   targetOption.loading = false;
    //   targetOption.children = [
    //     {
    //       label: `${targetOption.label} Dynamic 1`,
    //       value: 'dynamic1',
    //     },
    //     {
    //       label: `${targetOption.label} Dynamic 2`,
    //       value: 'dynamic2',
    //     },
    //   ];
    //   setOptions([...options]);
    // }, 1000);
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
