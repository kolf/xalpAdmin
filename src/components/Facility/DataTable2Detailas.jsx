import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input, Pagination } from "antd";
import confirm from "../../shared/confirm";
import utils from "../../shared/utils";
import facilityService from "../../services/faciliy.service";
const { Search } = Input;
export default function DataTable({ dataSource, showType }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  const [counter, setCounter] = useState(0);
  const [query, setQuery] = useState({
    skipCount: "1",
    maxResultCount: "10",
    Keyword: "",
  });

  useEffect(() => {
    loadData();
  }, [JSON.stringify(query), counter]);

  async function loadData() {
    setLoading(true);
    try {
      const { items, totalCount } = await facilityService.getOrderDetailList(
        makeQuery(query)
      );
      setLoading(false);
      setDataList(items);
      setTotal(totalCount);
    } catch (error) {
      console.log(error, "error");
      setLoading(false);
    }
  }

  function makeData(data) {
    if (!data) {
      return [];
    }
    return data.map((item, index) => {
      return { ...item.orderDetail, orderDetail: undefined, index: index + 1 };
    });
  }

  function makeQuery(query) {
    return Object.keys(query).reduce(
      (result, key) => {
        const value = query[key];
        if (value !== undefined && value !== "-1") {
          result[key] = value;
        }
        if (key === "isOnline" && value) {
          result[key] = value === "1";
        }
        if (query.skipCount) {
          result.skipCount = (query.skipCount - 1) * query.maxResultCount;
        }
        return result;
      },
      {
        OrderId: dataSource.id,
      }
    );
  }

  function showDeleteModal(creds) {
    const mod = confirm({
      content: `此操作将取消该票, 是否继续?`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await facilityService.cancelOrder({ id: creds.id });
        mod.close();
        utils.success(`取消成功！`);
        setCounter(counter + 1);
        setQuery({ ...query, skipCount: "1" });
      } catch (error) {
        mod.close();
      }
      // mod.close()
    }
  }

  function showReviewModal(creds) {
    const mod = confirm({
      content: `此操作将核销该票, 是否继续?`,
      onOk,
    });
    async function onOk() {
      try {
        const res = await facilityService.checkOrder({ id: creds.id });
        mod.close();
        utils.success(`核销成功！`);
        setCounter(counter + 1);
        setQuery({ ...query, skipCount: "1" });
      } catch (error) {
        mod.close();
      }
    }
  }

  function makeColumns() {
    let columns = [
      {
        title: "序号",
        dataIndex: "index",
        width: 60,
        render(text) {
          return text || "无";
        },
      },
      {
        title: "参观人姓名",
        dataIndex: "name",
      },
      {
        title: "电话",
        dataIndex: "phone",
      },
      {
        title: "身份证",
        dataIndex: "certNumber",
        render(text) {
          return text || "未知";
        },
      },
      {
        title: "客源地",
        dataIndex: "regionProvinceName",
        render(text) {
          return text || "无";
        },
      },
    ];
    if (/(REVIEW|CANCEL)/.test(showType)) {
      columns.push({
        title: "操作",
        dataIndex: "options",
        fixed: "right",
        width: 80,
        render(text, creds) {
          return (
            <div className="text-center">
              {showType === "CANCEL" ? (
                <Button size="small" onClick={(e) => showDeleteModal(creds)}>
                  取消
                </Button>
              ) : (
                <Button size="small" onClick={(e) => showReviewModal(creds)}>
                  核销
                </Button>
              )}
            </div>
          );
        },
      });
    }
    return columns;
  }

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
    <>
      <Form
        form={form}
        name="form"
        layout="inline"
        style={{ paddingBottom: 12 }}
        onFinish={(values) => {
          setQuery({
            ...query,
            ...values,
            skipCount: "1",
          });
        }}
      >
        <Form.Item style={{ marginLeft: "auto", marginRight: 0 }}>
          <Search
            size="small"
            placeholder="模糊搜索"
            onSearch={(value) =>
              setQuery({ ...query, skipCount: "1", Keyword: value })
            }
          />
        </Form.Item>
      </Form>
      <Table
        rowKey="id"
        dataSource={makeData(dataList)}
        columns={makeColumns()}
        pagination={false}
        size="small"
        bordered
        loading={loading}
      />
      <div className="page-container">
        <Pagination {...paginationProps} />
      </div>
    </>
  );
}
