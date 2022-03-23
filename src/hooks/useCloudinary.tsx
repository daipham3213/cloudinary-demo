import config from '../config/config';
import {Cloudinary, CloudinaryImage} from "@cloudinary/url-gen";
import { AdvancedImage as Image, lazyload, responsive } from '@cloudinary/react';

const useCloudinary = () => {
    const cloud = new Cloudinary({
        cloud: {
            cloudName: config.cloud_name,
            apiKey: config.api_key,
            apiSecret: config.api_secret
        },
        api: {
            chunkSize: 20000,
            timeout: 10000,
        },
    })
    const AdvancedImage = (img: CloudinaryImage) => (
        <Image cldImg={img} plugins={[lazyload(), responsive()]} />
    )
    return { cloud, AdvancedImage };
};

export default useCloudinary;