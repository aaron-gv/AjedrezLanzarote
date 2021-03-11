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

namespace Application.Noticias
{
    public class Create
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
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                
                var uniqueNoticia = await _context.Noticias.FirstOrDefaultAsync(x => x.Url == request.Noticia.Url);
                if (uniqueNoticia != null)
                {
                    return Result<Unit>.Failure("La URL '"+request.Noticia.Url+"' ya existe, y debe ser única. Por favor prueba otra diferente.");
                }
                if (request.Noticia.Url.Length > 90)
                {
                    return Result<Unit>.Failure("La URL '"+request.Noticia.Url+"' es demasiado larga, no debe superar los 90 caracteres.");
                }
                
                if (request.Noticia.Title.Length > 220)
                {
                    return Result<Unit>.Failure("El título '"+request.Noticia.Url+"' es demasiado largo, no debe superar los 220 caracteres.");
                }
                var AppUserId = _userAccessor.GetUserId();
                request.Noticia.AppUserId = AppUserId;
                _context.Noticias.Add(request.Noticia);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Fallo al crear noticia");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}