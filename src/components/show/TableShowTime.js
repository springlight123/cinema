import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Select,
  Badge,
  Tag,
  message,
  Form,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  PlusSquareFilled,
  UserAddOutlined,
  ToolOutlined,
  DeleteOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import showApi from "../../api/showApi";
import showTimeApi from "../../api/showTimeApi";
import moment from "moment/moment";

import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import movieApi from "../../api/movieApi";
import { useRoleHook } from "../../utils/useRoleHook.js";

const TableShowTime = ({ record }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listShow, setListShow] = useState([]);
  const [records, setRecord] = useState({});
  const [listShowTime, setListShowTime] = useState([]);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
  const [timePicked, setTimePicked] = useState([]);
  const [listTime, setListTime] = useState([]);

  const newDateFormat = "YYYY-MM-DD";
  const currentDate = moment().format(newDateFormat);

  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);

  const [form] = Form.useForm();

  const {isEmployee} = useRoleHook()

  const columns = [
    {
      title: "Ngày chiếu",
      dataIndex: "showDate",
    },
    {
      title: "Giờ chiếu",
      dataIndex: "showTime",
      render: (val) => {
        return val.map((item, index) => {
          let color = "";
          const timeCheck = moment(item, "HH:mm");

          if (
            timeCheck.isBetween(
              moment("06:00", "HH:mm"),
              moment("12:00", "HH:mm")
            )
          ) {
            color = "volcano";
          } else if (
            timeCheck.isBetween(
              moment("12:00", "HH:mm"),
              moment("18:00", "HH:mm")
            )
          ) {
            color = "green";
          } else if (
            timeCheck.isBetween(
              moment("18:00", "HH:mm"),
              moment("24:00", "HH:mm")
            )
          ) {
            color = "geekblue";
          }
          return (
            <Tag color={color} key={index}>
              {item}
            </Tag>
          );
        });
      },
    },
    {
      dataIndex: "id",
      render: (val, rc) => {
        if(isEmployee) return null;
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <Button
                title="Xem chi tiết"
                icon={<EyeOutlined />}
                onClick={() => showModalDetail()}
              ></Button> */}
              <Button
                disabled={record.status === 1 ? true : false}
                style={{
                  marginLeft: "10px",
                }}
                onClick={() => {
                  setIsModalOpenDelete(true);
                  // setIdPriceLine(record.id);
                  setRecord(rc);

                }}
                danger
                icon={<MinusCircleOutlined color="red" />}
              ></Button>
            </div>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchShowTimeByShowId = async () => {
      const response = await showTimeApi.getShowTimeByShowId(record.id);
      let data = [];
      if (response) {
        for (const index in response) {
          console.log(response[index]);
          data.push({
            id: response[index][0].id,
            showDate: index,
            showTime: response[index].map((item, index) => {
              return item.showTime;
            }),
            status: response[index][0].status,
          });
        }
      }
      setListShowTime(data);
    };

    fetchShowTimeByShowId();
  }, [record.id, reload]);

  const onSelectChange = (selectedId) => {
    setSelectedRowKeys(selectedId);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  const selectedOne = selectedRowKeys.length === 1;

  //handle delete customer in here...
  const handleDelete = () => {
    showModal();
  };

  //handle update customer in here ....
  const handleUpdate = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  ///
  //model
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);

    //handle code for log out in here

    ////////
  };

  const showModalDetail = () => {
    setIsModalOpenDetail(true);
    const fetchShowTimeByShowId = async () => {
      const res = await showTimeApi.getTimeByShowIdAndDate(
        record.id,
        records.showDate
      );
      if(res) {
        res.map((item) => {
          console.log(item.ShowTime.id);
          return setTimePicked(item.ShowTime.id);
        });
      }
    };
    fetchShowTimeByShowId();
  };
  console.log("timePicked", timePicked);

  // useEffect(() => {
  //   const fetchShowTimeByShowId = async () => {
  //     try {
  //       const response = await showTimeApi.getListShowTime();
  //       const { duration } = await movieApi.getMovieById(record.idMovie);
  //       if (response) {
  //         let arrTime = [];
  //         for (let i = 0; i < response.length; i++) {
  //           const options = {
  //             value: response[i].id,
  //             label: response[i].showTime,
  //           };
  //           arrTime.push(options);
  //         }
  //         console.log("timePicked", timePicked);
  //         const timePic = timePicked[timePicked.length - 1];
  //         const index = arrTime.findIndex((item) => item.value === timePic);
  //         console.log("index--", index);
  //         if (index !== -1) {
  //           for (let i = 0; i < arrTime.length; i++) {
  //             if (i < index && !timePicked.includes(arrTime[i].value)) {
  //               arrTime[i].disabled = true;
  //             } else {
  //               if (arrTime[i + 1]) {
  //                 const betweenTime = Math.abs(
  //                   moment(arrTime[index].label, "HH:mm").diff(
  //                     moment(arrTime[i + 1].label, "HH:mm"),
  //                     "minutes"
  //                   )
  //                 );
  //                 if (betweenTime < duration) {
  //                   arrTime[i + 1].disabled = true;
  //                 }
  //               }
  //             }
  //           }
  //         }
  //         setListTime(arrTime);
  //       }
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   };
  //   if(isModalOpenDetail) { 
  //     fetchShowTimeByShowId();
  //   }
  // }, [ record.id, records.showDate]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOkDelete = async () => {
    setIsModalOpenDelete(false);
    console.log(records);
    try {
      const res = await showTimeApi.deleteShowTime(record.id, records.showDate);
      console.log(res);
      if (res) {
        message.success("Xóa thành công");
        depatch(setReload(!reload));
      }
    } catch (error) {
      console.log(error);
      message.error("Suất chiếu này đã có người đặt vé, không thể xóa");
    }
  };

  const handleOkDetail = () => {
    setIsModalOpenDetail(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleCancelDetail = () => {
    setIsModalOpenDetail(false);
  };

  const onChangeTime = async (value) => {
    setTimePicked(value);
  };

  return (
    <div
      style={{
        width: "80%",
        margin: "0 auto",
      }}
    >
      <Table columns={columns} dataSource={listShowTime} pagination={false} />

      <Modal
        title="Xoá ngày chiếu khỏi lịch chiếu"
        open={isModalOpenDelete}
        onOk={handleOkDelete}
        onCancel={handleCancelDelete}
        footer={[
          <Button key="back" onClick={handleCancelDelete}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkDelete} danger>
            Xác nhận
          </Button>,
        ]}
      >
        <p>Bạn có chắc muốn xóa ngày chiếu khỏi lịch chiếu không?</p>
      </Modal>
      <Modal
        title="Cập nhật ngày chiếu"
        
        open={isModalOpenDetail}
        onOk={handleOkDetail}
        onCancel={handleCancelDetail}
        width={700}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary">
            Cập nhật
          </Button>,
        ]}
      >
        <>
          <Row gutter={16}>
            <Col span={24}>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Chọn giờ chiếu"
                value={timePicked}
                onChange={onChangeTime}
                options={listTime}

                // onChange={handleChange}
              >
                {/* {listTime.map((item, index) => {
                    return (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    );
                  })} */}
              </Select>
            </Col>
          </Row>
        </>
      </Modal>
    </div>
  );
};
export default TableShowTime;
