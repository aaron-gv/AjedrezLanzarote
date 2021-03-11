using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Eventos
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Evento Evento { get; set; }

        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Evento).SetValidator(new EventoValidator());
            }
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
                var uniqueEvent = await _context.Eventos.FirstOrDefaultAsync (x => x.Url == request.Evento.Url);    
                if (uniqueEvent != null)
                {
                    return Result<Unit>.Failure("La URL '"+(request.Evento.Url).Substring(0,20)+"' ya existe, y debe ser única. Por favor prueba otra diferente.");
                }
               
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                var asistente = new EventoAsistente
                {
                    AppUser = user,
                    Evento = request.Evento,
                    IsHost = true
                };

                request.Evento.Asistentes.Add(asistente);
                request.Evento.AppUserId = _userAccessor.GetUserId();
                request.Evento.AppUser = user;
                
                _context.Eventos.Add(request.Evento);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Fallo al crear evento");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}