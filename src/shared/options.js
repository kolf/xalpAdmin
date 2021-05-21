const areaEnum = {
  1: "东部园区",
  2: "西部园区",
  3: "南部园区",
  4: "北部园区",
};

const deviceEnum = {
  1: "闸机",
  2: "手持机",
};

const onlineEnum = {
  1: "在线",
  2: "离线",
};

export const areaOptions = Object.keys(areaEnum).map((key) => ({
  value: key + "",
  label: areaEnum[key],
}));

export const deviceOptions = Object.keys(deviceEnum).map((key) => ({
  value: key + "",
  label: deviceEnum[key],
}));

export const onlineOptions = Object.keys(onlineEnum).map((key) => ({
  value: key + "",
  label: onlineEnum[key],
}));

export const yearOptions = Array.from({ length: 20 }, (item, i) => {
  const value = new Date().getFullYear() - i;
  return {
    value: value + "",
    label: value + "年",
  };
});

export const mouthOptions = Array.from({ length: 12 }, (item, i) => {
  const value = i + 1 + "";
  return {
    value,
    label: value + "月",
  };
});

export const dayOptions = Array.from({ length: 31 }, (item, i) => {
  const value = i + 1 + "";
  return {
    value,
    label: value + "日",
  };
});
