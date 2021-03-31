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
    public class ChangeGalleryVisibility
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid EntityId { get; set; }
            public Guid GalleryId { get; set; }
            public string EntityType { get; set; }

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
                
                switch (request.EntityType) {
                    case "Noticia":
                        var noticia = await _context.Noticias.FindAsync(request.EntityId);
                        var galleryNoticia = await _context.GalleryNoticias.FirstOrDefaultAsync(x => x.GalleryId == request.GalleryId && x.NoticiaId == request.EntityId);
                        if (noticia == null || galleryNoticia == null) return Result<Unit>.Failure("El evento o la relación con la galería no existen.");
                        galleryNoticia.Public = !galleryNoticia.Public;
                        break;
                    case "Evento":
                        var evento = await _context.Eventos.FindAsync(request.EntityId);
                        var galleryEvento = await _context.GalleryEventos.FirstOrDefaultAsync(x => x.GalleryId == request.GalleryId && x.EventoId == request.EntityId);
                        if (evento == null || galleryEvento == null) return Result<Unit>.Failure("El evento o la relación con la galería no existen.");
                        galleryEvento.Public = !galleryEvento.Public;
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
                    return Result<Unit>.Failure("Fallo al cambiar visibilidad de la galeria");
                }
                else
                {
                    return Result<Unit>.Success(Unit.Value);
                }
            }
        }
    }
    
}