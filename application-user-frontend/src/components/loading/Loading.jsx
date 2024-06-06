import React from 'react'

function Loading() {
    return (
        <>
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <svg className="spinner" width="45px" height="45px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                    <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
                </svg>
            </div>
        </>
    )
}

export default Loading