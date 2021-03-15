import { observer } from 'mobx-react-lite';
import React from 'react';
import { Image, Segment } from 'semantic-ui-react';
import {Gallery} from '../../../app/models/gallery';
export default observer(function EventoCollection(gallery: Gallery) {
    if (!gallery) return null;
    console.log(gallery);
    return (
        <Segment key={gallery.id}>
        { gallery.images && gallery.images.map(image => 
            <Image title={image.title} width={image.w} height={image.h} key={image.id} src={image.thumbnail} alt={image.name} />
        )}
        </Segment>
    )
})