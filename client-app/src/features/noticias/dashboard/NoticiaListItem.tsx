import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Button,  Image,  Item,  Segment } from "semantic-ui-react";

import ReactTextFormat from 'react-text-format';

import PhotoSwipe from "photoswipe";
import PSGallery from "../../../app/common/util/PSGallery";
import PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default";
import 'react-photoswipe/lib/photoswipe.css';
import { Noticia } from "../../../app/models/noticia";
import Gallery from "../../Galleries/Gallery";


interface Props {
  noticia: Noticia;
}

export default observer(function EventoListItem({
  noticia,
  
}: Props) {
  const [hasInnerImages, setHasInnerImages] = useState(false);
  var customImageDecorator = (
    decoratedURL: string
    ): ReactNode => {
    setHasInnerImages(true);
    return (
      <div style={{float:'right',margin:"5px",marginRight:"20px"}}>
        
          <Image src={decoratedURL}  rel='noopener' style={{maxWidth:'300px',maxHeight:'200px',zIndex:2}} className='customImage' />
        
      </div>
    )
    };
    

    function openPhotoSwipe() {
      console.log(noticia.portrait?.width);
      var pswpElement = document.querySelectorAll('.pswp')[0];
      if (!noticia.portrait) return false;
      let portaitWidth = noticia.portrait.width > 0 ? noticia.portrait.width : noticia.portrait.w > 0 ? noticia.portrait.w : 0;
      let portaitHeight = noticia.portrait.height > 0 ? noticia.portrait.height : noticia.portrait.h > 0 ? noticia.portrait.h : 0;
      var items : any[] = [{
        //w: evento.portrait?.width ? evento.portrait.width : 250,
        //h: evento.portrait?.height ? evento.portrait.height : 250,
        w: portaitWidth,
        h: portaitHeight,
        src: noticia.portraitUrl
      }]
      
      // define options (if needed)
      var options = {
         // history & focus options are disabled on CodePen 
          history: true,
          focus: true,
          index: 0,
          //getThumbBoundsFn:{x:0,y:0,w:50},
          showAnimationDuration: 1,
          hideAnimationDuration: 1 
      };
      console.log(items);
      var gallery = new PhotoSwipe( pswpElement as HTMLElement  , PhotoSwipeUI_Default, items , options);
      gallery.init();
    };
  return (
    <Segment.Group key={noticia.id}>
      <PSGallery />
      <Segment >
        
        <Item.Group >
          <Item>
            <Item.Image style={{marginBottom:3, cursor:'pointer'}} size='tiny' src={noticia.portrait?.thumbnail ? noticia.portrait.thumbnail : '/assets/periodico.png'} onClick={() => openPhotoSwipe()} />
            <Item.Content as={Link} to={`/noticias/${noticia.url}`}>
              <Item.Header>{noticia.title}</Item.Header>

              <Item.Description>
                <div style={{marginTop:'5px'}}>
                   <span style={{marginLeft:'10px',marginRight:'10px'}}>{format(noticia.date!, 'dd MMM yyyy ')}</span>
                </div>
              </Item.Description>
            
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment style={{whiteSpace: 'pre-line',maxHeight:'250px',overflow:'hidden'}}>
       {(noticia.body.length>300 || hasInnerImages)  && <Link color='blue' to={`/noticias/${noticia.url}`}><div className='listItemDimmer'><div className='dimmerLink'>Ver información completa</div></div></Link>}
        <ReactTextFormat
          allowedFormats={['URL', 'Email', 'Image', 'Phone', 'CreditCard']}
          imageDecorator={customImageDecorator}
        >
          {noticia.body}
        </ReactTextFormat>
      
      </Segment>
      
      { noticia.galleries && noticia.galleries.length > 0 &&
      <>
        <Segment secondary clearing >
          <h4 >Imágenes :</h4>
          {noticia.galleries.map(gallery => (
            <Gallery title={gallery.title} key={gallery.id} id={gallery.id} items={gallery.images} />
          ))}
        </Segment>
        </>
      }
      
      
      
      <Segment clearing>
        <Button
          as={Link}
          to={`/noticias/${noticia.url}`}
          color='teal'
          floated='right'
          content='info'
        />
        
      </Segment>
      
    </Segment.Group>
  );
});
