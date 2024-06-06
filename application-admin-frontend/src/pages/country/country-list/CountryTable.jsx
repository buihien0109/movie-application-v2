import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Modal, Row, Space, Table, message } from "antd";
import React, { useState } from "react";
import { useDeleteCountryMutation } from "../../../app/services/countries.service";
import useSearchTable from "../../../hooks/useSearchTable";
import ModalUpdate from "./ModalUpdate";

const CountryTable = ({ data }) => {
    const { getColumnSearchProps } = useSearchTable();
    const [open, setOpen] = useState(false);
    const [countryUpdate, setCountryUpdate] = useState(null);
    const [deleteCountry, { isLoading }] = useDeleteCountryMutation();

    const columns = [
        {
            title: "Tên quốc gia",
            dataIndex: "name",
            key: "name",
            width: "70%",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name.localeCompare(b.name, "vi"),
            sortDirections: ["descend", "ascend"],
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "",
            dataIndex: "",
            key: "action",
            width: "30%",
            render: (text, record, index) => {
                return (
                    <Flex justify={"end"}>
                        <Space>
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    setCountryUpdate(record);
                                    setOpen(true);
                                }}
                            ></Button>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    handleConfirm(record.id);
                                }}
                            ></Button>
                        </Space>
                    </Flex>
                );
            },
        },
    ];

    const handleConfirm = (id) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa quốc gia này?",
            content: "Hành động này không thể hoàn tác!",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            okButtonProps: { loading: isLoading }, // Hiển thị loading trên nút OK
            onOk: () => {
                return new Promise((resolve, reject) => {
                    deleteCountry(id)
                        .unwrap()
                        .then(() => {
                            message.success("Xóa quốc gia thành công!");
                            resolve(); // Đóng modal sau khi xóa thành công
                        })
                        .catch((error) => {
                            message.error(error.data.message);
                            reject(); // Không đóng modal nếu xóa thất bại
                        });
                });
            },
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            ),
        });
    };

    return (
        <>
            <Row>
                <Col span={8}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey={(record) => record.id}
                    />

                    {open && (
                        <ModalUpdate
                            open={open}
                            onCancel={() => setOpen(false)}
                            country={countryUpdate}
                        />
                    )}
                </Col>
            </Row>
        </>
    );
};
export default CountryTable;
