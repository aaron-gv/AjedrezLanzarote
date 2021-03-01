import React, { SyntheticEvent } from "react";
import { Button, Icon, Item, Segment } from "semantic-ui-react";
import { Evento } from "../../../app/models/evento";

interface Props {
  evento: Evento;
  selectEvento: (id: string) => void;
  deleteEvento: (id: string) => void;
  submitting: boolean;
  target: string;
  setTarget: React.Dispatch<React.SetStateAction<string>>;
}

export default function EventoListItem({evento, target, setTarget, selectEvento, deleteEvento, submitting} : Props) {
    function handleEventoDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name)
        deleteEvento(id);
    }
  return (
    <Segment.Group>
        <Segment>
            <Item.Group>
                <Item>
                    <Item.Image size='tiny' circular src='/assets/user.png' />
                    <Item.Content>
                        <Item.Header >{evento.title}</Item.Header>
                        <Item.Description>
                            Hosted by Bob
                        </Item.Description>
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
        <Segment secondary>
            {evento.description}
        </Segment>
        <Segment clearing>
            <Button onClick={() => selectEvento(evento.id)} color='teal' floated='right' content='info' />
            <Button name={evento.id} loading={submitting && target===evento.id} onClick={(e) => handleEventoDelete(e, evento.id)} color='red' floated='right' content='borrar' />
        </Segment>
    </Segment.Group>

  );
}
