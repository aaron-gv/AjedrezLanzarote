using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Patrocinadores
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Patrocinador Patrocinador { get; set; }

        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Patrocinador).SetValidator(new PatrocinadorValidator());
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
                var uniquePatrocinador = await _context.Patrocinadores.FirstOrDefaultAsync(x => x.Url == request.Patrocinador.Url && x.Id != request.Patrocinador.Id);    
                if (uniquePatrocinador != null)
                {
                    return Result<Unit>.Failure("La URL '"+request.Patrocinador.Url+"' ya existe para otro patrocinador, y debe ser única. Por favor prueba otra diferente.");
                }
                
                var patrocinador = await _context.Patrocinadores.FindAsync(request.Patrocinador.Id);
                _mapper.Map(request.Patrocinador, patrocinador);
                var result = await _context.SaveChangesAsync() > 0;
                
                if (!result) return Result<Unit>.Failure("Fallo al editar patrocinador");
                
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}