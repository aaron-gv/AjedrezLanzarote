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


namespace Application.Images
{
    public class RenameEventoImage
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid EventoId { get; set; }
            public Guid ImageId { get; set; }
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
                var image = await _context.Images.FindAsync(request.ImageId);
                if (image == null)
                    return Result<Unit>.Failure("El evento o la galería no existen");

                Console.WriteLine("///////////////////////");
                Console.WriteLine(request.Title);
 
                image.Title = request.Title;
                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Fallo al editar descripcion de imagen");
                }
                else
                {
                    return Result<Unit>.Success(Unit.Value);
                }

            }
        }
    }
    
}