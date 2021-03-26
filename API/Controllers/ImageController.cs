using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Images;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Infrastructure.Images;
using Application.Core;
using Microsoft.Extensions.Primitives;

namespace API.Controllers
{
    public class MyModel
    {
        public string Key {get; set;}
    }

    public class ImagesController : BaseApiController
    
    {
        [Authorize(Policy = "IsAdmin")]
        [HttpPost("{evento}/{gallery}")]
        public async Task<ActionResult> CreateImageEntities(IFormCollection Images, Guid evento, Guid gallery)
        {
            var resultado = Request.HttpContext.Request.Form.TryGetValue("collectionTitle",out Microsoft.Extensions.Primitives.StringValues titulo);
            //ActionResult<List<Domain.Image>> Result, Guid GalleryId
            if (gallery == Guid.Parse("00000000-0000-0000-0000-000000000000")) 
                return BadRequest();
             // Cloudinary image management version
                Result<List<Domain.Image>> imgCollectionResult = await Mediator.Send(new CloudinaryUpload.Query {Images = Images});
             // Local storage version: 
                //Result<List<Domain.Image>> imgCollectionResult = await Mediator.Send(new ImageUpload.Query {Images = Images});
            if (!imgCollectionResult.IsSuccess)  
            {
                return BadRequest("Ha ocurrido un problema subiendo los archivos, compruebe que los archivos estén en un formato de imagen válido.");
            }
            if (imgCollectionResult.Value.Count < 1)
            {
                return BadRequest("No se han enviado imágenes válidas");
            }

            return HandleResult(await Mediator.Send(new Application.Images.Create.Command {Images = imgCollectionResult.Value, GalleryId = gallery,EventoId = evento, Title = titulo}));
        }
        [Authorize(Policy = "IsAdmin")]
        [HttpPost("addImages/{gallery}")]
        public async Task<ActionResult> addToCollection(IFormCollection Images, Guid gallery)
        {
            var Gallery = Mediator.Send(new Application.Galleries.Details.Query{Id = gallery}).Result.Value;
            if (Gallery == null)
            {
                return BadRequest();
            }
            // Result<List<Domain.Image>> imgCollectionResult = await Mediator.Send(new ImageUpload.Query {Images = Images});
             Result<List<Domain.Image>> imgCollectionResult = await Mediator.Send(new CloudinaryUpload.Query {Images = Images});
            if (!imgCollectionResult.IsSuccess)  
            {
                return BadRequest("Ha ocurrido un problema subiendo los archivos, compruebe que los archivos estén en un formato de imagen válido.");
            }
            if (imgCollectionResult.Value.Count < 1)
            {
                return BadRequest("No se han enviado imágenes válidas");
            }

            return HandleResult(await Mediator.Send(new Application.Galleries.AddImages.Command {Images = imgCollectionResult.Value, GalleryId = gallery}));
        }
        [Authorize(Policy = "IsAdmin")]
        [HttpPut("imageRename/{imageId}")]
        public async Task<IActionResult> RenameImage(string imageId)
        {
            Request.Form.TryGetValue("title", out StringValues value);
            return HandleResult(await Mediator.Send(new RenameEventoImage.Command{ImageId = Guid.Parse(imageId), Title = value}));
        }
    }
    
}