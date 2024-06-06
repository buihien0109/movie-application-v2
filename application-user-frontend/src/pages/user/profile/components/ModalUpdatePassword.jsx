import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useChangePasswordMutation } from '../../../../app/apis/user.api';

const schema = yup.object().shape({
    oldPassword: yup.string().required('Mật khẩu cũ không được để trống'),
    newPassword: yup.string().required('Mật khẩu mới không được để trống'),
    confirmPassword: yup.string()
        .required('Nhập lại mật khẩu mới không được để trống')
        .oneOf([yup.ref('newPassword'), null], 'Nhập lại mật khẩu mới không khớp')
});

function ModalUpdatePassword({ show, onHide }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const [changePassword] = useChangePasswordMutation();

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
    const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const onSubmit = (data) => {
        changePassword(data)
            .unwrap()
            .then(() => {
                toast.success('Đổi mật khẩu thành công');
                onHide();
            })
            .catch((error) => {
                console.log(error);
            })
    };

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Đổi mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="form-update-password" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-3">
                            <label className="form-label">Mật khẩu cũ</label>
                            <div className="input-group">
                                <input
                                    type={showOldPassword ? "text" : "password"}
                                    className={`form-control ${errors.oldPassword ? 'is-invalid' : ''}`}
                                    {...register('oldPassword')}
                                />
                                <span className="input-group-text icon-toggle-password" onClick={toggleShowOldPassword}>
                                    <i className={`fa-regular ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </span>
                                {errors.oldPassword && <span className="error invalid-feedback">{errors.oldPassword.message}</span>}
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label">Mật khẩu mới</label>
                            <div className="input-group">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                    {...register('newPassword')}
                                />
                                <span className="input-group-text icon-toggle-password" onClick={toggleShowNewPassword}>
                                    <i className={`fa-regular ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </span>
                                {errors.newPassword && <span className="error invalid-feedback">{errors.newPassword.message}</span>}
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label">Nhập lại mật khẩu mới</label>
                            <div className="input-group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                    {...register('confirmPassword')}
                                />
                                <span className="input-group-text icon-toggle-password" onClick={toggleShowConfirmPassword}>
                                    <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </span>
                                {errors.confirmPassword && <span className="error invalid-feedback">{errors.confirmPassword.message}</span>}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <Button variant="secondary" onClick={onHide}>
                                Hủy
                            </Button>
                            <Button type="submit" variant="primary">Xác nhận</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>

    );
}

export default ModalUpdatePassword;
