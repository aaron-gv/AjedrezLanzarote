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


namespace Application.Eventos
{
    public class ChangeGalleryVisibility
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid EventoId { get; set; }
            public Guid GalleryId { get; set; }

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
                
                var evento = await _context.Eventos.FindAsync(request.EventoId);
                var galleryEvento = await _context.GalleryEventos.FirstOrDefaultAsync(x => x.GalleryId == request.GalleryId);
                if (evento == null)
                {
                    return Result<Unit>.Failure("El evento no existe.");
                }
                if (galleryEvento == null)
                {
                    return Result<Unit>.Failure("La relación Galería/Evento no existe.");
                }
                galleryEvento.Public = !galleryEvento.Public;

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