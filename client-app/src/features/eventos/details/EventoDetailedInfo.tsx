import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { ReactNode } from 'react'
import {Segment, Grid, Icon, Image} from 'semantic-ui-react'
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
        <Segment.Group>
            <Segment attached='top'>
                <Grid>
                    <Grid.Column width={1}>
                        <Icon size='large' color='teal' name='info'/>
                    </Grid.Column>
                    <Grid.Column width={15} style={{whiteSpace: 'pre-line'}}>
                    <ReactTextFormat
                        allowedFormats={['URL', 'Email', 'Image', 'Phone', 'CreditCard']}
                        imageDecorator={customImageDecorator}
                    >{evento.description}</ReactTextFormat>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='calendar' size='large' color='teal'/>
                    </Grid.Column>
                    <Grid.Column width={15}>
            <span>
            {format(evento.startDate!, 'dd MMM yyyy h:mm aa')} - {format(evento.endDate!, 'dd MMM yyyy h:mm aa')}
            </span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='marker' size='large' color='teal'/>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <span>{evento.venue}, {evento.city}</span>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    )
})