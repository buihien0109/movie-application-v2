import { Button, Form, Input, InputNumber, Modal, Space, message, Select } from "antd";
import React from "react";
import { useUpdateEpisodeMutation } from "../../../app/services/episode.service";

const ModalUpdate = (props) => {
    const { episode, open, onCancel, onUpdateEpisode, movieId } = props;
    const [updateEpisode, { isLoading }] = useUpdateEpisodeMutation();

    const onFinish = (values) => {
        updateEpisode({ episodeId: episode.id, ...values, movieId })
            .unwrap()
            .then((data) => {
                onUpdateEpisode(data);
                message.success("Cập nhật tập phim thành công!");
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
                title="Cập nhật tập phim"
                footer={null}
                onCancel={onCancel}
                confirmLoading={isLoading}
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{ ...episode }}
                >
                    <Form.Item
                        label="Tên tập phim"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: "Tên phim không được để trống!",
                            },
                        ]}
                    >
                        <Input placeholder="Tập 1, Tập 2, ..." />
                    </Form.Item>

                    <Form.Item
                        label="Tập số bao nhiêu"
                        name="displayOrder"
                        rules={[
                            {
                                required: true,
                                message: "Tập số bao nhiêu không được để trống!",
                            },
                            {
                                validator: (_, value) => {
                                    if (value <= 0) {
                                        return Promise.reject(
                                            "Tập số bao nhiêu phải lớn hơn 0!"
                                        );
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <InputNumber placeholder="1, 2, 3, ..." style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Trạng thái không được để trống!",
                            },
                        ]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a status"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            options={[
                                { label: "Nháp", value: false },
                                { label: "Công khai", value: true },
                            ]}
                        />
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
