import React from "react";
import { Table, Divider } from "antd";
const columns = [
  {
    title: "STT",
    dataIndex: "key",
  },
  {
    title: "Mã phim",
    dataIndex: "codeMovie",
  },
  {
    title: "Tên phim",
    dataIndex: "nameMovie",
  },
  {
    title: "Thể loại",
    dataIndex: "category",
  },
  {
    title: "Doanh thu",
    dataIndex: "totalPrice",
    render:(val) => {
      return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ"
    }
  },
];

const columnsCus = [
  {
    title: "STT",
    dataIndex: "key",
    width: "3%",
  },
  {
    title: "Mã KH",
    dataIndex: "code",
    width: "18%",
  },
  {
    title: "Tên khách hàng",
    dataIndex: "name",
    width: "35%",
  },
  {
    title: "Rank",
    dataIndex: "rank",
    width: "20%",
  },
  {
    title: "Tổng tiền",
    dataIndex: "totalPrice",
    width: "20%",
    render:(val) => {
      return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ"
    }
  }
];

const TableTopMovie = ({ title, data }) => (
  <>
    <Divider>{title}</Divider>
    <Table columns={columns} dataSource={data} size="middle" pagination={false} />
  </>
);

const TableTopCus = ({ title, data }) => (
  <>
    <Divider>{title}</Divider>
    <Table columns={columnsCus} dataSource={data} size="middle" pagination={false}/>
  </>
);
export { TableTopMovie, TableTopCus };
