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

namespace Application.Eventos
{
    public class PromoteGallery
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
                var galleryEvento = await _context.GalleryEventos.FindAsync(request.GalleryId, request.EventoId);
                var currentOrder = galleryEvento.Order;
                if (currentOrder == 0)
                    return Result<Unit>.Failure("Ésta galería ya es la primera.");
                
                var eventoPrevGallery = _context.GalleryEventos.Where(x => x.EventoId == request.EventoId && x.Order==currentOrder-1);
                if (eventoPrevGallery.Any())
                    eventoPrevGallery.FirstAsync().Result.Order = currentOrder;
                
                galleryEvento.Order = currentOrder -1;
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