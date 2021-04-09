import React from 'react';
import { Divider, Grid, Image, Segment } from 'semantic-ui-react';

export default function HomeHeader() {
    return (
    <Segment basic>
        <Grid columns='2'>
        <Grid.Column width={5}>
            <Image
            style={{ width: "100%", maxWidth: "170px", margin: "0 auto" }}
            src='/assets/logo.png'
            />
        </Grid.Column>
        <Grid.Column width={11} style={{}} verticalAlign='middle'>
            <h1>Club CIAL</h1>
            <p>
            Entidad deportiva que da cobertura y apoyo al ajedrez de
            Lanzarote. En esta página se darán noticias y cobertura de todos
            los eventos que el C.D. CIAL participe u organice, además de
            cualquier noticia de interés relacionada con el mundo del Ajedrez.
            </p>
        </Grid.Column>
        </Grid>
        <Divider hidden={false} inverted horizontal section />
    </Segment>
    );
}