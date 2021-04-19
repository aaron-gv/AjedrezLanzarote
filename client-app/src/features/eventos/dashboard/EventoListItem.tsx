import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Image, Item, Label, Segment } from "semantic-ui-react";
import { Evento } from "../../../app/models/evento";
import EventoListItemAsistente from "./EventoListItemAsistente";
import ReactTextFormat from 'react-text-format';
import EventoGallery from "../details/EventoGallery";
import PhotoSwipe from "photoswipe";
import PSGallery from "../../../app/common/util/PSGallery";
import PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default";
import 'react-photoswipe/lib/photoswipe.css';


interface Props {
  evento: Evento;
}

export default observer(function EventoListItem({
  evento,
  
}: Props) {
  const [hasInnerImages, setHasInnerImages] = useState(false);
  var customImageDecorator = (
    decoratedURL: string
    ): ReactNode => {
      setHasInnerImages(true);
    return (
      <div style={{float:'right',padding:"5px", marginRight:'20px'}}>
            
            <Image src={decoratedURL}  rel='noopener' style={{maxWidth:'300px',maxHeight:'200px'}} className='customImage' />
            
          </div>
    )
    };
    

    function openPhotoSwipe() {
      console.log(evento.portrait?.width);
      var pswpElement = document.querySelectorAll('.pswp')[0];
      if (!evento.portrait) return false;
      let portaitWidth = evento.portrait.width > 0 ? evento.portrait.width : evento.portrait.w > 0 ? evento.portrait.w : 0;
      let portaitHeight = evento.portrait.height > 0 ? evento.portrait.height : evento.portrait.h > 0 ? evento.portrait.h : 0;
      var items : any[] = [{
        //w: evento.portrait?.width ? evento.portrait.width : 250,
        //h: evento.portrait?.height ? evento.portrait.height : 250,
        w: portaitWidth,
        h: portaitHeight,
        src: evento.portraitUrl
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
    <Segment.Group key={evento.id}>
      <PSGallery />
      <Segment style={{paddingBottom:"0px"}}>
        {evento.isCancelled && 
          <Label attached='top' color='red' content='Cancelado' style={{textAlign: 'center'}} />
        }
        <Item.Group style={{maxHeight:'200px', overflow:"hidden", whiteSpace:'pre-line', padding:'0'}}  >
          <Item style={{padding:'0px'}}>
            <Item.Content style={{color:'black',}} >
              <Image src={evento.portraitUrl ? evento.portraitUrl : '/assets/calendar.png'} size='small' floated='left' style={{zIndex:40,marginRight:'20px',maxWidth:'15%', cursor:'pointer'}} onClick={() => openPhotoSwipe()}  />
                <h2 style={{fontSize:"22px", marginTop:'0px', padding:'0px', marginBottom:'3px'}}>{evento.title}</h2>
                 {evento.startDate !=null && (
                  <>
                    <span style={{marginLeft:'20px'}}>Comienza <b>{format(evento.startDate, 'd / M / yyyy')}</b></span>
                    <br/>
                    <span style={{marginLeft:'20px'}}>Finaliza <b>{format(evento.startDate, 'd / M / yyyy')}</b></span>
                  </>
                )} 
                <br /><br />
                <ReactTextFormat
                  as={Link} to={`/eventos/${evento.url}`}
                  allowedFormats={['URL', 'Email', 'Image', 'Phone', 'CreditCard']}
                  imageDecorator={customImageDecorator}
                >
                  {(evento.description.length>300 || hasInnerImages)  ? <>{evento.description} . . .<br /><Link to={`/eventos/${evento.url}`}><div className='listItemDimmer'><div className='dimmerLink'>Ver información completa</div></div></Link></> : evento.description}
                </ReactTextFormat>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      
      {evento.category === "online" && 
        <Segment secondary><EventoListItemAsistente asistentes={evento.asistentes!} /></Segment>
      }
      {evento.galleries && evento.galleries.length > 0 &&
      <>
        <Segment secondary clearing >
          <h4 >Imágenes :</h4>
          {evento.galleries.map(gallery => (
            <EventoGallery title={gallery.title} key={gallery.id} id={gallery.id} items={gallery.images} />
          ))}
        </Segment>
        </>
      }
      
      
      
      <Segment clearing>
        <Button
          as={Link}
          to={`/eventos/${evento.url}`}
          color='teal'
          floated='right'
          content='info'
        />
        
      </Segment>
      
    </Segment.Group>
  );
});
