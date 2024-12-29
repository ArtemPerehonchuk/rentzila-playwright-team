import path from "path";

function getPhotoPath(fileName: string) {
    return path.resolve(`data/photo/${fileName}.jpg`);
}

export default getPhotoPath;