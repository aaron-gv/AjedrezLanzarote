import 'react-photoswipe/lib/photoswipe.css';
import {  Container, Image, Label, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import PSGallery from '../../../app/common/util/PSGallery';
import React from 'react';


interface Props {
    items: any[],
    id: string,
    title: string
}

  
export default observer(function EventoGallery({items, id, title} : Props) {
     

function openPhotoSwipe(index: number) {
  var pswpElement = document.querySelectorAll('.pswp')[0];
    console.log(index);
  // define options (if needed)
  var options = {
     // history & focus options are disabled on CodePen        
      history: true,
      focus: true,
      index: index,
      //getThumbBoundsFn:{x:0,y:0,w:50},
      showAnimationDuration: 1,
      hideAnimationDuration: 1 
      
  };
  
  var gallery = new PhotoSwipe( pswpElement as HTMLElement  , PhotoSwipeUI_Default, items, options);
  gallery.init();
};


    return (
        <Segment style={{width:'90%',  marginLeft:'5%'}}>
        <Label ribbon  style={{color:'white',fontFamily:"Arial",padding:2,paddingLeft:18, opacity:0.9, zIndex:30, top:'-10px',fontSize:'16px', textAlign:'left',fontWeight:'normal'}} color='blue'  >
          {title}
          <Label style={{padding:4,marginLeft:'10px'}}  size='medium'> {items.length} </Label>
        </Label>

        <Container style={{display:'flex', overflow:'hidden', height:'auto', marginTop:'-30px'}}>
          
        {items.slice(0,7).map((image, index) => (
          <Image key={image.thumbnail} verticalAlign={'middle'} src={image.thumbnail} title={image.title} style={{maxWidth:'100px',maxHeight:'70px', minWidth:'50px',  minHeight:'50px', float:'left',marginLeft:'10px', border:'none', cursor:'pointer'}} as='button' onClick={() => openPhotoSwipe(index)}  />
        )
        )}
        </Container>
            <PSGallery />
        </Segment>
    )
})