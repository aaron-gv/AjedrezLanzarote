using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Core;
using Application.Galleries;
using Infrastructure.Images;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace API.Controllers
{
    public class GalleryController : BaseApiController
    {
        [Authorize(Policy = "IsAdmin")]
        [HttpGet("{Id}")]
        public async Task<IActionResult> getGallery(string Id)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Id = Guid.Parse(Id)}));
        }
        [Authorize(Policy = "IsAdmin")]
        [HttpGet("list/")]
        public async Task<IActionResult> getAllGalleries(string Id)
        {
            return HandleResult(await Mediator.Send(new List.Query{}));
        }
        [Authorize(Policy = "IsAdmin")]
        [HttpPut("gallerydel/{galleryId}/{entityId}")]
        public async Task<IActionResult> DeleteGallery(string galleryId, string entityId)
        {
            Request.Form.TryGetValue("entityType", out StringValues entityType);
            return HandleResult(await Mediator.Send(new Delete.Command{Id = Guid.Parse(galleryId), EntityId = Guid.Parse(entityId), EntityType = entityType}));
        }

        [Authorize(Policy = "IsAdmin")]
        [HttpPut("imagedel/{imageId}/{galleryId}")]
        public async Task<IActionResult> DeleteImageGallery(string imageId, string galleryId)
        {
            return HandleResult(await Mediator.Send(new DeleteImage.Command{ImageId = Guid.Parse(imageId),GalleryId = Guid.Parse(galleryId)}));
        }
        [Authorize(Policy = "IsAdmin")]
        [HttpPost("create/")]
        public async Task<IActionResult> create(IFormCollection Files, IFormCollection Add)
        {
            var form = Request.HttpContext.Request.Form;
            form.TryGetValue("title", out StringValues title);
            form.TryGetValue("entityId", out StringValues entityId);
            form.TryGetValue("entityType", out StringValues entityType);
            if (entityType != "Evento" || entityType != "Noticia")
                BadRequest("Solicitud incorrecta");

            Console.WriteLine("TITULO: "+title+" ENTITYID: "+entityId);
            Result<List<Domain.Image>> imgCollectionResult = await Mediator.Send(new CloudinaryUpload.Query {Images = Files});
            if (!imgCollectionResult.IsSuccess)  
            {
                return BadRequest("Ha ocurrido un problema subiendo los archivos, compruebe que los archivos estén en un formato de imagen válido.");
            }
            if (imgCollectionResult.Value.Count < 1 && Add.Count < 1)
            {
                return BadRequest("No se han enviado imágenes válidas");
            }
            
            return HandleResult(await Mediator.Send(new Create.Command {NewImages = imgCollectionResult.Value, ReuseImages = Add, EntityId = Guid.Parse(entityId), Title = title, EntityType = entityType}));
        }

        [Authorize(Policy = "IsAdmin")]
        [HttpPut("imageposition/{imageId}/{galleryId}/{order}")]
        public async Task<IActionResult> ChangeImagePosition(string imageId, string galleryId, int order)
        {
            return HandleResult(await Mediator.Send(new Reposition.Command{ImageId = Guid.Parse(imageId),GalleryId = Guid.Parse(galleryId), Order= order}));
        }

        [Authorize(Policy = "IsAdmin")]
        [HttpPut("rename/{entityId}/{galleryId}")]
        public async Task<IActionResult> RenameGallery(string entityId, string galleryId)
        {
            Request.Form.TryGetValue("title", out StringValues title);
            Request.Form.TryGetValue("entityType", out StringValues entityType);
            return HandleResult(await Mediator.Send(new RenameGallery.Command{GalleryId = Guid.Parse(galleryId), EntityId = Guid.Parse(entityId), Title = title, EntityType = entityType}));
        }

        [Authorize(Policy = "IsAdmin")]
        [HttpPut("setmainimage/{entityId}/{imageId}")]
        public async Task<ActionResult> setMainImage(Guid entityId, Guid imageId)
        {
            Request.Form.TryGetValue("entityType", out StringValues entityType);
            
            //var Ip = HttpContext.Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            return HandleResult(await Mediator.Send(new SetMainImage.Command { EntityId = entityId, ImageId = imageId, EntityType = entityType }));
        }
        [Authorize(Policy = "IsAdmin")]
        [HttpPut("changegalleryvisibility/{entityId}/{galleryId}")]
        public async Task<ActionResult> ChangeGalleryVisibility(Guid entityId, Guid galleryId)
        {
            Request.Form.TryGetValue("entityType", out StringValues entityType);
            //var Ip = HttpContext.Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            return HandleResult(await Mediator.Send(new ChangeGalleryVisibility.Command { EntityId = entityId, GalleryId = galleryId, EntityType = entityType }));
        }
        [Authorize(Policy = "IsAdmin")]
        [HttpPut("promotegallery/{entityId}/{galleryId}")]
        public async Task<ActionResult> promoteGallery(Guid entityId, Guid galleryId)
        {
            Request.Form.TryGetValue("entityType", out StringValues entityType);
            //var Ip = HttpContext.Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            return HandleResult(await Mediator.Send(new PromoteGallery.Command { EntityId = entityId, GalleryId = galleryId, EntityType = entityType }));
        }

        [Authorize(Policy = "IsAdmin")]
        [HttpPut("imageRename/{galleryId}/{imageId}")]
        public async Task<IActionResult> RenameImage(string galleryId, string imageId)
        {
            Request.Form.TryGetValue("title", out StringValues title);
            return HandleResult(await Mediator.Send(new RenameImage.Command{GalleryId = Guid.Parse(galleryId), ImageId = Guid.Parse(imageId), Title = title}));
        }

        [Authorize(Policy = "IsAdmin")]
        [HttpPut("addImages/{gallery}")]
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

            return HandleResult(await Mediator.Send(new AddImages.Command {Images = imgCollectionResult.Value, GalleryId = gallery}));
        }
    }  
}