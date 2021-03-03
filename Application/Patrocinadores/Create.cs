using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Patrocinadores
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Patrocinador Patrocinador { get; set; }

        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Patrocinadores.Add(request.Patrocinador);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Fallo al crear patrocinador");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}