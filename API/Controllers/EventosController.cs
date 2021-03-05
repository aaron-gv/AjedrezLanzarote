using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Eventos;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class EventosController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetEventos(CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new List.Query(), ct));
        }
        
        [AllowAnonymous]
        [HttpGet("{url}")]
        public async Task<IActionResult> GetEvento(string url)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Url = url}));
        }
        [HttpPost]
        public async Task<IActionResult> CreateEvento(Evento evento)
        {
            return HandleResult(await Mediator.Send(new Create.Command {Evento = evento}));
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> EditEvento(Guid id, Evento evento)
        {
            evento.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{Evento = evento}));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvento(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}