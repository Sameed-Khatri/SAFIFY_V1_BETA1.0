const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

module.exports.uploadImage = async (imageBuffer, fileName) => {
    try {
        const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${imageBuffer.toString('base64')}`, { public_id: fileName });
        return result;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

module.exports.getResized = (imageName) => {
    return cloudinary.url(imageName,
        {
            width: 540,
            height: 405,
            crop: 'fill',
            quality: 'auto'
        }
    );
}

const uploadStream = (fileStream, name) => {

    //wrapping into promise for using modern async/await
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ public_id: name }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        }).end(fileStream)
    });
};