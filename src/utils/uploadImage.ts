import axios from "axios";

export const UploadImage = async (file: File) => {
    const presetKey = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_KEY || "your_preset_key";
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";

    console.log(file, "file", presetKey, cloudName);

    if (!presetKey || !cloudName || presetKey === "your_preset_key") {
        console.error('Cloudinary preset key or cloud name is missing. Please set NEXT_PUBLIC_CLOUDINARY_PRESET_KEY and NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your .env file.');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', presetKey);

    try {
        const result = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData);
        const { secure_url } = result.data;

        console.log(secure_url, "secure url");
        console.log(result.data, "response data");

        return secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};
