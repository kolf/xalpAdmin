const areaEnum = {
  1: "东部园区",
  2: "西部园区",
  3: "南部园区",
  4: "北部园区",
};

const activityActiveEnum = {
  1: "是",
  2: "否",
};

const deviceEnum = {
  1: "闸机",
  2: "手持机",
};

const onlineEnum = {
  1: "在线",
  2: "离线",
};

const deviceActiveEnum = {
  1: "启用",
  0: "停用",
};

const reviewEnum = {
  1: "有效期内",
  2: "已过期",
};

const merchantEnum = {
  1: "电子",
  2: "竞技",
  3: "公共",
  4: "其它",
};

export const checkDeviceTypeEnum = {
  1: "闸机",
  2: "手持机",
};

export const behaviorTypeEnum = {
  1: "A类（轻微，口头警告并记录）",
  2: "B类（中度，一个月禁止入园）",
  3: "C类（严重，三个月禁止入园）",
  4: "D类（恶劣，永久禁止入园）",
};

export const enterEnum = {
  0: "出口",
  1: "入口",
};

export const activityEnum = {
  1: "有",
  2: "无",
};

export const isFireModeOpenEnum = {
  1: "开启",
  0: "关闭",
};

export const orderChannelEnum = {
  5: "小程序",
  6: "官网",
  10: "小程序",
};

export const userStateEnum = {
  2: "正常",
  3: "过期",
};

export const checkModeEnum = {
  1: "纸质二维码",
  2: "电子二维码",
  4: "身份证",
  8: "IC卡",
  16: "人证核验",
  32: "人脸查找",
  64: "虹膜识别",
};

export const colors = [
  "#1890FF",
  "#13C2C2",
  "#2FC25B",
  "#FACC14",
  "#F04864",
  "#8543E0",
];

const activityReviewEnum = {
  1: "通过",
  2: "不通过",
};

const activityOrderReviewEnum = {
  0: "待审核",
  1: "审核通过",
  2: "审核不通过",
};

export const activityOrderStatusEnum = {
  0: "待审核",
  1: "审核通过",
  2: "审核不通过",
  3: "已出票",
  4: "已取消",
};

export const activityOrderAuditStatusEnum = {
  0: "审核中",
  1: "报名成功",
  2: "报名失败",
};

const activityStatusEnum = {
  1: "已上架",
  2: "已下架",
};

const activityApplyStatusEnum = {
  1: "未开始",
  2: "报名中",
  3: "已结束",
};

export const isFireModeOpenOptions = Object.keys(isFireModeOpenEnum).map((key) => ({
  value: key + "",
  label: isFireModeOpenEnum[key],
}));

export const activityActiveOptions = Object.keys(activityActiveEnum).map(
  (key) => ({
    value: key + "",
    label: activityActiveEnum[key],
  })
);

export const activityOrderReviewOptions = Object.keys(
  activityOrderReviewEnum
).map((key) => ({
  value: key + "",
  label: activityOrderReviewEnum[key],
}));

export const activityStatusOptions = Object.keys(activityStatusEnum).map(
  (key) => ({
    value: key + "",
    label: activityStatusEnum[key],
  })
);

export const activityApplyStatusOptions = Object.keys(
  activityApplyStatusEnum
).map((key) => ({
  value: key + "",
  label: activityApplyStatusEnum[key],
}));

export const userStatusOptions = Object.keys(userStateEnum).map((key) => ({
  value: key + "",
  label: userStateEnum[key],
}));

export const activityOptions = Object.keys(activityEnum).map((key) => ({
  value: key + "",
  label: activityEnum[key],
}));

export const enterOptions = Object.keys(enterEnum).map((key) => ({
  value: key + "",
  label: enterEnum[key],
}));

export const behaviorTypeOptions = Object.keys(behaviorTypeEnum).map((key) => ({
  value: key + "",
  label: behaviorTypeEnum[key],
}));

export const deviceActiveOptions = Object.keys(deviceActiveEnum).map((key) => ({
  value: key + "",
  label: deviceActiveEnum[key],
}));

export const checkDeviceTypeOptions = Object.keys(checkDeviceTypeEnum).map(
  (key) => ({
    value: key + "",
    label: checkDeviceTypeEnum[key],
  })
);

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

export const reviewOptions = Object.keys(reviewEnum).map((key) => ({
  value: key + "",
  label: reviewEnum[key],
}));

export const activityReviewOptions = Object.keys(activityReviewEnum).map(
  (key) => ({
    value: key + "",
    label: activityReviewEnum[key],
  })
);

export const merchantOptions = Object.keys(merchantEnum).map((key) => ({
  value: key + "",
  label: merchantEnum[key],
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
