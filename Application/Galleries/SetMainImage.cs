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


namespace Application.Galleries
{
    public class SetMainImage
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid EntityId { get; set; }
            public Guid ImageId { get; set; }
            public string EntityType { get; set; }

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
                switch (request.EntityType) {
                    case "Noticia":
                        var noticia = await _context.Noticias.FindAsync(request.EntityId);
                        var imagenNoticia = await _context.Images.FindAsync(request.ImageId);
                        if (noticia == null || imagenNoticia == null) Result<Unit>.Failure("Alguno de los valores no existe.");
                        noticia.ImageId = imagenNoticia.Id;
                        noticia.Image = imagenNoticia;
                        break;
                    case "Evento":
                        var evento = await _context.Eventos.FindAsync(request.EntityId);
                        var imagenEvento = await _context.Images.FindAsync(request.ImageId);
                        if (evento == null || imagenEvento == null) Result<Unit>.Failure("Alguno de los valores no existe.");
                        evento.ImageId = imagenEvento.Id;
                        evento.Image = imagenEvento;
                        break;
                    case "AppUser":
                        var user = await _context.Users.FindAsync(request.EntityId);
                        break;
                    default:
                        return Result<Unit>.Failure("La solicitud es incorrecta.");
                }
                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Fallo al establecer portada de evento");
                }
                else
                {
                    return Result<Unit>.Success(Unit.Value);
                }
            }
        }
    }
    
}