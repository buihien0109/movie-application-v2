import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useLoginMutation } from '../../../app/apis/auth.api';

const schema = yup.object().shape({
    email: yup.string().email('Email không đúng định dạng').required('Email không được để trống'),
    password: yup.string().required('Mật khẩu không được để trống'),
});

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const [login, { isLoading }] = useLoginMutation();

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const onSubmit = data => {
        login(data).unwrap()
            .then(() => {
                toast.success('Đăng nhập thành công');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            })
    };

    return (
        <section className="py-4">
            <div className="container">
                <h3 className="mb-3 text-center">Đăng nhập</h3>
                <div className="row justify-content-center">
                    <div className="col-4">
                        <form className="p-5 rounded bg-body-tertiary" id="form-login" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3 form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    name="email"
                                    {...register('email')}
                                />
                                {errors.email && <span className="error invalid-feedback">{errors.email.message}</span>}
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Mật khẩu</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        name="password"
                                        {...register('password')}
                                    />
                                    <span
                                        className="input-group-text icon-toggle-password"
                                        onClick={togglePasswordVisibility}
                                    >
                                        <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </span>
                                    {errors.password && <span className="error invalid-feedback">{errors.password.message}</span>}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <button type="submit" className="btn btn-primary px-4">Đăng nhập</button>
                                <Link to={"/dang-ky"} className="text-primary">Đăng ký tài khoản?</Link>
                            </div>
                            <div className="mt-3">
                                <Link to={"/quen-mat-khau"} className="d-inline-block text-primary">Quên mật khẩu?</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;