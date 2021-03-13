import React from 'react';
import { Image, Segment } from 'semantic-ui-react';
import Gallery from '../../../app/models/gallery'
export default function EventoCollection(gallery: Gallery) {
    if (!gallery) return null;
    return (
        <Segment key={gallery.galleryId}>
        { gallery.images && gallery.images.map(image => 
            <Image width={image.width} height={image.height} key={image.id} src={image.thumbnail} alt={image.name} />
        )}
        </Segment>
    )
}