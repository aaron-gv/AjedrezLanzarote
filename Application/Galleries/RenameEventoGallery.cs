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
    public class RenameEventoGallery
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid EventoId { get; set; }
            public Guid GalleryId { get; set; }
            public string Title { get; set; }

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
                
                
                
                //if (evento == null) return null;
                var gallery = await _context.Galleries.FindAsync(request.GalleryId);
                if (gallery == null)
                    return Result<Unit>.Failure("El evento o la galería no existen");

                gallery.Title = request.Title;
                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Fallo al editar un evento");
                }
                else
                {
                    return Result<Unit>.Success(Unit.Value);
                }

            }
        }
    }
    
}