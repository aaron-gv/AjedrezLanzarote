using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Images;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Galleries
{
    public class Reposition
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid GalleryId { get; set; }
            public Guid ImageId { get; set; }
            public int Order {get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IImageAccessor _imageAccessor;
            public Handler(DataContext context, IImageAccessor imageAccessor)
            {
                _imageAccessor = imageAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                
                var galleryImages = await _context.GalleryImages.Where(x => x.GalleryId == request.GalleryId).OrderBy(s => s.Order).ToListAsync();

                if (galleryImages == null)
                {
                    return Result<Unit>.Failure("Imagen/Colección no encontrados");
                }
                var image = galleryImages.FirstOrDefault(x => x.ImageId == request.ImageId);
                if (image.Order < request.Order)
                {
                    // hay que bajarlo
                    Console.WriteLine("Hay que bajarlo");
                    var toDeminish = galleryImages.Where(x => x.GalleryId == request.GalleryId && x.Order > image.Order && x.Order <= request.Order);
                    toDeminish.ToList().ForEach(todem => todem.Order--);

                } else if (image.Order > request.Order)
                {
                    // hay que subirlo de posicion
                    Console.WriteLine("Hay que subirlo");
                    var toDeminish = galleryImages.Where(x => x.GalleryId == request.GalleryId && x.Order >= request.Order && x.Order < image.Order);
                    toDeminish.ToList().ForEach(todem => todem.Order++);
                    
                   
                } else {
                    return Result<Unit>.Failure("Se ha especificado la misma posicion");
                }
                image.Order = request.Order;
                //_context.Remove(relation);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Fallo al eliminar imagen");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}

