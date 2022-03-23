import React from 'react';
import MediaUploader from "./components/mediaUploader";
import useCloudinary from "./hooks/useCloudinary";
import {CloudinaryImage} from "@cloudinary/url-gen";
import {AdvancedImage, lazyload, responsive} from "@cloudinary/react";
import { scale} from "@cloudinary/url-gen/actions/resize";

function App() {
    const [photos, setPhotos] = React.useState<string[]>([]);
    const [upload, setUpload] = React.useState(true);
    const [imgs, setImg] = React.useState<CloudinaryImage>();

    const {cloud} = useCloudinary();

    const loadPhoto = React.useCallback(() => {
        const image = cloud.image(photos[0]);
        image.resize(scale().width(150).height(450))
        setImg(image);
    }, [cloud, photos]);

    React.useEffect(() => {
        loadPhoto()
    }, [loadPhoto]);

    return (
        <div className="relative">
            <label className="flex flex-row items-center gap-2 m-2" htmlFor="check">
                <input type="checkbox" onChange={() => setUpload(!upload)}/>
                <p>Upload?</p>
            </label>
            {upload ? (
                <MediaUploader onUploadComplete={publicId => {
                    setPhotos(prevState => [...prevState, publicId])
                }}/>
            ) : (
                <div className="w-screen h-[89vh]">
                    <AdvancedImage cldImg={imgs as any} plugins={[lazyload(), responsive()]}/>
                </div>
            )}
        </div>
    );
}

export default App;
