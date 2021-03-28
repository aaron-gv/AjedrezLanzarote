import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
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
  var customImageDecorator = (
    decoratedURL: string
    ): ReactNode => {
    return (
      <div style={{float:'left',margin:3,marginLeft:20}}>
        <a href={`/eventos/${evento.url}`}>
           [  foto  ]
        </a>
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
      <Segment >
        {evento.isCancelled && 
          <Label attached='top' color='red' content='Cancelado' style={{textAlign: 'center'}} />
        }
        <Item.Group >
          <Item>
            <Item.Image style={{marginBottom:3, cursor:'pointer'}} size='tiny' src={evento.portrait?.thumbnail ? evento.portrait.thumbnail : '/assets/user.png'} onClick={() => openPhotoSwipe()} />
            <Item.Content as={Link} to={`/eventos/${evento.url}`}>
              <Item.Header>{evento.title}</Item.Header>
              <Item.Description>evento <strong style={{color:'darkblue'}}>{evento.category}</strong></Item.Description>
            
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name='clock' /> {format(evento.startDate!, 'dd MMM yyyy h:mm aa')} - {format(evento.endDate!, 'dd MMM yyyy h:mm aa')}
          <Icon name='marker' /> {evento.venue}
        </span>
      </Segment>
      <Segment clearing style={{whiteSpace: 'pre-line'}}>
        <ReactTextFormat
          allowedFormats={['URL', 'Email', 'Image', 'Phone', 'CreditCard']}
          imageDecorator={customImageDecorator}
        >
          {evento.description.length>300 ? <Link to={`/eventos/${evento.url}`}>{evento.description.substr(0,100)+". . .\n. . .\n  Ver  información  completa  -> "}</Link> : evento.description}
        </ReactTextFormat>
      </Segment>
      {evento.category === "online" && 
        <Segment secondary><EventoListItemAsistente asistentes={evento.asistentes!} /></Segment>
      }
      {evento.category === "presencial" && evento.galleries && evento.galleries.length > 0 &&
      <>
        <Segment secondary clearing >
          <h3 >Imágenes :</h3>
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
