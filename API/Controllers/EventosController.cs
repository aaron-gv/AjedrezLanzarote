using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Eventos;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class EventosController : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<List<Evento>>> GetEventos(CancellationToken ct)
        {
            return await Mediator.Send(new List.Query(), ct);
        }

        [HttpGet("{url}")]
        public async Task<ActionResult<Evento>> GetEvento(string url)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Url = url}));
        }
        [HttpPost]
        public async Task<IActionResult> CreateEvento(Evento evento)
        {
            return Ok(await Mediator.Send(new Create.Command {Evento = evento}));
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> EditEvento(Guid id, Evento evento)
        {
            evento.Id = id;
            return Ok(await Mediator.Send(new Edit.Command{Evento = evento}));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvento(Guid id)
        {
            return Ok(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}