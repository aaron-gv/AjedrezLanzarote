using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Patrocinadores;
using Domain;
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

        [HttpGet]
        public async Task<ActionResult<List<Patrocinador>>> GetPatrocinadores()
        {
            return await _context.Patrocinadores.ToListAsync();
        }
        [HttpGet("{url}")]
        public async Task<ActionResult<Patrocinador>> GetPatrocinador(string url)
        {
            return await _context.Patrocinadores.Where(b => b.Url == url).FirstOrDefaultAsync();
        }
                [HttpPost]
        public async Task<IActionResult> CreatePatrocinador(Patrocinador patrocinador)
        {
            return Ok(await Mediator.Send(new Create.Command {Patrocinador = patrocinador}));
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> EditPatrocinador(Guid id, Patrocinador patrocinador)
        {
            patrocinador.Id = id;
            return Ok(await Mediator.Send(new Edit.Command{Patrocinador = patrocinador}));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatrocinador(Guid id)
        {
            return Ok(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}