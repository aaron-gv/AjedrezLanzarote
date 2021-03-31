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
using System.Linq;

namespace Application.Galleries
{
    public class PromoteGallery
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
                        var galleryNoticia = await _context.GalleryNoticias.FindAsync(request.GalleryId, request.EntityId);
                        var currentNoticiaOrder = galleryNoticia.Order;
                        if (currentNoticiaOrder == 0) return Result<Unit>.Failure("Ésta galería ya es la primera.");
                        var noticiaPrevGallery = _context.GalleryNoticias.Where(x => x.NoticiaId == request.EntityId && x.Order==currentNoticiaOrder-1);
                        if (noticiaPrevGallery.Any()) noticiaPrevGallery.FirstAsync().Result.Order = currentNoticiaOrder;
                        galleryNoticia.Order = currentNoticiaOrder -1;
                        break;
                    case "Evento":
                        var galleryEvento = await _context.GalleryEventos.FindAsync(request.GalleryId, request.EntityId);
                        var currentEventoOrder = galleryEvento.Order;
                        if (currentEventoOrder == 0) return Result<Unit>.Failure("Ésta galería ya es la primera.");
                        var eventoPrevGallery = _context.GalleryEventos.Where(x => x.EventoId == request.EntityId && x.Order==currentEventoOrder-1);
                        if (eventoPrevGallery.Any()) eventoPrevGallery.FirstAsync().Result.Order = currentEventoOrder;
                        galleryEvento.Order = currentEventoOrder -1;
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