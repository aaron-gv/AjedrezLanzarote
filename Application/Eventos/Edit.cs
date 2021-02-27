using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Eventos
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Evento Evento { get; set; }

        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var evento = await _context.Eventos.FindAsync(request.Evento.Id);
                _mapper.Map(request.Evento, evento);
                await _context.SaveChangesAsync();
                return Unit.Value;
            }
        }
    }
}