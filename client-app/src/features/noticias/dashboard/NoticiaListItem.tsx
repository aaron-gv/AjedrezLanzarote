import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button, Icon,  Item, Segment } from "semantic-ui-react";
import ReactTextFormat from 'react-text-format';
import { Noticia } from "../../../app/models/noticia";

interface Props {
  noticia: Noticia;
}


    
export default observer(function NoticiaListItem({
  noticia,
  
}: Props) {

  var customImageDecorator = (
    decoratedURL: string
    ): ReactNode => {
    return (
      <div style={{float:'left',margin:3,marginLeft:20}}>
        <a href={`/eventos/${noticia.url}`}>
           [  foto  ]
        </a>
      </div>
    )
    };
  return (
    <Segment.Group key={noticia.id}>
      <Segment >
        <Item.Group as={Link} to={`/noticias/${noticia.url}`}>
          <Item>
            <Item.Image style={{marginBottom:3}} size='tiny' src='/assets/user.png' />
            <Item.Content>
              <Item.Header>{noticia.title}</Item.Header>
              <Item.Description><Icon name='calendar' /> {format(noticia.date!, 'dd MMM yyyy')} </Item.Description>
              
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment style={{whiteSpace: 'pre-line'}} clearing secondary>
      <ReactTextFormat 
                        allowedFormats={['URL', 'Email', 'Image', 'Phone', 'CreditCard']}
                        imageDecorator={customImageDecorator}
                    >
          {noticia.body}
        </ReactTextFormat>
         
      </Segment>
      <Segment clearing>
        <Button
          as={Link}
          to={`/noticias/${noticia.url}`}
          color='teal'
          floated='right'
          content='info'
        />
        
      </Segment>
    </Segment.Group>
  );
});
