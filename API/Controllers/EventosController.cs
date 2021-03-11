using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Eventos;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.Features;
using Infrastructure.Security;
using System.Security.Claims;

namespace API.Controllers
{
    public class EventosController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetEventos(CancellationToken ct)
        {
            
            return HandleResult(await Mediator.Send(new List.Query(this.HttpContext.Request.Headers), ct));
        }
        
        [AllowAnonymous]
        [HttpGet("{url}")]
        public async Task<IActionResult> GetEvento(string url)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Url = url}));
        }
        [Authorize(Policy = "IsAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateEvento(Evento evento)
        {
            evento.Id = Guid.NewGuid();
            var Ip = HttpContext.Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            try
            {
                var firstResult = await Mediator.Send(new Create.Command {Evento = evento});
                if (!firstResult.IsSuccess) {
                    ModelState.AddModelError("some", firstResult.Error);
                    await Mediator.Send(new EventsRecord.Command{EntityId = evento.Id.ToString(), AppUserId = User.FindFirstValue(ClaimTypes.NameIdentifier), Ipv4 = Ip, Entity = "Evento", Action = "CREATE", Status = firstResult.IsSuccess, Error = firstResult.Error});
                    return ValidationProblem(ModelState);
                }
                return await HandleSecurityResult(
                            firstResult, 
                            evento.Id.ToString(), 
                            User.FindFirstValue(ClaimTypes.NameIdentifier), 
                            Ip, 
                            "Evento", 
                            "CREATE"
                        );
            }
            catch (System.Exception)
            {
                return BadRequest();
            }
        }
        [Authorize(Policy = "IsAdmin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> EditEvento(Guid id, Evento evento)
        {
            
            evento.Id = id;
            var Ip = HttpContext.Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
             var firstResult = await Mediator.Send(new Edit.Command{Evento = evento});
                if (!firstResult.IsSuccess) {
                    ModelState.AddModelError("some", firstResult.Error);
                    await Mediator.Send(new EventsRecord.Command{EntityId = evento.Id.ToString(), AppUserId = User.FindFirstValue(ClaimTypes.NameIdentifier), Ipv4 = Ip, Entity = "Evento", Action = "EDIT", Status = firstResult.IsSuccess, Error = firstResult.Error});
                    return ValidationProblem(ModelState);
                }
            
            return await HandleSecurityResult(
                            firstResult, 
                            evento.Id.ToString(), 
                            User.FindFirstValue(ClaimTypes.NameIdentifier), 
                            Ip, 
                            "Evento", 
                            "EDIT"
                        );
        }

        [Authorize(Policy = "IsAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvento(Guid id)
        {
            var Ip = HttpContext.Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            return await HandleSecurityResult(
                            await Mediator.Send(new Delete.Command{Id = id}), 
                            id.ToString(), 
                            User.FindFirstValue(ClaimTypes.NameIdentifier), 
                            Ip, 
                            "Evento", 
                            "DELETE"
                        );
        }
        [HttpPost("{url}/asistir")]
        public async Task<IActionResult> Asistir(string url) {
            return HandleResult(await Mediator.Send(new UpdateAsistencia.Command{Url = url}));
        }
        [Authorize(Policy = "IsAdmin")]
        [HttpPost("{url}/cancelar")]
        public async Task<IActionResult> Cancelar(string url) {
            return HandleResult(await Mediator.Send(new Cancel.Command{Url = url}));
        }
    }
}