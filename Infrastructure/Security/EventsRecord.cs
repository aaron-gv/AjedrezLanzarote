using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public static class EventsRecord
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string EntityId { get; set; }
            public string AppUserId {get; set;}
            public string Ipv4 {get; set; }
            public string Entity { get; set; }
            public string Action { get; set; }
            public Boolean Status { get; set; }
            public string Error { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                
                var userId = _userAccessor.GetUserId();
                
                var EventoModifyEvent = new EntityEvent{
                    EntityId = request.EntityId,
                    AppUserId = userId,
                    Ip = request.Ipv4,
                    Action = request.Action,
                    Entity = request.Entity,
                    Status = request.Status,
                    Error = request.Error
                };
                

                _context.EntityEvents.Add(EventoModifyEvent);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Fallo al crear evento");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}