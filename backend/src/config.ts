export const config = {
    mainServicePort: +process.env.PORT || 8080,
    streamServicePort: process.env.STREAM_SERVICE_PORT || 8001,
    bucketName: process.env.GOOGLE_BUCKET_NAME || "miniyt-videos",
    datastoreKind: process.env.DATASTORE_KIND || "Song"
};