import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useGetUserProfileQuery, useUpdateAvatarMutation, useUpdateProfileMutation } from '../../../app/apis/user.api';
import { updateAuth } from '../../../app/slices/auth.slice';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';
import ModalUpdatePassword from './components/ModalUpdatePassword';

const schema = yup.object().shape({
    name: yup.string().required('Tên không được để trống'),
    phone: yup
        .string()
        .required('Số điện thoại không được để trống')
        .matches(
            /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
            'Số điện thoại không đúng định dạng'
        ),
});

function Profile() {
    const dispatch = useDispatch();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const { data: user, isLoading, isError } = useGetUserProfileQuery();
    const [updateProfile] = useUpdateProfileMutation();
    const [updateAvatar] = useUpdateAvatarMutation();
    const [show, setShow] = useState(false);
    const [avatar, setAvatar] = useState("");


    useEffect(() => {
        if (user) {
            setValue('name', user.name);
            setValue('phone', user.phone);
            setAvatar(user.avatar);
        }
    }, [user, setValue]);

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <ErrorPage />
    }

    const onSubmit = (data) => {
        updateProfile(data)
            .unwrap()
            .then(() => {
                toast.success('Cập nhật thông tin cá nhân thành công');
                dispatch(updateAuth(data));
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message)
            })
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleUploadAvatar = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        updateAvatar(formData)
            .unwrap()
            .then((res) => {
                toast.success("Cập nhật ảnh đại diện thành công");
                dispatch(updateAuth({ avatar: res.url }))
                setAvatar(res.url);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            });
    }

    return (
        <>
            <section className="py-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <Link to="/" className="text-primary">Trang chủ</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Thông tin cá nhân
                            </li>
                        </ol>
                    </nav>
                </div>
            </section>
            <section className="pb-4">
                <div className="container">
                    <div className="row py-2">
                        <div className="col-6">
                            <button
                                type="button"
                                className="btn btn-primary px-4"
                                onClick={handleSubmit(onSubmit)}
                            >
                                Cập nhật
                            </button>
                            <button type="button" className="btn btn-success px-4 ms-1" onClick={handleShow}>
                                Đổi mật khẩu
                            </button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col-md-12">
                                    <form id="form-update-user" className="bg-body-tertiary p-4">
                                        <div className="form-group mb-3">
                                            <label className="form-label">Họ tên</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                {...register('name')}
                                            />
                                            {errors.name && <span className="error invalid-feedback">{errors.name.message}</span>}
                                        </div>

                                        <div className="form-group mb-3">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={user.email}
                                                disabled
                                            />
                                        </div>

                                        <div className="form-group mb-3">
                                            <label className="form-label">Số điện thoại</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                {...register('phone')}
                                            />
                                            {errors.phone && <span className="error invalid-feedback">{errors.phone.message}</span>}
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group mt-4">
                                        <div className="user-avatar-container d-flex align-items-start flex-column">
                                            <img
                                                id="avatar-preview"
                                                src={avatar}
                                                alt={user.name}
                                                className="w-100"
                                                style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                                            />
                                            <label htmlFor="avatar" className="btn btn-warning w-100 mt-2">Đổi Avatar</label>
                                            <input
                                                type="file"
                                                id="avatar"
                                                className="d-none"
                                                onChange={handleUploadAvatar}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ModalUpdatePassword show={show} onHide={handleClose} />
        </>
    )
}

export default Profile;
