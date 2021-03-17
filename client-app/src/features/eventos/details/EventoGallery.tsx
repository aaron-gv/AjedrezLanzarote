import  { useState } from 'react';
import 'react-photoswipe/lib/photoswipe.css';
import {PhotoSwipeGallery} from 'react-photoswipe';
import { Image, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

interface Props {
    items: any[],
    id: string,
    title: string
}
var getThumbnailContent = (item: any) => {
    return (
      <Image src={item.thumbnail} centered fluid alt={item.src} title={item.title} verticalAlign={'middle'} />
    );
  }
  
export default observer(function EventoGallery({items, id, title} : Props) {
    
const [isOpen,setIsOpen] = useState(false);
 
let options = {
  //http://photoswipe.com/documentation/options.html
};
    return (
        <>
        <Label content={<>{title}<Label style={{marginLeft:5}} circular color='blue' size='tiny'>{items.length}</Label></>} ribbon style={{opacity:0.7}} color='orange' size='tiny'  />
        
        {items.forEach(item => { 
            <Image key={item.thumbnail} verticalAlign={'middle'} src={item.src} title={item.title} style={{ float:'left',marginLeft:'10px'}} onClick={() => setIsOpen(!isOpen)} />
        })}
            <PhotoSwipeGallery key={id} items={items} options={options} thumbnailContent={getThumbnailContent}/>
        </>
    )
})