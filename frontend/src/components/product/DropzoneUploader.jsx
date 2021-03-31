import React from 'react';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL : 'http://localhost:8000';

function DropzoneUploader(props) {
    const { onUploadSuccess } = props;
    const getUploadParams = ({ file, meta }) => {
        const body = new FormData();
        body.append('file', file);
        return {
            url: `${API_URL}/api/upload`,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            body,
        };
    };

    const handleChangeStatus = ({ meta, file, xhr }, status) => {
        console.log(status, meta, file);

        if (status === 'done') {
            // const response = JSON.parse(xhr.response);
            onUploadSuccess(xhr.response);
            // toast.success('Image uploaded successfully!', { delay: 3000 });
        }

        if (status === 'error_upload') {
            // toast.error('Error on upload', { delay: 3000 });
        }
    };

    const handleSubmit = (files) => {
        console.log(files.map((f) => f.meta));
    };

    return (
        <Dropzone
            getUploadParams={getUploadParams}
            onChangeStatus={handleChangeStatus}
            onSubmit={handleSubmit}
            maxFiles="100"
            inputContent="Drop files or Click to browse (max 100 files)"
            styles={{
                dropzone: { width: '100%', maxHeight: '70vh' },
                dropzoneActive: { borderColor: 'green' },
                dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
            }}
            // autoUpload={false}
            // submitButtonDisabled={false}
            SubmitButtonComponent={null}
            djsConfig={{
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
            }}
            accept="image/*,audio/*,video/*"
        />
    );
}

export default DropzoneUploader;
