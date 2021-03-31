import { observer } from 'mobx-react-lite';
import React, { ReactNode } from 'react'
import {Segment, Grid,  Image} from 'semantic-ui-react'
import { Noticia } from '../../../app/models/noticia';
import ReactTextFormat from 'react-text-format';

interface Props {
    noticia: Noticia
}

export default observer(function NoticiaDetailedInfo({noticia}: Props) {
    var customImageDecorator = (
        decoratedURL: string
        ): ReactNode => {
        return (
            <div style={{float:'left',margin:2, width:'100%'}}>
            <a href={decoratedURL} rel="noreferrer" target="_blank">
            <Image src={decoratedURL}  rel='noopener' style={{maxWidth:'300px',maxHeight:'200px'}} className='customImage' />
            </a>
          </div>
        )
        };
    return (
        <Segment.Group>
            
            
            <Segment attached>
                <Grid>
                    <Grid.Column width={16} style={{whiteSpace: 'pre-line'}}>
                    <ReactTextFormat 
                        allowedFormats={['URL', 'Email', 'Image', 'Phone', 'CreditCard']}
                        imageDecorator={customImageDecorator}
                    >
                        {noticia.body} 
                    </ReactTextFormat>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    )
})