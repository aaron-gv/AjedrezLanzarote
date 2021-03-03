import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

export default function LandingPage() {
    return (
        <Container style={{marginTop: '7em'}}>
            <h1>Landing page</h1>
            <h3><Link to='/info'>Entrar</Link></h3>
        </Container>
    )
}