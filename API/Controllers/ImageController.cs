using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Images;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Infrastructure.Files;
using Application.Core;

namespace API.Controllers
{
    public class ImagesController : BaseApiController
    
    {
        public ILogger<ImagesController> logger;
        /*
        [AllowAnonymous]
        [HttpGet("{collectionId}")]
        public async Task<IActionResult> GetImages(CancellationToken ct)
        {
            return Ok();
            //return HandleResult(await Mediator.Send(new List.Query(this.HttpContext.Request.Headers), ct));
        }
        
        [AllowAnonymous]
        [HttpGet("{url}")]
        public async Task<IActionResult> GetImage(string url)
        {
            return Ok();
            //return HandleResult(await Mediator.Send(new Details.Query{Url = url}));
        }
        */
        public async Task<Result<List<Domain.Image>>> CreateImages(List<IFormFile> Images)
        {
            return await Mediator.Send(new ImageUpload.Query {Images = Images});
            
            //return HandleResult(await Mediator.Send(new Create.Command {Images = Images}));;
            //return HandleResult(await Mediator.Send(new Create.Command {Evento = evento}));
        }
        [Authorize(Policy = "IsAdmin")]
        [HttpPost("{evento}/{gallery}")]
        public async Task<ActionResult> CreateImageEntities(List<IFormFile> Images, Guid evento, Guid gallery)
        {
            //ActionResult<List<Domain.Image>> Result, Guid GalleryId
            if (gallery == Guid.Parse("00000000-0000-0000-0000-000000000000"))
                return BadRequest();
             
             Result<List<Domain.Image>> imgCollectionResult = await Mediator.Send(new ImageUpload.Query {Images = Images});
            if (!imgCollectionResult.IsSuccess)
            {
                return BadRequest("Ha ocurrido un problema subiendo los archivos, compruebe que los archivos estén en un formato de imagen válido.");
            }
            if (imgCollectionResult.Value.Count < 1)
            {
                return BadRequest("No se han enviado imágenes válidas");
            }

            return HandleResult(await Mediator.Send(new Application.Images.Create.Command {Images = imgCollectionResult.Value, GalleryId = gallery,EventoId = evento}));
        }
        /*
        [Authorize(Policy = "IsAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImage(Guid id)
        {
            return Ok();
            //return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }*/
        
    }
    
}