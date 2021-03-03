import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";

export default observer(function EventoDetails() {
    const {eventoStore} = useStore();
    const {selectedEvento: evento, loadEventoByUrl, loadingInitial} = eventoStore;
    const {url} = useParams<{url: string}>();
    
    useEffect(() => {
      if (url) loadEventoByUrl(url);
    }, [url, loadEventoByUrl]);


    if (loadingInitial || !evento) return <LoadingComponent />;

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
        <Button as={Link} to={`/editar/${evento.url}`} basic color='blue' content='Edit'  />
        <Button as={Link} to={`/eventos`} basic  color='grey' content='Cancel' />
      </Card.Content>
    </Card>
  );
});
