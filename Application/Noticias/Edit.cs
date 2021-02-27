using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Noticias
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Noticia Noticia { get; set; }

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
                var noticia = await _context.Noticias.FindAsync(request.Noticia.Id);
                _mapper.Map(request.Noticia, noticia);
                await _context.SaveChangesAsync();
                return Unit.Value;
            }
        }
    }
}