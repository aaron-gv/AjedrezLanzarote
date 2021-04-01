import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link } from 'react-router-dom';
import {Button, Header, Item, Segment,  Icon} from 'semantic-ui-react'
import { Noticia } from '../../../app/models/noticia';
import { useStore } from '../../../app/stores/store';


interface Props {
    noticia: Noticia,
    setPopupStatus: React.Dispatch<React.SetStateAction<boolean>>
}

export default observer (function NoticiaDetailedHeader({noticia, setPopupStatus}: Props) {
    const {userStore, noticiaStore: { loading}} = useStore();
    
    
    

    return (
        <Segment.Group style={{background:'white'}}>
            
            <Item.Group>
                <Item style={{}}>
                    <Item.Content style={{}}>
                        <Header
                            size='huge'
                            content={noticia.title}
                            style={{textDecoration:'underline',margin:10}}
                        />
                    </Item.Content>
                </Item>
                <Item style={{}}>
                    <Item.Content style={{textAlign:'left',margin:6,marginLeft:20,marginBottom:20}}>
                    <Icon name='calendar' size='large' color='teal'/>
                        <span>
                            {format(noticia.date!, 'dd MMM yyyy')} 
                        </span>
                    </Item.Content>
                </Item>

            </Item.Group>
            {userStore.user && userStore.user.roles && userStore.user?.roles?.some(x => x === 'Desarrollador' || x === 'Administrador' )  &&
            <Segment clearing attached='bottom'>
                
                
                
                    <>
                    
                    <Button
                    name={noticia.id}
                    loading={loading}
                    onClick={() => setPopupStatus(true)}
                    color='red'
                    floated='left'
                    content='eliminar'
                    size='tiny'
                    basic
                    
                    />
                    <Button as={Link} to={`/editarNoticia/${noticia.url}`} color='orange' floated='left' size='tiny' basic>
                        Editar noticia
                    </Button>
                    
                    
                    </>
                
            </Segment>
            }
            
        </Segment.Group>
    )
})