import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
import { Evento } from "../../../app/models/evento";

interface Props {
    evento: Evento
    selectEvento: (id: string) => void;
    cancelSelectEvento: () => void;
    openForm: (id? : string) => void;
}

export default function EventoDetails({evento, selectEvento, cancelSelectEvento, openForm} : Props) {
  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${evento.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{evento.title}</Card.Header>
        <Card.Meta>
          <span>{evento.startDate} - {evento.endDate}</span>
        </Card.Meta>
        <Card.Description>
            {evento.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button basic color='blue' content='Edit' onClick={() => openForm(evento.id)} />
        <Button basic onClick={cancelSelectEvento} color='grey' content='Cancel' />
      </Card.Content>
    </Card>
  );
}
