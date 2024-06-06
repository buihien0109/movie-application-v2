import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useRegisterAccountMutation } from '../../../app/apis/auth.api';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  name: yup.string().required('Tên không được để trống'),
  email: yup.string().email('Email không đúng định dạng').required('Email không được để trống'),
  password: yup.string().required('Mật khẩu không được để trống'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không trùng khớp')
    .required('Mật khẩu xác nhận không được để trống'),
});

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const [registerAccount, { isLoading }] = useRegisterAccountMutation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = data => {
    registerAccount(data).unwrap()
      .then(() => {
        toast.success("Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.");
        setTimeout(() => {
          navigate('/dang-nhap');
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.message)
      })
  };

  return (
    <>
      <Helmet>
        <title>Đăng ký</title>
      </Helmet>
      
      <section className="py-4">
        <div className="container">
          <h3 className="mb-3 text-center">Đăng ký</h3>
          <div className="row justify-content-center">
            <div className="col-4">
              <form className="p-5 rounded bg-body-tertiary" onSubmit={handleSubmit(onSubmit)} id="form-register">
                <div className="mb-3 form-group">
                  <label htmlFor="name" className="form-label">Tên</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    {...register('name')} />
                  {errors.name && <span className="error invalid-feedback">{errors.name.message}</span>}
                </div>
                <div className="mb-3 form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="text"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    {...register('email')} />
                  {errors.email && <span className="error invalid-feedback">{errors.email.message}</span>}
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Mật khẩu</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      {...register('password')}
                    />
                    <span
                      className="input-group-text icon-toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fa-regular fa-eye${showPassword ? "-slash" : ""}`}></i>
                    </span>
                    {errors.password && <span className="error invalid-feedback">{errors.password.message}</span>}
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Nhập lại mật khẩu</label>
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
                <div className="d-flex justify-content-between align-items-center">
                  <button type="submit" className="btn btn-primary px-4">Đăng Ký</button>
                  <Link to={"/dang-nhap"} className="text-primary">Đăng nhập?</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
