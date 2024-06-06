import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useUpdateReviewMutation } from '../../../../app/apis/review.api';

const UpdateReviewModal = ({ show, review, handleClose, movie, onPageChange }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [rating, setRating] = useState(review.rating);
    const [hoverRating, setHoverRating] = useState(0);
    const [updateReview, { isLoading }] = useUpdateReviewMutation();

    useEffect(() => {
        if (review) {
            setValue('comment', review.comment);
        }
    }, [review, setValue]);

    const onSubmit = data => {
        updateReview({ reviewId: review.id, ...data, rating, movieId: movie.id })
            .unwrap()
            .then((res) => {
                toast.success("Cập nhật đánh giá thành công");
                handleClose();
                onPageChange(1);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            });
    };

    const handleMouseEnter = (index) => {
        setHoverRating(index);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleRatingClick = (index) => {
        setRating(index);
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Đánh giá phim</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="review-product-info text-center">
                    <h6>{movie.title}</h6>
                </div>
                <div className="review-product-rating">
                    <div className="text-center">
                        {[...Array(10)].map((_, index) => (
                            <span
                                key={index + 1}
                                className="review-product-rating-item"
                                onMouseEnter={() => handleMouseEnter(index + 1)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handleRatingClick(index + 1)}
                                style={{
                                    color: (hoverRating || rating) > index ? '#ffc107' : '#e4e5e9',
                                    cursor: 'pointer',
                                }}
                            >
                                <i className="fa fa-star"></i>
                            </span>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="review-product-rating-result">
                            {rating ? `Bạn đã đánh giá ${rating}/10` : 'Chọn mức đánh giá'}
                        </p>
                    </div>
                </div>
                <div className="review-product-content">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                                placeholder="Hãy chia sẻ cảm nhận của bạn về bộ phim"
                                {...register('comment', { required: 'Nội dung không được để trống' })}
                            />
                            {errors.comment && <span className="error invalid-feedback">{errors.comment.message}</span>}
                        </Form.Group>
                        <div className="review-product-btn d-flex justify-content-center mt-3">
                            <Button
                                type="submit"
                                className="btn btn-primary px-5"
                                disabled={isLoading}
                            >Hoàn tất</Button>
                        </div>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateReviewModal;
