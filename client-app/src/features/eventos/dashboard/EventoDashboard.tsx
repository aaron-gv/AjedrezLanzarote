import React from "react";
import { Grid } from "semantic-ui-react";
import { Evento } from "../../../app/models/evento";
import EventoDetails from "../details/EventoDetails";
import EventoForm from "../form/EventoForm";
import EventoList from "./EventoList";

interface Props {
  eventos: Evento[];
  selectedEvento: Evento | undefined;
  selectEvento: (id: string) => void;
  cancelSelectEvento: () => void;
  editMode: boolean;
  openForm: (id?: string) => void;
  closeForm: () => void;
  createOrEdit: (evento: Evento ) => void;
  deleteEvento: (id: string) => void;
  submitting: boolean;
}

export default function DashboardExtended({
  eventos,
  selectEvento,
  selectedEvento,
  cancelSelectEvento,
  editMode,
  openForm,
  closeForm,
  createOrEdit,
  deleteEvento,
  submitting
}: Props) {
  return (
    <Grid>
      <Grid.Column width='10'>
        <EventoList eventos={eventos} submitting={submitting} selectEvento={selectEvento} deleteEvento={deleteEvento} />
      </Grid.Column>
      <Grid.Column width='6'>
        {selectedEvento && !editMode && (
          <EventoDetails
            evento={selectedEvento}
            selectEvento={selectEvento}
            cancelSelectEvento={cancelSelectEvento}
            openForm={openForm}
          />
        )}
        {editMode && 
            <EventoForm submitting={submitting} createOrEdit={createOrEdit} closeForm={closeForm} evento={selectedEvento} />
        }
        
      </Grid.Column>
    </Grid>
  );
}
