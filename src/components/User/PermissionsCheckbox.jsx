import React from 'react';
import CheckboxList from '../UI/CheckboxList';

export default function PermissionsCheckbox({
  value = [],
  onChange,
  dataSource,
}) {
  const options = makeData(dataSource);
  const values = makeValue(value);

  function makeData(data) {
    let result = {};
    data
      .filter((item) => !item.parentValue)
      .map((item) => {
        const children = data.filter((c) => c.parentValue === item.value);
        result[item.value] = [item, ...children];
      });
    return result;
  }

  function makeValue(value) {
    let result = {};
    Object.entries(options).map((item, index) => {
      const [key, itemOptions] = item;
      const itemValue = itemOptions
        .filter((o) => value.includes(o.value))
        .map((o) => o.value);
      result[key] = itemValue;
    });
    return result;
  }

  function handleChange(key, value) {
    const nextValue = Object.values({
      ...values,
      [key]: value,
    }).reduce((result, item) => {
      return [...result, ...item];
    }, []);
    onChange(nextValue);
  }

  return (
    <>
      {Object.entries(options).map((item, index) => {
        const [key, itemOptions] = item;
        return (
          <CheckboxList
            key={key}
            options={itemOptions}
            value={values[key]}
            onChange={(value) => handleChange(key, value)}
          />
        );
      })}
    </>
  );
}
