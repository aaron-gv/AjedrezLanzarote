import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Evento } from '../../../app/models/evento';

interface Props {
    closeForm: () => void;
    evento: Evento | undefined;
    createOrEdit: (evento: Evento ) => void;
    submitting: boolean;
}

export default function EventoForm({closeForm, createOrEdit, evento: selectedEvento, submitting} : Props) {

    const initialState = selectedEvento ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        url: '',
        startDate: '',
        endDate: '',
        city: '',
        venue: ''
    }

    const [evento, setEvento] = useState(initialState);

    function handleSubmit(){
        createOrEdit(evento);
    }

    function handleInputchange(event: ChangeEvent<HTMLInputElement |HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setEvento({...evento, [name]: value})
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={evento.title} name='title' onChange={handleInputchange} />
                <Form.Input placeholder='Url' value={evento.url} name='url' onChange={handleInputchange} />
                <Form.TextArea placeholder='Description' value={evento.description} name='description' onChange={handleInputchange} />
                <Form.Input placeholder='Category' value={evento.category} name='category' onChange={handleInputchange} />
                <Form.Input type='date' placeholder='startDate' value={evento.startDate} name='startDate' onChange={handleInputchange} />
                <Form.Input type='date' placeholder='endDate' value={evento.endDate} name='endDate' onChange={handleInputchange} />
                <Form.Input placeholder='City' value={evento.city} name='city' onChange={handleInputchange} />
                <Form.Input placeholder='Venue' value={evento.venue} name='venue' onChange={handleInputchange} />
                <Button loading={submitting} floated='right' positive type='submit' content='Crear' />
                <Button floated='right' type='button' content='Cancelar' onClick={closeForm} />
            </Form>
        </Segment>
    )
}