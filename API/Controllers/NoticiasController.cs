using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class NoticiasController : BaseApiController
    {
        private readonly DataContext _context;
        public NoticiasController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Noticia>>> GetNoticias()
        {
            return await _context.Noticias.ToListAsync();
        }

        [HttpGet("{url}")]
        public async Task<ActionResult<Noticia>> GetNoticia(string url)
        {
            return await _context.Noticias.Where(b => b.Url == url).FirstOrDefaultAsync();
        }
        [HttpPost]
        public async Task<IActionResult> CreateNoticia(Noticia noticia)
        {
            return Ok(await Mediator.Send(new Application.Noticias.Create.Command {Noticia = noticia}));
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> EditNoticia(Guid id, Noticia noticia)
        {
            noticia.Id = id;
            return Ok(await Mediator.Send(new Application.Noticias.Edit.Command{Noticia = noticia}));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNoticia(Guid id)
        {
            return Ok(await Mediator.Send(new Application.Noticias.Delete.Command{Id = id}));
        }
    }
}