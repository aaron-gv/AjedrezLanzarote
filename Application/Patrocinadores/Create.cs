using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Patrocinadores
{
    public class Create
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
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var uniquePatrocinador = await _context.Patrocinadores.FirstOrDefaultAsync(x => x.Url == request.Patrocinador.Url);    
                if (uniquePatrocinador != null)
                {
                    return Result<Unit>.Failure("La URL '"+request.Patrocinador.Url+"' ya existe, y debe ser única. Por favor prueba otra diferente.");
                }
                
                if (request.Patrocinador.Url.Length > 90)
                {
                    return Result<Unit>.Failure("La URL '"+request.Patrocinador.Url+"' es demasiado larga, no debe superar los 90 caracteres.");
                }
                
                if (request.Patrocinador.Title.Length > 220)
                {
                    return Result<Unit>.Failure("El título '"+request.Patrocinador.Url+"' es demasiado largo, no debe superar los 220 caracteres.");
                }
                _context.Patrocinadores.Add(request.Patrocinador);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Fallo al crear patrocinador");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}