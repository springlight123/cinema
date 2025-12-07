import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Upload,
  Typography,
  Tag,
  Table,
  Breadcrumb,
  Badge,
  message,
} from "antd";

import {
  PlusOutlined,
  UploadOutlined,
  EyeOutlined,
  ExportOutlined,
  MinusCircleOutlined
} from "@ant-design/icons";
import ModelAddPromoLine from "./ModelAddPromoLine";
import promotionApi from "../../api/promotionApi";
import moment from "moment";
import rankApi from "../../api/rankApi";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import dayjs from "dayjs";
import promotionRsApi from "../../api/promotionRs";
import { VND } from "../../constant";
import { yupSync } from "./useModelAddPromotionHeaderHook";
import ModelPromtionLineDetail from "./ModelPromtionLineDetail";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const IndexLinePromotion = ({ setTab }) => {
  const [showModalAddCustomer, setShowModalAddCustomer] = useState(false);
  const [ranks, setRanks] = useState([]);
  const [rankPicked, setRankPicked] = useState([]);
  const [newRankPicked, setNewRankPicked] = useState([]);
  const [listPromotionLine, setPromotionLine] = useState([]);
  const [promotionHeader, setPromotionHeader] = useState(null);
  const idHeaderPromotion = useSelector((state) => state.promotionHeaderId);
  const [promotionRs, setPromotionRs] = useState([]);

  const [changeImage, setChangeImage] = useState(false);


  const [startDateDb, setStartDateDb] = useState("");
  const [endDateDb, setEndDateDb] = useState("");
  const [statusDb, setStatusDb] = useState(0);

  const [form] = Form.useForm();

  const newDateFormat = "YYYY-MM-DD";
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const currentDate = moment().format(newDateFormat);

  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);

  const [isShowModelDetail, setIsShowModelDetail] = useState(false);

  const [isModalOpenDel, setIsModalOpenDel] = useState(false);
  const [idLine, setIdLine] = useState(0);

  const [endDateMax, setEndDateMax] = useState("");

  const [isInvalidDate, setIsInvalidDate] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalMoneyProUsed, setTotalMoneyProUsed] = useState(0);
  const [idPromotionLine, setIdPromotionLine] = useState(null);
  const handleOnclik = (id) => {
    setIdPromotionLine(id);
    setIsShowModelDetail(true);
  };
  const columns = [
    {
      title: "Mã Code",
      dataIndex: "promotionCode",
      key: "promotionCode",
      render: (text, record) => (
        <a
          style={{ textTransform: "capitalize" }}
          onClick={() => handleOnclik(record.id)}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Miêu tả",
      dataIndex: "desc",
      key: "age",
    },
    {
      title: "Loại khuyến mãi",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let text;
        if (type === "1") {
          text = "Tặng quà";
        } else if (type === "2") {
          text = "Giảm giá";
        } else if (type === "3") {
          text = "Chiết khấu";
        }
        return text;
      },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => {
        return dayjs(startDate).format(newDateFormat);
      },
    },
    {
      title: "Ngày kết thức",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => {


        return dayjs(endDate).format(newDateFormat);
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (status) => {
        let color = "green";
        let text = "Hoạt động";
        if (status === 1) {
          color = "success";
          text = "Hoạt động";
        }
        if (status === 0) {
          color = "error";
          text = "Ngừng hoạt động";
        }
        return (
          <Tag color={color} key={text}>
            {text.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      dataIndex: "action",
      render: (text, record) => (
        <>
          {currentDate > startDate && (
            <Space>
              <Button
                title="Kết quả khuyến mãi"
                icon={<EyeOutlined />}
                onClick={() => showModal(record.id)}
              ></Button>
            </Space>
          )}
          <Button
            disabled={ statusDb === 0 && moment(record.startDate).format(newDateFormat) >  currentDate ? false : true}
            style={{
              marginLeft: "10px",
            }}
            onClick={() => {
              showModalDel()
              setIdLine(record.id)
            }}
            danger
            icon={<MinusCircleOutlined color="red" />}
          ></Button>
        </>
      ),
    },
  ];
  const columnsRs = [
    {
      title: "Mã Code",
      dataIndex: "promotionCode",
    },
    {
      title: "Ngày áp dụng",
      dataIndex: "dateUsed",
    },
    {
      title: "Mã hóa đơn",
      dataIndex: "billCode",
    },
    {
      title: "Tiền khuyến mãi",
      dataIndex: "discount",
      render: (discount) => {
        return (discount = discount
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (status) => {
        let color;
        let text;
        if (status === 1) {
          color = "green";
          text = "Thành công";
        } else {
          color = "red";
          text = "Hủy";
        }
        return (
          <Tag color={color} key={text}>
            {text}
          </Tag>
        );
      },
    },
  ];

  const showModal = async (id) => {
    setIsModalOpen(true);
    try {
      const response = await promotionRsApi.getByPromotionLineId(id);
      if (response) {
        const promotionApply = response.filter((item) => item.status === 1);
        const totalMoney = promotionApply.reduce((total, item) => {
          return total + item.moneyDiscount;
        }, 0);
        setTotalMoneyProUsed(totalMoney);

        const newList = response.map((item) => {
          return {
            promotionCode: item.PromotionLine.promotionCode,
            desc: item.PromotionLine.desc,
            type: item.PromotionLine.type,
            dateUsed: moment(item.dateUsed).format("DD/MM/YYYY HH:mm "),
            billCode: item.idOrder,
            discount: item.moneyDiscount,
            status: item.status,
            budget: item.PromotionLine.budget,
          };
        });
        setPromotionRs(newList);
      }
    } catch (error) {
      console.log("Failed to login ", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancelDel = () => {
    setIsModalOpenDel(false);
  };

  const handleDel = () => {
    setIsModalOpenDel(false);
    const deleteLine = async () => {
      try {
        const rs = await promotionApi.deleteLine(idLine);
        if (rs) {
          message.success("Xóa thành công");
          depatch(setReload(!reload));
        }
      } catch (error) {
        console.log("Failed to login ", error);
        message.error("Xóa thất bại");
      }

    };
    deleteLine();
  };

  const showModalDel = () => {
    setIsModalOpenDel(true);
  };

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    let color;
    if (label === "START") {
      color = "green";
    } else if (label === "GOLD") {
      color = "gold";
    } else if (label === "DIAMOND") {
      color = "blue";
    } else if (label === "ANONYMOUS") {
      color = "geekblue";
    }
    return (
      <Tag
        color={color}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  const handleChangeRank = (value) => {
    setNewRankPicked(value);
  };

  const handleOpenModel = () => {
    setShowModalAddCustomer(true);
  };

  //change position
  const handleChangePosition = (value) => {
    console.log(`selected ${value}`);
  };

  const onChangeDate = (date, dateString) => {
    if (dayjs(dateString[1]).format('YYYY-MM-DD') < dayjs(endDateMax).format('YYYY-MM-DD')) {
      setIsInvalidDate(true);
      return;
    } else {
      setIsInvalidDate(false);
    }
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  };

  const handleSubmit = async (val) => {
    const data = new FormData();
    data.append("namePromotion", val.namePromotion);
    data.append("desc", val.desc);
    data.append("startDate", startDate);
    data.append("endDate", endDate);
    data.append("statusPromotion", val.statusPromotion);
    if (newRankPicked.length > 0) {
      newRankPicked.forEach((rank) => {
        data.append("rank", rank);
      });
    } else {
      rankPicked.forEach((rank) => {
        data.append("rank", rank?.value);
      });
    }

    if (val?.image[0]?.originFileObj) {
      data.append("image", val.image[0].originFileObj);
    } else if (val.image.length === 0) {
      data.append("image", []);
    }

    try {
      const response = await promotionApi.updatePromotionHeader(
        data,
        idHeaderPromotion
      );
      if (response) {
        depatch(setReload(!reload));
        message.success("Cập nhật thành công");
        setTab(0);
      }
    } catch (error) {
      console.log("Failed to login ", error);
    }
  };

  useEffect(() => {
    //load movies
    const getPromotionLineByHeader = async (id) => {
      try {
        const response = await promotionApi.getPromotionLineByHeader(id);

        if (response) {
          //handle data
          const newList = response.map((item) => {
            return item;
          });
          setPromotionLine(newList);
          const endDates = newList.map((item) => item.endDate )
          const maxDate = moment(
            Math.max(
              ...endDates.map((item) => {
                return moment(item, "YYYY-MM-DD");
              })
            )
          ).format("YYYY-MM-DD");
          setEndDateMax(maxDate);
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };

    const fetchRanks = async () => {
      const rs = await rankApi.getRanks();
      if (rs) {
        const options = rs.map((rank) => {
          return {
            label: rank.nameRank,
            value: Number(rank.id),
          };
        });
        setRanks(options);
      }
    };

    //load movies
    const getPromotionHeaderById = async (id) => {
      try {
        const response = await promotionApi.getPromotionHeaderById(id);
        if (response) {
          const ranksRes = response.ranks.map((rank) => {
            return {
              label: rank.rank.nameRank,
              value: Number(rank.rank.id),
            };
          });
          setRankPicked(ranksRes);
          setStartDateDb(response.startDate);
          setEndDateDb(response.endDate);
          setStatusDb(response.statusPromotion);
          setStartDate(response.startDate);
          setEndDate(response.endDate);

          form.setFieldsValue({
            id: response.id,
            promotionCode: response.promotionCode,
            namePromotion: response.namePromotion,
            desc: response.desc,
            startDate: dayjs(response.startDate, newDateFormat),
            endDate: dayjs(response.endDate, newDateFormat),
            statusPromotion: response.statusPromotion ? "1" : "0",
            date: [
              dayjs(response.startDate, newDateFormat),
              dayjs(response.endDate, newDateFormat),
            ],
            image: [
              {
                uid: "-1",
                name: response.image,
                status: "done",
                url: response?.image,
              },
            ],
            rankCustomer: ranksRes,
          });
          setPromotionHeader(response);
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };

    fetchRanks();
    getPromotionLineByHeader(idHeaderPromotion);
    getPromotionHeaderById(idHeaderPromotion);
  }, [reload]);

  const handleRouter = (value) => {
    setTab(0);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };


  return (
    <div className="site-card-wrapper" style={{ minWidth: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Breadcrumb style={{ marginBottom: "1rem", marginTop: "1rem" }}>
          <Breadcrumb.Item>
            <a onClick={handleRouter}>Chương trình khuyến mãi</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Chỉnh sửa</Breadcrumb.Item>
        </Breadcrumb>

        <Button
          type="primary"
          form="myFormPro"
          htmlType="submit"
          style={{
            marginBottom: "1rem",
            marginTop: "1rem",
            marginRight: "1rem",
          }}
        >
          Cập nhật
        </Button>
      </div>
      <Form
        id="myFormPro"
        style={{
          background: "white",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
        onFinish={handleSubmit}
        form={form}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="id" hidden={true}>
              <Input />
            </Form.Item>
            <Form.Item
              name="promotionCode"
              label="Mã CT Khuyến mãi"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="namePromotion"
              label="Tên CT Khuyến mãi"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập tên CT khuyến mãi...",
                },
              ]}
            >
              <Input
                disabled={statusDb === 1 ? true : false}
                placeholder="Hãy nhập tên CT khuyến mãi..."
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Thời gian hoạt động"
              name="date"
              rules={[
                {
                  required: true,
                  message: "Hãy chọn thời gian hoạt động...",
                },
                {
                  validator: (_, value) => {
                    if (value) {
                      if (isInvalidDate) {
                        return Promise.reject(
                          new Error("Ngày kết thúc phải lớn hơn ngày kết thúc của dòng khuyến mãi")
                        );
                      } else {
                        return Promise.resolve();
                      }
                    }
                  }
                }
              ]}
            >
              <RangePicker
                disabled={
                  statusDb === 1
                    ? true
                    : false || [
                        moment().diff(moment(startDate), "seconds") > 0
                          ? true
                          : false,
                        false,
                      ]
                }
                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                onChange={onChangeDate}
                disabledDate={(current) => {
                  return current && current < moment().endOf("day")
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="image"
              label="Hình ảnh"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra="Chỉ chấp nhận file ảnh có dạng .jpg, .jpeg, .png"
              type="file"
            >
              <Upload
                disabled={statusDb === 1 ? true : false}
                style={{ fontSize: "0.2rem" }}
                name="logo"
                customRequest={dummyRequest}
                listType="picture"
                maxCount={1}
                accept=".jpg,.jpeg,.png"
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="statusPromotion"
              label="Trạng thái"
              rules={[
                {
                  required: true,
                  message: "Hãy chọn trạng thái...",
                },
              ]}
            >
              <Select
                placeholder="Chọn trạng thái"
                style={{
                  width: "100%",
                }}
                onChange={handleChangePosition}
                options={[
                  {
                    value: "0",
                    label: "Ngưng hoạt động",
                  },
                  {
                    value: "1",
                    label: "Hoạt động",
                  },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="rankCustomer" label="Nhóm khách hàng áp dụng">
              <Select
                disabled={
                  currentDate > startDate || statusDb === 1 ? true : false
                }
                placeholder="Chọn nhóm khách hàng áp dụng"
                style={{
                  width: "100%",
                }}
                mode="multiple"
                showArrow
                tagRender={tagRender}
                onChange={handleChangeRank}
                options={ranks}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="desc" label="Mô tả CTKM">
              <TextArea
                disabled={statusDb === 1 ? true : false}
                rows={4}
                placeholder="Nhập chi tiết CTKM"
                // maxLength={6}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {/* table */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <Space>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Dòng khuyến mãi
            </span>
          </Space>
          {statusDb === 0 && currentDate < endDateDb ? (
            <Button
              type="primary"
              onClick={() => handleOpenModel()}
              style={{
                marginRight: "1rem",
                marginBottom: "1rem",
                width: "100px",
              }}
            >
              Thêm
            </Button>
          ) : null}
        </div>
        <Table columns={columns} dataSource={listPromotionLine} />
      </div>
      <Modal
        title="Kết quả khuyến mãi"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Thoát
          </Button>,
          <Button
            type="primary"
            style={{ background: "green" }}
            onClick={handleOk}
          >
            Xuất Excel
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={24}>
              <Table
                columns={columnsRs}
                dataSource={promotionRs}
                footer={() => {
                  return (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            marginRight: "30px",
                            marginBottom: "10px",
                          }}
                        >
                          Tổng Ngân sách:{" "}
                        </span>
                        <span style={{ fontWeight: "bold" }}>
                          {VND.format(promotionRs[0]?.budget || 0)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            marginRight: "30px",
                            marginBottom: "10px",
                          }}
                        >
                          Sử dụng:{" "}
                        </span>
                        <span style={{ fontWeight: "bold" }}>
                          {VND.format(totalMoneyProUsed)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ fontWeight: "bold" }}>Còn lại: </div>
                        <div style={{ fontWeight: "bold", color: "green" }}>
                          {VND.format(
                            promotionRs[0]?.budget - totalMoneyProUsed || 0
                          )}
                        </div>
                      </div>
                    </>
                  );
                }}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        title="Xóa dòng khuyến mãi"
        open={isModalOpenDel}
        onCancel={handleCancelDel}
        footer={[
          <Button key="back" onClick={handleCancelDel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" danger onClick={handleDel}>
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn muốn xóa dòng khuyến mãi này không?</p>
      </Modal>


      {showModalAddCustomer ? (
        <ModelAddPromoLine
          showModalAddCustomer={showModalAddCustomer}
          setShowModalAddCustomer={setShowModalAddCustomer}
          startDateDb={startDateDb}
          endDateDb={endDateDb}
          idHeaderPromotion={idHeaderPromotion}
        />
      ) : null}
      {isShowModelDetail ? (
        <ModelPromtionLineDetail
          idPromotionLine={idPromotionLine}
          setIdPromotionLine={setIdPromotionLine}
          isShowModelDetail={isShowModelDetail}
          setIsShowModelDetail={setIsShowModelDetail}
          endDateHeader={endDate}
          statusDb={statusDb}
          startDateDb={startDateDb}
          endDateDb={endDateDb}
        />
      ) : null}
    </div>
  );
};
export default IndexLinePromotion;
