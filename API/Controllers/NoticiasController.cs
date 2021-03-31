using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Noticias;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class NoticiasController : BaseApiController
    {
        private readonly IUserAccessor _userAccessor;
        public NoticiasController(IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetNoticias(CancellationToken ct)
        {
            if (_userAccessor.GetUserRole() == "Admin" || _userAccessor.GetUserRole() == "Desarrollador")
            {
                return HandleResult(await Mediator.Send(new ListAll.Query(), ct));
            }
            else
            {
                return HandleResult(await Mediator.Send(new ListPublic.Query(), ct));
            } 
        }
        [AllowAnonymous]
        [HttpGet("{url}")]
        public async Task<IActionResult> GetNoticia(string url)
        {
            if (_userAccessor.GetUserRole() == "Admin" || _userAccessor.GetUserRole() == "Desarrollador") {
                return HandleResult(await Mediator.Send(new DetailsAll.Query{Url = url}));
            } else {
                return HandleResult(await Mediator.Send(new DetailsPublic.Query{Url = url}));
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateNoticia(Noticia noticia)
        {
            var Ip = HttpContext.Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            var firstResult = await Mediator.Send(new Application.Noticias.Create.Command { Noticia = noticia });
            if (!firstResult.IsSuccess)
            {
                ModelState.AddModelError("some", firstResult.Error);
                await Mediator.Send(new EventsRecord.Command { EntityId = noticia.Id.ToString(), AppUserId = User.FindFirstValue(ClaimTypes.NameIdentifier), Ipv4 = Ip, Entity = "Noticia", Action = "CREATE", Status = firstResult.IsSuccess, Error = firstResult.Error });
                return ValidationProblem(ModelState);
            }
            return await HandleSecurityResult(
                            firstResult,
                            noticia.Id.ToString(),
                            User.FindFirstValue(ClaimTypes.NameIdentifier),
                            Ip,
                            "Noticia",
                            "CREATE"
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditNoticia(Guid id, Noticia noticia)
        {
            noticia.Id = id;
            var Ip = HttpContext.Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            var firstResult = await Mediator.Send(new Application.Noticias.Edit.Command { Noticia = noticia });
            if (!firstResult.IsSuccess)
            {
                ModelState.AddModelError("some", firstResult.Error);
                await Mediator.Send(new EventsRecord.Command { EntityId = noticia.Id.ToString(), AppUserId = User.FindFirstValue(ClaimTypes.NameIdentifier), Ipv4 = Ip, Entity = "Noticia", Action = "EDIT", Status = firstResult.IsSuccess, Error = firstResult.Error });
                return ValidationProblem(ModelState);
            }
            return await HandleSecurityResult(
                            firstResult,
                            noticia.Id.ToString(),
                            User.FindFirstValue(ClaimTypes.NameIdentifier),
                            Ip,
                            "Noticia",
                            "EDIT"
                        );
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNoticia(Guid id)
        {
            var Ip = HttpContext.Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            return await HandleSecurityResult(
                            await Mediator.Send(new Application.Noticias.Delete.Command { Id = id }),
                            id.ToString(),
                            User.FindFirstValue(ClaimTypes.NameIdentifier),
                            Ip,
                            "Noticia",
                            "DELETE"
                        );
        }
    }
}