import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import {  Grid, Icon, Image, Segment } from "semantic-ui-react";

export default function HomePage() {
  return (
    <>
      
      <Segment basic style={{ padding: 0,marginTop:'30px' }}>
        <Grid>
          <Grid.Column width={6}>
            <Image
              as={Link}
              to={{
                pathname:
                  "https://www.google.com/maps/place/Calle+M%C3%A9xico,+16,+35500+Arrecife,+Las+Palmas/@28.9599758,-13.5572899,16z/data=!4m5!3m4!1s0xc4627778d5afcb7:0x26d27a8d3c0c5518!8m2!3d28.9604855!4d-13.5559468?hl=es-ES",
              }}
              src='/assets/mapa.jpg'
            />
          </Grid.Column>
          <Grid.Column width={10} style={{}} verticalAlign='middle'>
            <h1>Estamos en</h1>
            <p>
              Calle México, 16 - Arrecife Lanzarote, Las Palmas de Gran Canaria
            </p>
            <Link
          to={{
            pathname:
              "https://www.facebook.com/Cial-Ajedrez-Lanzarote-1540011369357370/",
          }}
          target='__blank'
        >
          <div style={{width:'100%', position:'relative',overflow:'hidden'}}>
            <div style={{maxWidth:'30%', textAlign:'right', float:'left', position:'relative', overflow:'hidden', display: "inline-block"}}>
              <Icon name='facebook' color='blue' size='large' />
            </div>
            <div style={{maxWidth:'70%',float:'left', overflow:'hidden', position:'relative', display: "inline-block", textAlign:'left'}}>
              /Cial-Ajedrez-Lanzarote-1540011369357370/
            </div>
          </div>
        </Link>
        <br  />
        <Link
          to={{ pathname: "mailto:cialsiglo21@gmail.com" }}
          target='__blank'
        >
            <div style={{width:'100%', position:'relative',overflow:'hidden'}}>
            <div style={{maxWidth:'30%', textAlign:'right', float:'left', position:'relative', overflow:'hidden', display: "inline-block"}}>
            <Icon name='at' color='red' size='large' />
            </div>
            <div style={{maxWidth:'70%',float:'left', overflow:'hidden', position:'relative', display: "inline-block", textAlign:'left'}}>
            cialsiglo21@gmail.com
            </div>
          </div>
          
        </Link>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment basic textAlign="center">
        
      </Segment>
    </>
  );
}
