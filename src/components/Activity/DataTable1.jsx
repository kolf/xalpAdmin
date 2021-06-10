import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Row,
  Col,
  Space,
  Pagination,
  Select,
} from "antd";
import UpdateDataForm from "./UpdateData1Form";
import modal from "../../shared/modal";
import confirm from "../../shared/confirm";
import utils from "../../shared/utils";
import {
  activityStatusOptions,
  activityApplyStatusOptions,
} from "../../shared/options";
import activityService from "../../services/activity.service";
import dataService from "../../services/data.service";
const { Search } = Input;
const { Option } = Select;
const dateFormat = "YYYY-MM-DD";

export default function DataTable() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const [counter, setCounter] = useState(0);
  const [areaOptions, setAreaOptions] = useState([]);
  const [query, setQuery] = useState({
    skipCount: "1",
    maxResultCount: "10",
    keyword: "",
  });

  useEffect(() => {
    let mounted = true;
    loadData();
    if (areaOptions.length === 0) {
      loadAreaOptions();
    }

    async function loadData() {
      setLoading(true);
      try {
        const { items, totalCount } = await activityService.getActivityList(
          makeQuery(query)
        );

        if (mounted) {
          setLoading(false);
          setDataList(items);
          setTotal(totalCount);
        }
      } catch (error) {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    async function loadAreaOptions() {
      const res = await dataService.getAreaOptions({ level: 4 });
      const options = res.map((item) => ({
        value: item.code,
        label: item.name,
        isLeaf: false,
      }));
      if (mounted) {
        setAreaOptions(options);
      }
    }

    return () => {
      mounted = false;
    };
  }, [JSON.stringify(query), counter]);

  function makeData(data) {
    if (!data) {
      return [];
    }
    return data.map((item, index) => {
      return {
        ...item,
        index: index + 1,
      };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      if (query.skipCount) {
        result.skipCount = (query.skipCount - 1) * query.maxResultCount;
      }
      return result;
    }, {});
  }

  function showAddModal() {
    let modRef = null;
    const mod = modal({
      title: "新增",
      width: 960,
      style: { top: 20 },
      bodyStyle: { paddingBottom: 0, paddingLeft: 0 },
      content: (
        <UpdateDataForm
          areaOptions={areaOptions}
          saveRef={(r) => (modRef = r)}
        />
      ),
      onOk,
    });

    async function onOk() {
      const values = await modRef.validateFields();
      const res = await activityService.addActivity(makeParams(values));
      console.log(res, "res");
      mod.close();
      setCounter(counter + 1);
      setQuery({
        ...query,
        skipCount: "1",
      });
    }
  }

  function showEditModal(creds) {
    let modRef = null;
    const mod = modal({
      title: "编辑",
      width: 960,
      style: { top: 20 },
      bodyStyle: { paddingBottom: 0, paddingLeft: 0 },
      content: (
        <UpdateDataForm
          areaOptions={areaOptions}
          saveRef={(r) => (modRef = r)}
          defaultValues={creds}
        />
      ),
      onOk,
    });

    async function onOk() {
      const values = await modRef.validateFields();
      const res = await activityService.addActivity(makeParams(values));
      console.log(res, "res");
      mod.close();
      setCounter(counter + 1);
      setQuery({
        ...query,
        skipCount: "1",
      });
    }
  }

  function showViewModal(creds) {
    const mod = modal({
      title: "查看",
      width: 960,
      style: { top: 20 },
      bodyStyle: { paddingBottom: 0, paddingLeft: 0 },
      content: (
        <UpdateDataForm
          areaOptions={areaOptions}
          disabled
          defaultValues={creds}
        />
      ),
      footer: null,
    });
  }

  function showDeleteModal(creds) {
    const mod = confirm({
      content: `确认删除此条内容, 是否继续?`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await activityService.deleteActivity({
          id: creds.id,
        });
        mod.close();
        utils.success(`删除成功！`);
        setCounter(counter + 1);
        setQuery({ ...query, skipCount: "1" });
      } catch (error) {
        mod.close();
      }
    }
  }

  function showUpdateStatusModal(creds, value) {
    const mod = confirm({
      content: `确认${value ? "上架" : "下架"}此条活动, 是否继续?`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await activityService.updateActivityStatus({
          id: creds.id,
          changeToActive: value,
        });
        mod.close();
        utils.success(`${value ? "上架" : "下架"}成功！`);
        setCounter(counter + 1);
        setQuery({ ...query, skipCount: "1" });
      } catch (error) {
        mod.close();
      }
    }
  }

  function makeParams(values) {
    return Object.keys(values).reduce((result, key) => {
      const value = values[key];
      if (key === "date1" && value) {
        const [start, end] = value;
        result.startDate = start.format(dateFormat);
        result.endDate = end.format(dateFormat);
      } else if (key === "date2" && value) {
        const [start, end] = value;
        result.applyStartDate = start.format(dateFormat);
        result.applyDeadlineDate = end.format(dateFormat);
      } else if (key === "applyUserCount" && value) {
        const [min, max] = value;
        result.minApplyUserCount = min;
        result.maxApplyUserCount = max;
      } else if (key === "tude") {
        const [x, y] = value.split(/,，/);
        result.longitude = x;
        result.latitude = y;
      } else if (key === "provinceLevel" && value) {
        const [p, c, a] = value;
        result.regionProvinceName = p.label;
        result.regionProvinceCode = p.value;
        result.regionCityName = c.label;
        result.regionCityCode = c.value;
        result.regionAreaName = a.label;
        result.regionAreaCode = a.value;
      } else if (key === "tempPictureItems") {
        result.tempPictureItems = value.map((v) => v.response);
      } else if (/note|description/.test(key)) {
        // result[key] = value.toRAW();
        result[key] = "sdfsd";
      } else if (value !== undefined && value !== "-1") {
        result[key] = value;
      }
      return result;
    }, {});
  }

  const columns = [
    {
      title: "活动名称",
      dataIndex: "name",
    },
    {
      title: "举办地址",
      dataIndex: "address",
    },
    {
      title: "活动状态",
      dataIndex: "isActive",
      render(text) {
        return text || "未知";
      },
    },
    {
      title: "活动举办时间",
      dataIndex: "startDate",
    },
    {
      title: "报名状态",
      dataIndex: "stateName",
      render(text) {
        return text || "未知";
      },
    },
    {
      title: "报名起止时间",
      dataIndex: "applyStartDate",
      render(text) {
        return text || "无";
      },
    },
    {
      title: "最后操作人",
      dataIndex: "lastModifyUserName",
    },
    {
      title: "操作",
      dataIndex: "options",
      width: 230,
      fixed: "right",
      render(text, creds) {
        return (
          <div className="text-center">
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={(e) => showViewModal(creds)}
            >
              查看
            </Button>
            <Button
              size="small"
              style={{ marginRight: 4 }}
              onClick={(e) => showEditModal(creds)}
            >
              编辑
            </Button>
            {creds.isActive ? (
              <Button
                size="small"
                style={{ marginRight: 4 }}
                onClick={(e) => showUpdateStatusModal(creds, false)}
              >
                下架
              </Button>
            ) : (
              <Button
                size="small"
                style={{ marginRight: 4 }}
                onClick={(e) => showUpdateStatusModal(creds, false)}
              >
                上架
              </Button>
            )}

            <Button size="small" onClick={(e) => showDeleteModal(creds)}>
              删除
            </Button>
          </div>
        );
      },
    },
  ];

  const paginationProps = {
    showQuickJumper: true,
    showSizeChanger: true,
    current: query.skipCount * 1,
    pageSize: query.maxResultCount * 1,
    total,
    position: ["", "bottomCenter"],
    size: "small",
    onChange(pageNum, pageSize) {
      let nextPageNum = pageNum;
      if (pageSize != query.maxResultCount * 1) {
        nextPageNum = 1;
      }

      setQuery({
        ...query,
        skipCount: nextPageNum + "",
        maxResultCount: pageSize + "",
      });
    },
  };

  return (
    <div>
      <Row style={{ paddingBottom: 12 }}>
        <Col flex="auto"></Col>
        <Col flex="120px" style={{ textAlign: "right" }}>
          <Space>
            <Button size="small" type="primary" onClick={showAddModal}>
              新增
            </Button>
          </Space>
        </Col>
      </Row>
      <Form
        form={form}
        name="form"
        layout="inline"
        style={{ paddingBottom: 12 }}
        onFinish={(values) => setQuery({ ...query, ...values, skipCount: "1" })}
      >
        <Form.Item name="Status1" style={{ marginBottom: 6, width: 100 }}>
          <Select size="small" placeholder="活动状态" allowClear>
            {activityStatusOptions.map((o) => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Status2" style={{ marginBottom: 6, width: 100 }}>
          <Select size="small" placeholder="报名状态" allowClear>
            {activityApplyStatusOptions.map((o) => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="small">
            查询数据
          </Button>
        </Form.Item>
        <Form.Item style={{ marginLeft: "auto", marginRight: 0 }}>
          <Search
            size="small"
            placeholder="模糊搜索"
            allowClear
            onSearch={(value) =>
              setQuery({ ...query, skipCount: "1", keyword: value })
            }
          />
        </Form.Item>
      </Form>

      <Table
        rowKey="id"
        dataSource={makeData(dataList)}
        columns={columns}
        pagination={false}
        size="small"
        bordered
        loading={loading}
        scroll={{ x: 1600 }}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </div>
  );
}
