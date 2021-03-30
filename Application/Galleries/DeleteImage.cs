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
    public class DeleteImage
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid GalleryId { get; set; }
            public Guid ImageId { get; set; }
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
                var gallery = await _context.Galleries.FindAsync(request.GalleryId);
                var image = await _context.Images.FindAsync(request.ImageId);
                var relation = await _context.GalleryImages.FindAsync(request.GalleryId, request.ImageId);
                
                
                if (relation == null || gallery == null || image == null)
                {
                    return Result<Unit>.Failure("Imagen/Colección no encontrados");
                }
                _context.Remove(relation);
                
                var order = 0;
                await _context.GalleryImages.Where(x => x.GalleryId == request.GalleryId && x.ImageId != request.ImageId).OrderBy(x => x.Order).ForEachAsync(galleryImage => {
                    Console.WriteLine(galleryImage.ImageId);
                    Console.WriteLine(galleryImage.Order + "=> " + order);
                    galleryImage.Order = order;
                    order++;
                });
                
                
                var relatedimages = _context.GalleryImages.AnyAsync(x => x.ImageId == image.Id && x.GalleryId != gallery.Id).Result;
                if (!relatedimages)
                {
                    // Cloud image management: 
                    if (image.CloudId != image.CloudThumbId)
                        await _imageAccessor.DeleteImage(image.CloudThumbId);

                    await _imageAccessor.DeleteImage(image.CloudId);
                    /*
                        For fileSystem image management: 
                        var filename = "C:\\workspace\\AjedrezLanzarote\\client-app\\public\\assets\\galleryImages\\"+image.Filename;
                        var thumbfile = "C:\\workspace\\AjedrezLanzarote\\client-app\\public\\"+image.Thumbnail;
                        System.IO.File.Delete(filename);
                        System.IO.File.Delete(thumbfile);
                    */
                    _context.Remove(image);
                }
                

                var relatedgalleries = _context.GalleryImages.AnyAsync(x => x.GalleryId == gallery.Id && x.ImageId != image.Id).Result;
                if (!relatedgalleries)
                {
                    _context.Remove(gallery); 
                } 
                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Fallo al eliminar imagen");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}

