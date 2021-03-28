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
    public class SetMainImage
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid EventoId { get; set; }
            public Guid ImageId { get; set; }

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
                Console.WriteLine("EventoId: "+request.EventoId+" , ImageId: "+request.ImageId);
                
                    
                var evento = await _context.Eventos.FindAsync(request.EventoId);
                //if (evento == null) return Result<Unit>.Failure("El evento no existe.");
                
                var imagen = await _context.Images.FindAsync(request.ImageId);
                //if (imagen == null) return Result<Unit>.Failure("La imagen no existe.");
                
                evento.ImageId = imagen.Id;
                evento.Image = imagen;
                
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