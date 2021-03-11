import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Image, List, Popup } from 'semantic-ui-react';
import { Profile } from '../../../app/models/profile';
import ProfileCard from '../../profiles/ProfileCard';

interface Props {
    asistentes: Profile[]
}

export default observer(function NoticiaListItemAsistente({asistentes} : Props) {
    return (
        <List horizontal>
            {asistentes.map(asistente => (
                <Popup hoverable key={asistente.username} trigger={
                    <List.Item key={asistente.username} as={Link} to={`/perfiles/${asistente.username}`}>
                        <Image size='mini' circular src={asistente.image || '/assets/user.png'} />
                    </List.Item>
                }>
                    <ProfileCard profile={asistente} />
                </Popup>
            ))}
        </List>
    )
})