import { Table } from "antd";
import { useEffect, useState } from "react";
import TableExpand from "./TableExpand";

const TableData = ({ data }) => {
    const [selectedId, setSelectedId] = useState(0);
  const columns = [
    {
      title: "Mã HD",
      dataIndex: "id",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
    },
    {
      title: "Ngày trả",
      dataIndex: "refundDate",
    },
    {
      title: "Số lượng",
      dataIndex: "qty",
      align: "right",
      render: (val) => {
        return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
    },
    {
      title: "Chiết khấu",
      dataIndex: "totalDiscount",
      align: "right",
      render: (val) => {
        return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
    },
    {
      title: "Doanh số trước CK",
      dataIndex: "totalBeforeDiscount",
      align: "right",
      render: (val) => {
        return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
    },
    {
      title: "Doanh số sau CK",
      dataIndex: "totalPrice",
      align: "right",
      render: (val) => {
        return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      expandable={{
        expandedRowRender: (record) => <TableExpand record={record} />,
        // defaultExpandedRowKeys: [data.map((item) => item.id)],
        expandRowByClick: true,
        
      }}
    />
  );
};

export default TableData;
