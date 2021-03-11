import React from "react";
import { Segment, List, Label, Item, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Evento } from "../../../app/models/evento";
import EventoGallery from "./EventoGallery";
import {PhotoSwipeGalleryItem} from 'react-photoswipe';

 

interface Props {
  evento: Evento;
}

export default observer(function ActivityDetailedSidebar({
  evento: { category, asistentes, host },
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
  let items2: PhotoSwipeGalleryItem[]  = [
    {
      src: 'https://betacssjs.chesscomfiles.com/bundles/web/images/offline-play/standardboard.png',
      w: 1200,
      h: 900,
      thumbnail: 'https://betacssjs.chesscomfiles.com/bundles/web/images/offline-play/standardboard.png',
      title: "Foto 1"
    }
    
  ];
  if (!asistentes || category === "presencial") {
    return (
      <>
        <Segment clearing>
          <Segment secondary clearing>
            <EventoGallery items={items} />
          </Segment>
          <Segment secondary clearing>
          <EventoGallery items={items2} />
          </Segment>
        </Segment>
      </>
    );
  } else {
    return (
      <>
        <Segment
          textAlign='center'
          style={{ border: "none" }}
          attached='top'
          secondary
          inverted
          color='teal'
        >
          {asistentes.length} {asistentes.length === 1 ? "Persona Asistirá" : "Personas Asistirán"}{" "}
           a éste evento
        </Segment>
        <Segment attached>
          <List relaxed divided>
            {asistentes.map((asistente) => (
              <Item style={{ position: "relative" }} key={asistente.username}>
                {asistente.username === host?.username && (
                  <Label
                    style={{ position: "absolute" }}
                    color='orange'
                    ribbon='right'
                  >
                    Organiza
                  </Label>
                )}
  
                <Image size='tiny' src={asistente.image || "/assets/user.png"} />
                <Item.Content verticalAlign='middle'>
                  <Item.Header as='h3'>
                    <Link to={`/perfiles/${asistente.username}`}>
                      {asistente.displayName}
                    </Link>
                  </Item.Header>
                  <Item.Extra style={{ color: "orange" }}>Following</Item.Extra>
                </Item.Content>
              </Item>
            ))}
          </List>
        </Segment>
      </>
    );
  }
  
});
