import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Col,
  Row,
  Typography,
  Tooltip,
  Space,
} from "antd";
import "./LoginForm.scss";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import userApi from "../../api/userApi";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/actions";
import { useNavigate } from "react-router-dom";
import tokenService from "../../service/token.service";
import { notifyError } from "../../utils/Notifi";
import { ToastContainer } from "react-toastify";
import SuccesFormPage from "./SuccesFormPage";
import { handleResetPassword } from "../../services/AuthService";

const { Title, Text } = Typography;
export default function ResetPassword() {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [messErro, setMessErro] = useState("");
  const [isSuccess, setIsSucess] = useState(false)

  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")

  const setOnChangeUserName = (e) => {
    setUserName(e.target.value);
  };
  const setOnChangePass = (e) => {
    setPassword(e.target.value);
  };

  //handle submit to login user
  const handleSubmitForm = () => {
    if(userName !== password){
        setMessErro("Mật khẩu không khớp.")
        return;
    }
    handleResetPassword(email, token, password).then(()=>{
      setIsSucess(true)
    }).catch(error => {
      console.log(error);
      alert(error.message)
    })
  };

  useEffect(() => {
    setMessErro("")
  }, [userName, password])

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const emailParam = queryParams.get("email")
    const tokenParam = queryParams.get("token")
    setEmail(emailParam);
    setToken(tokenParam);
  }, [])

  if(isSuccess){
    return <SuccesFormPage />
  }
  return (
    <Row style={{ height: "100vh" }} className="login">
      <Col span={8}></Col>
      <Col span={8} style={{ height: "100%", padding: "0 12px" }}>
        <div className="login_form">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1 style={{ color: "white", fontSize: "2.2rem", margin: 0 }}>
              CineStar Hub
            </h1>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "center",
                color: "#9f9f9f",
                textTransform: "capitalize",
              }}
            >
              Thay đổi lại mật khẩu
            </p>
          </div>
          <form
            onSubmit={() => handleSubmitForm()}
            style={{
              //backgroundColor: "white",
              borderRadius: "",
              padding: "2rem 2rem",
            }}
          >
              {messErro ? (
              <span
                style={{
                  color: "red",
                  fontSize: "14px",
                  fontWeight: "400",
                  marginBottom: "12px",
                }}
              >
                {messErro}
              </span>
            ) : null}
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu mới."
              onChange={(e) => setOnChangeUserName(e)}
              prefix={<LockOutlined />}
              style={{ fontSize: "14px", marginTop:"6px", padding: "10px" }}
            />

            <Input.Password
              size="large"
              placeholder="Nhập lại mật khẩu."
              onChange={(e) => setOnChangePass(e)}
              prefix={<LockOutlined />}
              style={{
                marginTop: "1.5rem",
                marginBottom: "1.5rem",
                fontSize: "14px",
                padding: "10px",
              }}
            />
            {userName && password ? (
              <Button
                onClick={() => handleSubmitForm()}
                type="primary"
                style={{
                  width: "100%",
                  color: "white",
                  borderColor: "#058dd9",
                  backgroundColor: "#058dd9",
                  height: "40px",
                  marginBottom: "1rem",
                }}
                loading={loadingStatus}
              >
                Đổi Mật Khẩu
              </Button>
            ) : (
              <Button
                onClick={() => handleSubmitForm()}
                disabled
                type="primary"
                style={{
                  width: "100%",
                  color: "white",
                  borderColor: "#058dd9",
                  backgroundColor: "#058dd9",
                  height: "40px",
                  marginBottom: "1rem",
                }}
              >
                Đổi Mật Khẩu
              </Button>
            )}
            <p onClick={() => navigate("/login")} className="forgetPassword">Đăng nhập ngay</p>
          </form>
        </div>
      </Col>
      <Col span={8}></Col>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Row>
  );
}
