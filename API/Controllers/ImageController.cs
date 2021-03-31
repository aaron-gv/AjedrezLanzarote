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
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetImage(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

    }
    
}