import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { ReactNode } from 'react'
import {Segment, Grid,  Image} from 'semantic-ui-react'
import {Evento} from "../../../app/models/evento";
import ReactTextFormat from 'react-text-format';

interface Props {
    evento: Evento
}

export default observer(function EventoDetailedInfo({evento}: Props) {
    var customImageDecorator = (
        decoratedURL: string
        ): ReactNode => {
        return (
            <div style={{float:'left',margin:2}}>
            <a href={decoratedURL} rel="noreferrer" target="_blank">
                <Image src={decoratedURL}  rel='noopener' style={{maxWidth:'300px',maxHeight:'200px'}} className='customImage' />
            </a>
          </div>
        )
        };
    return (
        <>
            <Segment attached>
                        <b>Fecha: </b>{format(evento.startDate!, 'dd MMM yyyy h:mm aa')} - {format(evento.endDate!, 'dd MMM yyyy h:mm aa')}
                        
            </Segment>
            <Segment attached>
                <b>Lugar: </b><span>{evento.venue}, {evento.city}</span>
            </Segment>
            <Segment attached>
                <Grid>
                    <Grid.Column width={16} style={{whiteSpace: 'pre-line'}}>
                    <ReactTextFormat
                        allowedFormats={['URL', 'Email', 'Image', 'Phone', 'CreditCard']}
                        imageDecorator={customImageDecorator}
                    >{evento.description}</ReactTextFormat>
                    </Grid.Column>
                </Grid>
            </Segment>
        </>
    )
})