using Application.Core;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result == null) return NotFound();
            if (result.IsSuccess && result.Value != null) 
                return Ok(result.Value);
            if (result.IsSuccess && result.Value == null) 
                return NotFound();
            return BadRequest(result.Error);
        }

        protected async Task<ActionResult> HandleSecurityResult<T>(Result<T> result, string EntityId, string AppUserId, string Ip, string Entity, string Action)
        {
            Console.WriteLine("***********************");
            Console.WriteLine(result.IsSuccess);
            Console.WriteLine("***********************");
            await Mediator.Send(new EventsRecord.Command{EntityId = EntityId, AppUserId = AppUserId, Ipv4 = Ip, Entity = Entity, Action = Action, Status = result.IsSuccess, Error = result.Error});
            if (result == null) 
                return NotFound();
            if (result.IsSuccess && result.Value != null) 
            {
                
                
                return Ok(result.Value);
            } else {
                
            }
            if (result.IsSuccess && result.Value == null) 
                NotFound();
            
            
            
            return BadRequest(result.Error);
        }
        
    }
}