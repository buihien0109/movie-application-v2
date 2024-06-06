import React from 'react';
import Modal from 'react-bootstrap/Modal';

function ModalTrailer({ movie, show, handleClose }) {
    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="xl"
            >
                <Modal.Header closeButton>
                    <Modal.Title as={'h5'}>Trailer: {movie.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ aspectRatio: "16/9" }}>
                        <iframe
                            className="w-100 h-100"
                            src={movie.trailerUrl}
                            title={movie.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen="">
                        </iframe>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ModalTrailer