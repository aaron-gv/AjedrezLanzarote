using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Noticias;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class NoticiasController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetNoticias(CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new List.Query(), ct));
        }
        [AllowAnonymous]
        [HttpGet("{url}")]
        public async Task<IActionResult> GetNoticia(string url)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Url = url}));
        }
        [HttpPost]
        public async Task<IActionResult> CreateNoticia(Noticia noticia)
        {
            return HandleResult(await Mediator.Send(new Application.Noticias.Create.Command {Noticia = noticia}));
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> EditNoticia(Guid id, Noticia noticia)
        {
            noticia.Id = id;
            return HandleResult(await Mediator.Send(new Application.Noticias.Edit.Command{Noticia = noticia}));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNoticia(Guid id)
        {
            return HandleResult(await Mediator.Send(new Application.Noticias.Delete.Command{Id = id}));
        }
    }
}