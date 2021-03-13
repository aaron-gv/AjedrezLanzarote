import React, { useState } from 'react';
import 'react-photoswipe/lib/photoswipe.css';
import {PhotoSwipeGallery, PhotoSwipeGalleryItem} from 'react-photoswipe';
import { Image } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { ImageDto } from '../../../app/models/image';

interface Props {
    items: PhotoSwipeGalleryItem[],
    id: string
}
var getThumbnailContent = (item: PhotoSwipeGalleryItem) => {
    return (
      <img src={item.thumbnail} alt={item.src} title={item.title} width={200} />
    );
  }
  
export default observer(function EventoGallery({items, id} : Props) {
    
const [isOpen,setIsOpen] = useState(false);
 
let options = {
  //http://photoswipe.com/documentation/options.html
};
  console.log(items);
    return (
        <>
        {items.forEach(item => {
            <Image key={item.thumbnail} src={item.src} title={item.title} style={{maxWidth:'100px',maxHeight:'100px', float:'left',marginLeft:'10px'}} onClick={() => setIsOpen(!isOpen)} />
        })}
            <PhotoSwipeGallery key={id} items={items} options={options} thumbnailContent={getThumbnailContent}/>
        </>
    )
})