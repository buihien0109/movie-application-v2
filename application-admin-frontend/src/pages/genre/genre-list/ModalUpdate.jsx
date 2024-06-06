import { Button, Form, Input, Modal, Space, message } from "antd";
import React from "react";
import { useUpdateGenreMutation } from "../../../app/services/genres.service";

const ModalUpdate = (props) => {
    const { genre, open, onCancel } = props;
    const [updateGenre, { isLoading }] = useUpdateGenreMutation();

    const onFinish = (values) => {
        updateGenre({ id: genre.id, name: values.name })
            .unwrap()
            .then((data) => {
                message.success("Cập nhật thể loại thành công!");
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
                title="Cập nhật thể loại"
                footer={null}
                onCancel={onCancel}
                confirmLoading={isLoading}
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{ name: genre?.name }}
                >
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Tên thể loại không được để trống!',
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên thể loại" />
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
