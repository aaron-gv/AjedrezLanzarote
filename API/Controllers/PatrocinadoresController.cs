using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Application.Patrocinadores;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class PatrocinadoresController : BaseApiController
    {
        private readonly DataContext _context;
        public PatrocinadoresController(DataContext context)
        {
            _context = context;
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetPatrocinadores(CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new List.Query(), ct));
        }
        [AllowAnonymous]
        [HttpGet("{url}")]
        public async Task<IActionResult> GetPatrocinador(string url)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Url = url}));
        }

        [HttpPost]
        public async Task<IActionResult> CreatePatrocinador(Patrocinador patrocinador)
        {
            var Ip = HttpContext.Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            var firstResult = await Mediator.Send(new Create.Command {Patrocinador = patrocinador});
            if (!firstResult.IsSuccess) {
                    ModelState.AddModelError("some", firstResult.Error);
                    await Mediator.Send(new EventsRecord.Command{EntityId = patrocinador.Id.ToString(), AppUserId = User.FindFirstValue(ClaimTypes.NameIdentifier), Ipv4 = Ip, Entity = "Patrocinador", Action = "CREATE", Status = firstResult.IsSuccess, Error = firstResult.Error});
                    return ValidationProblem(ModelState);
                }
            return await HandleSecurityResult(
                            firstResult,
                            patrocinador.Id.ToString(), 
                            User.FindFirstValue(ClaimTypes.NameIdentifier), 
                            Ip, 
                            "Patrocinador", 
                            "CREATE"
                        );
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> EditPatrocinador(Guid id, Patrocinador patrocinador)
        {
            patrocinador.Id = id;
            var Ip = HttpContext.Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            var firstResult = await Mediator.Send(new Edit.Command{Patrocinador = patrocinador});
            if (!firstResult.IsSuccess) {
                    ModelState.AddModelError("some", firstResult.Error);
                    await Mediator.Send(new EventsRecord.Command{EntityId = patrocinador.Id.ToString(), AppUserId = User.FindFirstValue(ClaimTypes.NameIdentifier), Ipv4 = Ip, Entity = "Patrocinador", Action = "EDIT", Status = firstResult.IsSuccess, Error = firstResult.Error});
                    return ValidationProblem(ModelState);
                }
            return await HandleSecurityResult(
                            firstResult,
                            patrocinador.Id.ToString(), 
                            User.FindFirstValue(ClaimTypes.NameIdentifier), 
                            Ip, 
                            "Patrocinador", 
                            "EDIT"
                        );
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatrocinador(Guid id)
        {
            var Ip = HttpContext.Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            return await HandleSecurityResult(
                            await Mediator.Send(new Delete.Command{Id = id}),
                            id.ToString(), 
                            User.FindFirstValue(ClaimTypes.NameIdentifier), 
                            Ip, 
                            "Patrocinador", 
                            "DELETE"
                        );
        }
    }
}