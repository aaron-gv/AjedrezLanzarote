import { observer } from "mobx-react-lite";
import React from "react";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import EventoDetails from "../details/EventoDetails";
import EventoForm from "../form/EventoForm";
import EventoList from "./EventoList";

export default observer(function DashboardExtended() {
    const {eventoStore} = useStore();
    const {selectedEvento, editMode} = eventoStore;
  return (
    <Grid>
      <Grid.Column width='10'>
        <EventoList />
      </Grid.Column>
      <Grid.Column width='6'>
        {selectedEvento && !editMode && (
          <EventoDetails />
        )}
        {editMode && 
            <EventoForm />
        }
        
      </Grid.Column>
    </Grid>
  );
})
