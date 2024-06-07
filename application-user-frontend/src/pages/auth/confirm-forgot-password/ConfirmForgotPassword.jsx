import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useChangePasswordMutation, useCheckForgotPasswordTokenQuery } from '../../../app/apis/auth.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';

const schema = yup.object().shape({
  newPassword: yup.string().required('Mật khẩu mới không được để trống'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không trùng khớp')
    .required('Mật khẩu xác nhận không được để trống'),
});

const ConfirmForgotPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const {
    data,
    isLoading: isLoadingCheckForgotPasswordToken,
    isError: isErrorCheckForgotPasswordToken,
    error
  } = useCheckForgotPasswordTokenQuery(token);
  const [changePassword, { isLoading }] = useChangePasswordMutation();


  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (isLoadingCheckForgotPasswordToken) {
    return <Loading />
  }

  if (isErrorCheckForgotPasswordToken) {
    return <ErrorPage />
  }

  const onSubmit = data => {
    changePassword({ ...data, token })
      .unwrap()
      .then((res) => {
        toast.success('Đổi mật khẩu thành công. Vui lòng đăng nhập');
        setTimeout(() => {
          navigate("/dang-nhap")
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.message)
      });
  };

  return (
    <>
      <Helmet>
        <title>Đặt lại mật khẩu</title>
      </Helmet>

      <section className="py-4">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={"/"} className="text-primary">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Đặt lại mật khẩu</li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="pb-4">
        <div className="container">
          {!data.success && (
            <div className="row">
              <h4>{data.message}</h4>
            </div>
          )}

          {data.success && (
            <div className="row justify-content-center">
              <div className="col-4">
                <div className="register-container">
                  <div id="custom-register-form">
                    <form id="customer-reset-password-form" onSubmit={handleSubmit(onSubmit)}>
                      <div className="register-form-container">
                        <div className="register-text text-center">
                          <h3 className="mb-2">Đặt lại mật khẩu</h3>
                          <p>Vui lòng điền thông tin vào form bên dưới.</p>
                        </div>
                        <div className="register-form p-5 rounded bg-body-tertiary">
                          <div className="form-group mb-3">
                            <label className="form-label">Mật khẩu mới</label>
                            <div className="input-group">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                id="newPassword"
                                {...register('newPassword')}
                              />
                              <span
                                className="input-group-text icon-toggle-password"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                <i className={`fa-regular fa-eye${showNewPassword ? "-slash" : ""}`}></i>
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
                                id="confirm-password"
                                {...register('confirmPassword')}
                              />
                              <span
                                className="input-group-text icon-toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                <i className={`fa-regular fa-eye${showConfirmPassword ? "-slash" : ""}`}></i>
                              </span>
                              {errors.confirmPassword && <span className="error invalid-feedback">{errors.confirmPassword.message}</span>}
                            </div>
                          </div>
                          <div className="register-toggle-btn">
                            <div className="form-action-button">
                              <button type="submit" className="btn btn-primary px-4">Xác nhận</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ConfirmForgotPassword;
