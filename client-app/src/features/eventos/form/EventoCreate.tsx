import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { EventoFormValues } from '../../../app/models/evento';
import { useStore } from '../../../app/stores/store';
import EventoForm from './EventoForm';

export default observer(function EventoCreate() {
    const { eventoStore } = useStore();
    const [eventoForm] = useState<EventoFormValues>(
      new EventoFormValues()
    );
    const {  loadingInitial,  loading } = eventoStore;
    
    if (loadingInitial || loading) return <LoadingComponent content='Cargando...'  />;
    return (
        <EventoForm evento={eventoForm} />
    )
});