import { Button, Result } from "antd";
import "./LoginForm.scss";
import { useNavigate } from "react-router-dom";
const SuccesFormPage = ({ text }) => {
  const navigate = useNavigate();
  return (
    <div
      className="container"
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#12263f",
      }}
    >
      <Result
        style={{ color: "white" }}
        status="success"
        title={text || "Bạn đã đổi mật khẩu thành công."}
        extra={[
          <Button
            onClick={() => navigate("/login")}
            type="primary"
            key="console"
          >
            Đăng Nhập Ngay
          </Button>,
        ]}
      />
    </div>
  );
};

export default SuccesFormPage;
