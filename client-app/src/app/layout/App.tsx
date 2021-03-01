import React, { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { Evento } from "../models/evento";
import NavBar from "./NavBar";
import EventoDashboard from "../../features/eventos/dashboard/EventoDashboard";
import {v4 as uuid} from 'uuid';
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<Evento | undefined>(
    undefined
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    agent.Eventos.list()
      .then(response => {
        let eventos: Evento[] = [];
        response.forEach(evento => {
          evento.startDate = evento.startDate.split('T')[0];
          evento.endDate = evento.endDate.split('T')[0];
          eventos.push(evento);
        })
        setEventos(eventos);
        setLoading(false);
      });
  }, []);

  function handleSelectEvento(id: string) {
    setSelectedEvento(eventos.find((x) => x.id === id));
  }

  function handleCancelSelectEvento() {
    setSelectedEvento(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectEvento(id) : handleCancelSelectEvento();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditEvento(evento: Evento) {
    setSubmitting(true);
    if (evento.id) {
      agent.Eventos.update(evento).then(() => {
        setEventos([...eventos.filter(x => x.id !== evento.id), evento]);
        setSelectedEvento(evento);
        setEditMode(false);
        setSubmitting(false);
      })
    } else {
      evento.id = uuid();
      agent.Eventos.create(evento).then(() => {
        setEventos([...eventos, evento])
        setSelectedEvento(evento);
        setEditMode(false);
        setSubmitting(false);
      })
    }
  }

  function handleDeleteEvento(id: string) {
    setSubmitting(true);
    agent.Eventos.delete(id).then(() => {
      setEventos([...eventos.filter(x => x.id!== id)]);
      setSubmitting(false);
    })
    
  }

  if (loading) return <LoadingComponent content='Cargando app...' />;

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: "7em" }}>
        <EventoDashboard
          eventos={eventos}
          selectedEvento={selectedEvento}
          selectEvento={handleSelectEvento}
          cancelSelectEvento={handleCancelSelectEvento}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditEvento}
          deleteEvento={handleDeleteEvento}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
