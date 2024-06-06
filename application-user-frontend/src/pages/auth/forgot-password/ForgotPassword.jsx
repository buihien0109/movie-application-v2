import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useForgotPasswordMutation } from '../../../app/apis/auth.api';

const schema = yup.object().shape({
  email: yup.string().email('Email không đúng định dạng').required('Email không được để trống'),
});

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = data => {
    forgotPassword(data)
      .unwrap()
      .then((res) => {
        toast.success("Đã gửi yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra email của bạn");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.message)
      });
  };

  return (
    <>
      <section className="py-4">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={"/"} className="text-primary">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Quên mật khẩu</li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="pb-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-4">
              <div className="reset-container">
                <div id="custom-reset-form">
                  <form id="customer-reset-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="reset-form-container">
                      <div className="text-center">
                        <h3 className="mb-2">Quên mật khẩu</h3>
                        <p>Vui lòng điền thông tin vào form bên dưới.</p>
                      </div>
                      <div className="reset-form p-5 rounded bg-body-tertiary">
                        <div className="reset-form-input form-group">
                          <input
                            type="email"
                            id="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="Email"
                            autoComplete="off"
                            {...register('email')}
                          />
                          {errors.email && <span className="error invalid-feedback">{errors.email.message}</span>}
                        </div>
                        <div className="reset-toggle-btn mt-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <button type="submit" className="btn btn-primary px-4">Xác nhận</button>
                            <Link to={"/dang-nhap"} className="text-primary">Quay lại đăng nhập</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
