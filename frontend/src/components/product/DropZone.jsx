import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    cursor: 'pointer',
};

const activeStyle = {
    borderColor: '#2196f3',
};

const acceptStyle = {
    borderColor: '#00e676',
};

const rejectStyle = {
    borderColor: '#ff1744',
};

// preview
const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box',
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%',
};

function DropZone(props) {
    const { files, onFilesChange } = props;
    // const [files, setFiles] = useState([]);
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: 'image/*',
        maxFiles: 20,
        onDrop: (acceptedFiles) => {
            onFilesChange(acceptedFiles.map((file) => Object.assign(file, {
                preview: URL.createObjectURL(file),
            })));
            // setFiles(acceptedFiles.map((file) => Object.assign(file, {
            //     preview: URL.createObjectURL(file),
            // })));
        },
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
    }), [
        isDragActive,
        isDragReject,
        isDragAccept,
    ]);

    // const onDrop = (files) => {
    //     this.setState({ percent: 0 });
    //     const data = new FormData();
    //     files.forEach((file) => {
    //         data.append('files[]', file, file.name);
    //     });
    //
    //     const req = request.post('http://localhost:3001');
    //     req.on('progress', (event) => {
    //         const percent = Math.floor(event.percent);
    //         if (percent >= 100) {
    //             this.setState({ percent: 100 });
    //         } else {
    //             this.setState({ percent });
    //         }
    //     });
    //
    //     const that = this;
    //     req.send(data);
    //     req.end((err, res) => {
    //         console.log('Successfully uploaded');
    //     });
    // };

    const thumbs = files.map((file) => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img
                    src={file.preview}
                    style={img}
                />
            </div>
        </div>
    ));

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <section className="container">
            <div {...getRootProps({ style })}>
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <div className="text-center">
                        <h5>Upload Images</h5>
                        <p>
                            Drag multiple images here
                            <br />
                            or
                            <br />
                            click to browse files (max:20 files)
                        </p>
                    </div>
                </div>
                <aside style={thumbsContainer}>
                    {thumbs}
                </aside>
            </div>
        </section>
    );
}

export default DropZone;
