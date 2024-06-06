import { DeleteOutlined, EditOutlined, PlaySquareOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Table, Tag, Upload } from "antd";
import React, { useState } from "react";
import { useDeleteEpisodeMutation, useUploadVideoForEpisodeMutation } from "../../../app/services/episode.service";
import { API_DOMAIN } from "../../../data/constants";
import ModalCreate from "./ModalCreate";
import ModalUpdate from "./ModalUpdate";

const EpisodeTable = ({ movieId, onEpisodeChange, data }) => {
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [openModalTrailer, setOpenModalTrailer] = useState(false);
    const [episodes, setEpisodes] = useState(data);
    const [episodeSelected, setEpisodeSelected] = useState(null);
    const [deleteEpisode, { isLoading: isLoadingDelete }] = useDeleteEpisodeMutation();
    const [uploadVideoForEpisode, { isLoading: isLoadingUploadVideo }] = useUploadVideoForEpisodeMutation();

    const handleUploadVideo = ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append("file", file);
        uploadVideoForEpisode({ episodeId: episodeSelected.id, formData })
            .unwrap()
            .then((data) => {
                onSuccess();
                message.success("Tải video thành công!");

                setEpisodes(
                    episodes.map((item) => {
                        if (item.id === episodeSelected.id) {
                            return data;
                        }
                        return item;
                    })
                );
            })
            .catch((error) => {
                onError();
                message.error(error.data.message);
            });
    };

    const columns = [
        {
            title: "#",
            dataIndex: "displayOrder",
            key: "displayOrder",
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Tên tập phim",
            dataIndex: "title",
            key: "title",
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Link",
            dataIndex: "video",
            key: "url",
            render: (text, record, index) => {
                return text ? text.url : null;
            },
        },
        {
            title: "Thời lượng",
            dataIndex: "video",
            key: "duration",
            render: (text, record, index) => {
                return text ? text.duration : null;
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text, record, index) => {
                return text ? <Tag color="success">Công khai</Tag> : <Tag color="warning">Nháp</Tag>;;
            },
        },
        {
            title: "",
            dataIndex: "",
            key: "action",
            width: "10%",
            render: (text, record, index) => {
                return (
                    <Space>
                        <Upload
                            maxCount={1}
                            customRequest={handleUploadVideo}
                            showUploadList={false}
                        >
                            <Button
                                type="primary"
                                icon={<UploadOutlined />}
                                style={{
                                    backgroundColor: "#33a744",
                                }}
                                onClick={() => {
                                    setEpisodeSelected(record);
                                }}
                                loading={isLoadingUploadVideo}
                            ></Button>
                        </Upload>
                        <Button
                            type="primary"
                            icon={<PlaySquareOutlined />}
                            style={{ backgroundColor: "#f9c10a" }}
                            onClick={() => {
                                setEpisodeSelected(record);
                                setOpenModalTrailer(true);
                            }}
                        ></Button>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setEpisodeSelected(record);
                                setOpenModalUpdate(true);
                            }}
                        ></Button>
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                handleConfirm(record.id);
                            }}
                            loading={isLoadingDelete}
                        ></Button>
                    </Space>
                );
            },
        },
    ];

    const handleConfirm = (id) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa tập phim này?",
            content: "Hành động này không thể hoàn tác!",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            okButtonProps: { loading: isLoadingDelete }, // Hiển thị loading trên nút OK
            onOk: () => {
                return new Promise((resolve, reject) => {
                    deleteEpisode(id)
                        .unwrap()
                        .then(() => {
                            setEpisodes(episodes.filter((episode) => episode.id !== id));
                            onEpisodeChange(-1);
                            message.success("Xóa tập phim thành công!");
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

    const handleUpdateEpisode = (episode) => {
        setEpisodes(
            episodes.map((item) => {
                if (item.id === episode.id) {
                    return episode;
                }
                return item;
            })
        );
    }

    const handleCreate = (episode) => {
        setEpisodes([...episodes, episode]);
        onEpisodeChange(1);
    }

    return (
        <>
            <Space style={{ marginBottom: '1rem' }}>
                <Button
                    style={{ backgroundColor: 'rgb(60, 141, 188)' }}
                    type="primary" icon={<PlusOutlined />}
                    onClick={() => setOpenModalCreate(true)}
                >
                    Tạo tập phim
                </Button>
            </Space>

            <Table
                columns={columns}
                dataSource={episodes}
                rowKey={(record) => record.id}
            />

            {openModalUpdate && (
                <ModalUpdate
                    open={openModalUpdate}
                    onCancel={() => setOpenModalUpdate(false)}
                    episode={episodeSelected}
                    movieId={movieId}
                    onUpdateEpisode={handleUpdateEpisode}
                />
            )}

            {openModalTrailer && (
                <Modal
                    title={`Video: ${episodeSelected.title}`}
                    open={openModalTrailer}
                    onCancel={() => setOpenModalTrailer(false)}
                    footer={null}
                    width={1000}
                >
                    <video controls width="100%" src={`${API_DOMAIN}${episodeSelected.video.url}`}>
                        <source src={`${API_DOMAIN}${episodeSelected.video.url}`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </Modal>
            )}

            {openModalCreate && (
                <ModalCreate
                    open={openModalCreate}
                    onCancel={() => setOpenModalCreate(false)}
                    movieId={movieId}
                    onCreateEpisode={handleCreate}
                />
            )}
        </>
    );
};
export default EpisodeTable;
