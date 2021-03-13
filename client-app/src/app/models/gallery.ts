import { ImageDto } from "./image";

export default interface Gallery {
    id: string,
    images: ImageDto[]
}
