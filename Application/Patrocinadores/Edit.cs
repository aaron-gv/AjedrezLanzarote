using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Patrocinadores
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Patrocinador Patrocinador { get; set; }

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
                var patrocinador = await _context.Patrocinadores.FindAsync(request.Patrocinador.Id);
                _mapper.Map(request.Patrocinador, patrocinador);
                await _context.SaveChangesAsync();
                return Unit.Value;
            }
        }
    }
}