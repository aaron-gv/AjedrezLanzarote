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
    public class RenameGallery
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid EntityId { get; set; }
            public Guid GalleryId { get; set; }
            public string Title { get; set; }
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
                
                switch(request.EntityType) {
                    case "Evento":
                        var galleryEvento = await _context.GalleryEventos.FindAsync(request.GalleryId, request.EntityId);
                        if (galleryEvento == null) return Result<Unit>.Failure("El evento o la galería no existen");
                        galleryEvento.Title = request.Title;
                        break;
                    case "Noticia":
                        var galleryNoticia = await _context.GalleryNoticias.FindAsync(request.GalleryId, request.EntityId);
                        if (galleryNoticia == null) return Result<Unit>.Failure("La noticia o la galería no existen");
                        galleryNoticia.Title = request.Title;
                        break;
                }
                
                //if (evento == null) return null;
                
                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("No ha habido cambios");
                }
                else
                {
                    return Result<Unit>.Success(Unit.Value);
                }

            }
        }
    }
    
}