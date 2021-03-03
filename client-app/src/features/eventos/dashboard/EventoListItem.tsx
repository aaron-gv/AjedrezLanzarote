import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Segment } from "semantic-ui-react";
import { Evento } from "../../../app/models/evento";
import { useStore } from "../../../app/stores/store";

interface Props {
  evento: Evento;
}

export default observer(function EventoListItem({
  evento,
  
}: Props) {
    const [target, setTarget] = useState('');
  const { eventoStore } = useStore();
  const { deleteEvento, loading } = eventoStore;

  function handleEventoDelete(
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) {
    setTarget(e.currentTarget.name);
    deleteEvento(id);
  }
  
  return (
    <Segment.Group key={evento.id}>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size='tiny' circular src='/assets/user.png' />
            <Item.Content>
              <Item.Header>{evento.title}</Item.Header>
              <Item.Description>Hosted by Bob</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name='clock' /> {evento.startDate} - {evento.endDate}
          <Icon name='marker' /> {evento.venue}
        </span>
      </Segment>
      <Segment secondary>{evento.description}</Segment>
      <Segment clearing>
        <Button
          as={Link}
          to={`/eventos/${evento.url}`}
          color='teal'
          floated='right'
          content='info'
        />
        <Button
          name={evento.id}
          loading={loading && target === evento.id}
          onClick={(e) => handleEventoDelete(e, evento.id)}
          color='red'
          floated='right'
          content='borrar'
        />
      </Segment>
    </Segment.Group>
  );
});
