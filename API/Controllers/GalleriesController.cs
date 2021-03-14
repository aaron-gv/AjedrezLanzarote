using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Galleries;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.Features;
using Infrastructure.Security;
using System.Security.Claims;

namespace API.Controllers
{
    public class GalleryEventoController : BaseApiController
    {
        [Authorize(Policy = "IsAdmin")]
        [HttpDelete("{galleryId}")]
        public async Task<IActionResult> DeleteGallery(string galleryId)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = Guid.Parse(galleryId)}));
        }
        [Authorize(Policy = "IsAdmin")]
        [HttpGet("{Id}")]
        public async Task<IActionResult> getGallery(string Id)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Id = Guid.Parse(Id)}));
        }
    } 
}