import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Flex, message, Modal, Row, Space, Table } from "antd";
import React, { useState } from "react";
import { useDeleteGenreMutation } from "../../../app/services/genres.service";
import useSearchTable from "../../../hooks/useSearchTable";
import ModalUpdate from "./ModalUpdate";

const GenreTable = ({ data }) => {
    const { getColumnSearchProps } = useSearchTable();
    const [open, setOpen] = useState(false);
    const [genreUpdate, setGenreUpdate] = useState(null);
    const [deleteGenre, { isLoading }] = useDeleteGenreMutation();

    const columns = [
        {
            title: "Tên thể loại",
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
                                    setGenreUpdate(record);
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
            title: "Bạn có chắc chắn muốn xóa thể loại này?",
            content: "Hành động này không thể hoàn tác!",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            okButtonProps: { loading: isLoading }, // Hiển thị loading trên nút OK
            onOk: () => {
                return new Promise((resolve, reject) => {
                    deleteGenre(id)
                        .unwrap()
                        .then(() => {
                            message.success("Xóa thể loại thành công!");
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
                            genre={genreUpdate}
                        />
                    )}
                </Col>
            </Row>
        </>
    );
};
export default GenreTable;
