import { Table } from "antd";
import { useEffect, useState } from "react";
import statitisApi from "../../../api/statitisApi";

const TableExpand = ({record}) => {
    const [data, setData] = useState([]);

    
    const columns = [
        {
            title: 'Mã SP',
            dataIndex: 'id',
        },
        {
            title: 'Tên SP',
            dataIndex: 'name',
        },
        {
            title: 'Loại SP',
            dataIndex: 'type',
            render: (val) => {
                if (val === 'Ghe') return 'Ghế';
                if (val === 'SP') return 'Sản phẩm';
            }
        },
        {
            title: 'Loại ghế',
            dataIndex: 'seatType',
            render: (val) => {
                if (val === 3) return 'Vip';
                if (val === 1) return 'Thường';
            }
        },
        {
            title: 'Số lượng',
            dataIndex: 'amount',
        },
        {
            title: 'Tiền hoàn',
            dataIndex: 'total',
            render: (val) => {
                return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        },
        
    ];

    useEffect(() => {
        const fetchDetail = async () => {
            const res = await statitisApi.getRefundDetail(record.id);
            console.log(res);
            if (res) {
                const newLs = res.map((item, index) => {
                    return {
                        id: item.Product.id,
                        name: item.Product.productName,
                        type: item.Product.type,
                        seatType: item.Product.typeSeat,
                        amount: item.amount,
                        total: item.total,
                    }
                });
                setData(newLs);
            }
        };
        fetchDetail();
    }, [record.id]);

    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
        />
    );
}

export default TableExpand;