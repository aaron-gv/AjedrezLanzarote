import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Evento } from "../../../app/models/evento";
import EventoListItemAsistente from "./EventoListItemAsistente";
import ReactTextFormat from 'react-text-format';
import EventoGallery from "../details/EventoGallery";

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
  
  return (
    <Segment.Group key={evento.id}>
      <Segment >
        {evento.isCancelled && 
          <Label attached='top' color='red' content='Cancelado' style={{textAlign: 'center'}} />
        }
        <Item.Group as={Link} to={`/eventos/${evento.url}`}>
          <Item>
            <Item.Image style={{marginBottom:3}} size='tiny' src={'/assets/user.png'} />
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
      {evento.category === "presencial" && evento.galleries && evento.galleries.map(gallery => (
        <Segment secondary clearing key={gallery.id}><EventoGallery title={gallery.title} key={gallery.id} id={gallery.id} items={gallery.images} /></Segment>
      ))
        
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
