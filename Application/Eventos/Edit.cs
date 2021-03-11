using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;
using Application.Interfaces;
using System;
using Microsoft.EntityFrameworkCore;

namespace Application.Eventos
{
    public class Edit
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
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccesor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccesor)
            {
                _userAccesor = userAccesor;
                _mapper = mapper;
                _context = context;

            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                
                var uniqueEvent = await _context.Eventos.FirstOrDefaultAsync(x => x.Url == request.Evento.Url && x.Id != request.Evento.Id);    
                if (uniqueEvent != null)
                {
                    return Result<Unit>.Failure("La URL '"+request.Evento.Url+"' ya existe para otro evento, y debe ser única. Por favor prueba otra diferente.");
                }
                
                //if (evento == null) return null;
                var evento = await _context.Eventos.FindAsync(request.Evento.Id);
                _mapper.Map(request.Evento, evento);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Fallo al editar un evento");
                }
                else
                {
                    return Result<Unit>.Success(Unit.Value);
                }

            }
        }
    }
    
}