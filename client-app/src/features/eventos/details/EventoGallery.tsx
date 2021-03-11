import React, { useState } from 'react';
import 'react-photoswipe/lib/photoswipe.css';
import {PhotoSwipeGallery, PhotoSwipeGalleryItem} from 'react-photoswipe';
import { Image } from 'semantic-ui-react';

interface Props {
    items: PhotoSwipeGalleryItem[]
}
var getThumbnailContent = (item: PhotoSwipeGalleryItem) => {
    return (
      <img src={item.thumbnail} alt={item.src} title={item.title} width={120} height={90}/>
      
    );
  }
  
export default function EventoGallery({items} : Props) {
    
const [isOpen,setIsOpen] = useState(false);




 
let options = {
  //http://photoswipe.com/documentation/options.html
};
 

 


    return (
        <>
        {items.forEach(item => {
            <Image key={item.thumbnail} src={item.src} title={item.title} style={{maxWidth:'100px',maxHeight:'100px', float:'left',marginLeft:'10px'}} onClick={() => setIsOpen(!isOpen)} />
        })}
            <PhotoSwipeGallery items={items} options={options} thumbnailContent={getThumbnailContent}/>
        </>
    )
}