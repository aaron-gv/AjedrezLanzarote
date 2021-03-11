using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Noticias
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Noticia Noticia { get; set; }

        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Noticia).SetValidator(new NoticiaValidator());
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
                var uniqueNoticia = await _context.Noticias.FirstOrDefaultAsync(x => x.Url == request.Noticia.Url && x.Id != request.Noticia.Id);
                if (uniqueNoticia != null)
                {
                    return Result<Unit>.Failure("La URL '"+request.Noticia.Url+"' ya existe para otra noticia, y debe ser única. Por favor prueba otra diferente.");
                }
                var noticia = await _context.Noticias.FindAsync(request.Noticia.Id);
                _mapper.Map(request.Noticia, noticia);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Fallo al editar noticia");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}