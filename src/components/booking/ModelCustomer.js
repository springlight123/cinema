
import { Button, Modal } from 'antd';
import { useState } from 'react';
const ModelCustomer = ({showModel, setShowMode}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setShowMode(false)
  };
  const handleCancel = () => {
    setShowMode(false)
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};
export default ModelCustomer;