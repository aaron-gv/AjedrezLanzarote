import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Evento } from "../../../app/models/evento";
import EventoListItemAsistente from "./EventoListItemAsistente";
import ReactTextFormat from 'react-text-format';
import EventoGallery from "../details/EventoGallery";
import {PhotoSwipeGalleryItem} from 'react-photoswipe';

interface Props {
  evento: Evento;
}

export default observer(function EventoListItem({
  evento,
  
}: Props) {
  let items: PhotoSwipeGalleryItem[]  = [
    {
      src: 'https://static.toiimg.com/thumb/72975551.cms?width=680&height=512&imgsize=881753',
      w: 1200,
      h: 900,
      thumbnail: 'https://static.toiimg.com/thumb/72975551.cms?width=680&height=512&imgsize=881753',
      title: "Foto 1"
    },
    {
      src: 'https://images.chesscomfiles.com/uploads/v1/group/153790.e5abfa79.160x160o.86e6e2064c3c.jpeg',
      w: 1200,
      h: 900,
      thumbnail: 'https://images.chesscomfiles.com/uploads/v1/group/153790.e5abfa79.160x160o.86e6e2064c3c.jpeg',
      title: "Foto 1"
    },
    
  ];
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
  
  return (
    <Segment.Group key={evento.id}>
      <Segment >
        {evento.isCancelled && 
          <Label attached='top' color='red' content='Cancelado' style={{textAlign: 'center'}} />
        }
        <Item.Group as={Link} to={`/eventos/${evento.url}`}>
          <Item>
            <Item.Image style={{marginBottom:3}} size='tiny' src='/assets/user.png' />
            <Item.Content>
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
      <Segment clearing style={{whiteSpace: 'pre-line'}}><ReactTextFormat
                        allowedFormats={['URL', 'Email', 'Image', 'Phone', 'CreditCard']}
                        imageDecorator={customImageDecorator}
                    >
        {evento.description}</ReactTextFormat>
      </Segment>
      {evento.category === "online" && 
        <Segment secondary><EventoListItemAsistente asistentes={evento.asistentes!} /></Segment>
      }
      {evento.category === "presencial" && 
        <Segment secondary clearing><EventoGallery items={items} /></Segment>
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
