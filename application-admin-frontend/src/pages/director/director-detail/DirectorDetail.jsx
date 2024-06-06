import { DeleteOutlined, LeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Space,
  Spin,
  Upload,
  message,
  theme
} from "antd";
import dayjs from 'dayjs';
import "easymde/dist/easymde.min.css";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteDirectorMutation,
  useGetDirectorByIdQuery,
  useUpdateDirectorMutation,
} from "../../../app/services/directors.service";
import {
  useDeleteImageMutation,
  useGetImagesQuery,
  useUploadImageMutation,
} from "../../../app/services/images.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import { API_DOMAIN } from "../../../data/constants";
import { formatDate } from "../../../utils/functionUtils";

const DirectorDetail = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { directorId } = useParams();
  const imagesData = useSelector((state) => state.images);
  const { data: director, isLoading: isFetchingDirectors } =
    useGetDirectorByIdQuery(directorId);
  const { isLoading: isFetchingImages } =
    useGetImagesQuery();

  const images =
    imagesData &&
    imagesData.map((image) => {
      return {
        id: image.id,
        url: `${API_DOMAIN}${image.url}`,
      };
    });
  const [updateDirector, { isLoading: isLoadingUpdateDirector }] =
    useUpdateDirectorMutation();
  const [deleteDirector, { isLoading: isLoadingDeleteDirector }] =
    useDeleteDirectorMutation();
  const [uploadImage, { isLoading: isLoadingUploadImage }] =
    useUploadImageMutation();
  const [deleteImage, { isLoading: isLoadingDeleteImage }] =
    useDeleteImageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // số lượng hình ảnh mỗi trang
  const totalImages = images.length; // tổng số hình ảnh
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalImages);
  const imagesRendered = images.slice(startIndex, endIndex);

  const breadcrumb = [
    { label: "Danh sách đạo diễn", href: "/admin/directors" },
    { label: director?.name, href: `/admin/directors/${director?.id}/detail` },
  ];

  useEffect(() => {
    if (director && avatar === null) {
      setAvatar(director?.avatar.startsWith("/api") ? `${API_DOMAIN}${director?.avatar}` : director?.avatar);
    }
  }, [director, avatar]);

  if (isFetchingDirectors || isFetchingImages) {
    return <Spin size="large" fullscreen />;
  }

  const onPageChange = page => {
    setCurrentPage(page);
  };

  const handleUpdate = () => {
    form.validateFields()
      .then((values) => {
        return updateDirector({ directorId, ...values }).unwrap();
      })
      .then((data) => {
        message.success("Cập nhật đạo diễn thành công!");
      })
      .catch((error) => {
        console.log(error);
        message.error(error.data.message);
      });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa đạo diễn này?",
      content: "Hành động này không thể hoàn tác!",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteDirector(director.id)
          .unwrap()
          .then((data) => {
            message.success("Xóa đạo diễn thành công!");
            setTimeout(() => {
              navigate("/admin/directors");
            }, 1500);
          })
          .catch((error) => {
            message.error(error.data.message);
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

  const selecteImage = (image) => () => {
    setImageSelected(image);
  };

  const handleUploadImage = ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);
    uploadImage(formData)
      .unwrap()
      .then((data) => {
        onSuccess();
        message.success("Tải ảnh lên thành công!");
      })
      .catch((error) => {
        onError();
        message.error(error.data.message);
      });
  };

  const handleDeleteImage = () => {
    const imageObj = images.find((image) => image.url == imageSelected);
    if (!imageObj) {
      return;
    }
    deleteImage(imageObj.id)
      .unwrap()
      .then((data) => {
        message.success("Xóa ảnh thành công!");
        setImageSelected(null);
      })
      .catch((error) => {
        console.log(error);
        message.error(error.data.message);
      });
  };

  return (
    <>
      <Helmet>
        <title>{director.name}</title>
      </Helmet>
      <AppBreadCrumb items={breadcrumb} />
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Flex justify="space-between" align="center" style={{ marginBottom: "1rem" }}>
          <Space>
            <RouterLink to="/admin/directors">
              <Button type="default" icon={<LeftOutlined />}>
                Quay lại
              </Button>
            </RouterLink>
            <Button
              style={{ backgroundColor: "rgb(60, 141, 188)" }}
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleUpdate}
              loading={isLoadingUpdateDirector}
            >
              Cập nhật
            </Button>
          </Space>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={isLoadingDeleteDirector}
          >
            Xóa đạo diễn
          </Button>
        </Flex>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            ...director,
            birthday: director.birthday ? dayjs(formatDate(director.birthday), 'DD/MM/YYYY') : null,
          }}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Họ tên không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Enter name" />
              </Form.Item>

              <Form.Item
                label="Ngày sinh"
                name="birthday"
                rules={[
                  {
                    required: true,
                    message: "Ngày sinh không được để trống!",
                  }
                ]}
              >
                <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} />
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Mô tả không được để trống!",
                  },
                ]}
              >
                <Input.TextArea
                  rows={6}
                  placeholder="Enter description"
                />
              </Form.Item>

              <Form.Item name="avatar">
                <Space direction="vertical">
                  <Avatar
                    src={<img src={avatar} alt="avatar" />}
                    size={180}
                  />
                  <Button
                    type="primary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Thay đổi ảnh đạo diễn
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Modal
          title="Chọn ảnh của bạn"
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setImageSelected(null);
          }}
          footer={null}
          width={1200}
          style={{ top: 20 }}
        >
          <Flex justify="space-between" align="center">
            <Space direction="horizontal">
              <Upload
                maxCount={1}
                customRequest={handleUploadImage}
                showUploadList={false}
              >
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "rgb(243, 156, 18)",
                  }}
                  loading={isLoadingUploadImage}
                >
                  Tải ảnh lên
                </Button>
              </Upload>

              <Button
                type="primary"
                disabled={!imageSelected}
                onClick={() => {
                  setAvatar(imageSelected);
                  setIsModalOpen(false);
                  form.setFieldsValue({
                    avatar: imageSelected.slice(API_DOMAIN.length),
                  });
                }}
              >
                Chọn ảnh
              </Button>
            </Space>
            <Button
              type="primary"
              disabled={!imageSelected}
              danger
              onClick={handleDeleteImage}
              loading={isLoadingDeleteImage}
            >
              Xóa ảnh
            </Button>
          </Flex>

          <div style={{ marginTop: "1rem" }} id="image-container">
            <Row gutter={[16, 16]} wrap={true}>
              {imagesRendered &&
                imagesRendered.map((image, index) => (
                  <Col span={6} key={index}>
                    <div
                      className={`${imageSelected === image.url
                        ? "image-selected"
                        : ""
                        } image-item`}
                      onClick={selecteImage(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={`image-${index}`}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </Col>
                ))}
            </Row>
          </div>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalImages}
            onChange={onPageChange}
            showSizeChanger={false}
            style={{ marginTop: 16, textAlign: 'center' }}
          />
        </Modal>
      </div>
    </>
  );
};

export default DirectorDetail;
