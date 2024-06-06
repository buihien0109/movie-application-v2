import { Button, Form, Input, Modal, Space, message } from "antd";
import React from "react";
import { useUpdateCountryMutation } from "../../../app/services/countries.service";

const ModalUpdate = (props) => {
    const { country, open, onCancel } = props;
    const [updateCountry, { isLoading }] = useUpdateCountryMutation();

    const onFinish = (values) => {
        updateCountry({ id: country.id, name: values.name })
            .unwrap()
            .then((data) => {
                message.success("Cập nhật quốc gia thành công!");
                onCancel();
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    return (
        <>
            <Modal
                open={open}
                title="Cập nhật quốc gia"
                footer={null}
                onCancel={onCancel}
                confirmLoading={isLoading}
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{ name: country?.name }}
                >
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Tên quốc gia không được để trống!',
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên quốc gia" />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                Cập nhật
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
};
export default ModalUpdate;
