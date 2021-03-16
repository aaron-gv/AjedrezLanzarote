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
    }
    
}