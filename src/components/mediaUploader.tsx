import React from 'react';
import Dropzone from 'react-dropzone';
import classNames from "classnames";
import request from "superagent";

import config from '../config/config';

const url = `https://api.cloudinary.com/v1_1/${config.cloud_name}/upload`
interface Props {
    onUploadComplete?: (publicId: string) => void;
}
const MediaUploader = ({onUploadComplete}: Props) => {
    const [files, setFiles] = React.useState<File[]>([]);

    const handleOnDrop = (items: File[]) => {
        setFiles(items);
    }

    const onFileRemove = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    }

    const renderSelectedFiles = () => {
        return files.map((value, index) => {
            const objectURL = URL.createObjectURL(value);
            return (
                <div key={index} onClick={() => onFileRemove(index)}>
                    {value.type.includes('image') ? (
                        <img className="w-96 h-auto" src={objectURL} alt={value.name}/>
                    ) : null}
                </div>
            )
        })
    }

    function onPhotoUploadProgress(photoId: string, name: string, progress: request.ProgressEvent) {
        console.info(photoId, name, progress.percent);
    }

    function onPhotoUploaded(photoId: string, name: string, response: request.Response) {
        if (onUploadComplete) {
            onUploadComplete(response.body.public_id as string);
        }
        // console.log(response);
        setFiles([]);
    }

    const handleUpload = (title?: string) => {
        if (files.length > 0) {
            const photoId = Math.floor(Math.random() * 101010101).toString();
            files.forEach(file => {
                const name = file.name;
                request.post(url)
                    .field('upload_preset', 'react-upload')
                    .field('file', file)
                    .field('multiple', true)
                    .field('tags', title ? `myphotoalbum,${title}` : 'myphotoalbum')
                    .field('context', title ? `photo=${title}` : '')
                    .on('progress', (progress) => onPhotoUploadProgress(photoId, name, progress))
                    .end((error, response) => {
                        onPhotoUploaded(photoId, name, response);
                    });
            })
        }
    }

    return (
        <Dropzone onDrop={handleOnDrop}
                  multiple={false}
                  accept="image/*">
            {({getRootProps, getInputProps}) => (
                <section className="h-[90vh] w-screen flex flex-col gap-2 items-center justify-center ">
                    <div
                        className={classNames(
                            "group flex flex-col items-center justify-center border-2 border-gray-600 border-dashed active:outline-none rounded-xl p-4 h-1/3 w-1/3",
                            {"-translate-y-1/5 duration-200": files.length > 0},
                            {"translate-y-0 duration-200": files.length <= 0}
                        )}
                        {...getRootProps()}>
                        <input type='file' {...getInputProps()} />
                        <span
                            className="bg-indigo-500 group-hover:scale-105 group-hover:bg-indigo-400 px-5 py-1 rounded-xl m-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                        </span>
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                    {files.length > 0 ? (
                        <button className="w-20 h-10 rounded-xl hover:scale-105 hover:bg-amber-300 bg-green-400"
                                onClick={() => handleUpload()}>Upload</button>
                    ) : null}
                    <div className="flex flex-row gap-2">
                        {renderSelectedFiles()}
                    </div>
                </section>
            )}
        </Dropzone>
    );
};

export default MediaUploader;

