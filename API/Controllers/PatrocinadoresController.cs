using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Patrocinadores;
using Domain;
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
            return HandleResult(await Mediator.Send(new Create.Command {Patrocinador = patrocinador}));
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> EditPatrocinador(Guid id, Patrocinador patrocinador)
        {
            patrocinador.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{Patrocinador = patrocinador}));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatrocinador(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}