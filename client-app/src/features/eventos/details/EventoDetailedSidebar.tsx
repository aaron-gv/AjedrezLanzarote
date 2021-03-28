import React from "react";
import { Segment, List, Label, Item, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Evento } from "../../../app/models/evento";
import EventoGallery from "./EventoGallery";

 

interface Props {
  evento: Evento;
}

export default observer(function ActivityDetailedSidebar({
  evento: { category, asistentes, host, galleries },
}: Props) {
  
  if (!asistentes || category === "presencial") {
    return (
      <>
        
          
          {galleries && galleries.length > 0 &&
          <Segment clearing>
          <h3>Colecciones de imágenes</h3>
          <Segment secondary clearing>
              {galleries.map(gallery => <EventoGallery key={gallery.id} title={gallery.title} id={gallery.id} items={gallery.images} />)}
          </Segment>  
          </Segment>
          }
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
