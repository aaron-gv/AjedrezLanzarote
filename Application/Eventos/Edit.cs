using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

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
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var evento = await _context.Eventos.FindAsync(request.Evento.Id);

                //if (evento == null) return null;
                
                _mapper.Map(request.Evento, evento);
                var result = await _context.SaveChangesAsync() > 0;
                if  (!result) return Result<Unit>.Failure("Fallo al editar un evento");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}