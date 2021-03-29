import { observer } from 'mobx-react-lite';
import React, { ReactNode, useState } from 'react'
import {Segment, Grid,  Image,  Icon} from 'semantic-ui-react'
import {Evento} from "../../../app/models/evento";
import ReactTextFormat from 'react-text-format';

interface Props {
    evento: Evento
}

export default observer(function EventoDetailedInfo({evento}: Props) {
    const [readAll,setReadAll] = useState(false);
    const handleReadMore = () => {
        console.log(document.getElementById('infoSegment'));
        if (document.getElementById('infoSegment')!.style.maxHeight !== "")
            document.getElementById('infoSegment')!.style.maxHeight = "";
        else
            document.getElementById('infoSegment')!.style.maxHeight = "332px";
        setReadAll(!readAll);
    }
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
            <Segment attached id={'infoSegment'} style={{maxHeight:'332px', overflow:'hidden'}}>
                <Grid>
                    <Grid.Column width={16} style={{whiteSpace: 'pre-line'}}>
                    <ReactTextFormat
                        allowedFormats={['URL', 'Email', 'Image', 'Phone', 'CreditCard']}
                        imageDecorator={customImageDecorator}
                        
                    >
                        {
                            evento.description.length > 700 ? <>
                                                                {evento.description}
                                                                {!readAll ?
                                                                <div className='readMoreDimmer' onClick={handleReadMore}>
                                                                    <Icon name="arrow down" /> Leer Más ...
                                                                </div>
                                                                :
                                                                <div className='readMoreDimmer noDim' onClick={handleReadMore}>
                                                                    <Icon name="arrow up" /> Encoger 
                                                                </div>}
                                                                
                                                                
                                                               </> 
                                                            : evento.description
                        }
                        
                        
                    </ReactTextFormat>
                    </Grid.Column>
                </Grid>
            </Segment>
        </>
    )
})