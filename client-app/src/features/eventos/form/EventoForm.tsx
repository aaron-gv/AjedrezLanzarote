import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import {v4 as uuid} from 'uuid';

export default observer(function EventoForm() {
  const history = useHistory();
  const { eventoStore } = useStore();
  const {
    loadEventoByUrl,
    loadingInitial,
    setLoadingInitial,
    createEvento,
    updateEvento,
    loading,
  } = eventoStore;
  const { url } = useParams<{ url: string }>();

  const [evento, setEvento] = useState({
    id: "",
    title: "",
    category: "",
    description: "",
    url: "",
    startDate: "",
    endDate: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if (url) {
      loadEventoByUrl(url)
            .then((evento) => setEvento(evento!));
    } else{
      setLoadingInitial(false);
    }
        
  }, [url, loadEventoByUrl, setLoadingInitial]);

  function handleSubmit() {
    if (evento.id.length === 0) {
      let newEvento = {
        ...evento,
        id: uuid()
      };
      createEvento(newEvento).then(() => history.push(`/eventos/${newEvento.url}`))
    } else {
      updateEvento(evento).then(() => history.push(`/eventos/${evento.url}`))
    }
  }

  function handleInputchange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setEvento({ ...evento, [name]: value });
  }

  if (loadingInitial) return <LoadingComponent content='Cargando evento...' />

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete='off'>
        <Form.Input
          placeholder='Title'
          value={evento.title}
          name='title'
          onChange={handleInputchange}
        />
        <Form.Input
          placeholder='Url'
          value={evento.url}
          name='url'
          onChange={handleInputchange}
        />
        <Form.TextArea
          placeholder='Description'
          value={evento.description}
          name='description'
          onChange={handleInputchange}
        />
        <Form.Input
          placeholder='Category'
          value={evento.category}
          name='category'
          onChange={handleInputchange}
        />
        <Form.Input
          type='date'
          placeholder='startDate'
          value={evento.startDate}
          name='startDate'
          onChange={handleInputchange}
        />
        <Form.Input
          type='date'
          placeholder='endDate'
          value={evento.endDate}
          name='endDate'
          onChange={handleInputchange}
        />
        <Form.Input
          placeholder='City'
          value={evento.city}
          name='city'
          onChange={handleInputchange}
        />
        <Form.Input
          placeholder='Venue'
          value={evento.venue}
          name='venue'
          onChange={handleInputchange}
        />
        <Button
          loading={loading}
          floated='right'
          positive
          type='submit'
          content='Crear'
        />
        <Button as={Link} to={`/eventos`} floated='right' type='button' content='Cancelar' />
      </Form>
    </Segment>
  );
});
