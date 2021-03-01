import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";

export default function EventoDetails() {
    const {eventoStore} = useStore();
    const {selectedEvento: evento} = eventoStore;

    if (!evento) return <LoadingComponent />;

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
        <Button basic color='blue' content='Edit' onClick={() => eventoStore.openForm(evento.id)} />
        <Button basic onClick={eventoStore.cancelSelectedEvento} color='grey' content='Cancel' />
      </Card.Content>
    </Card>
  );
}
