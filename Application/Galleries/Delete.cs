using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Galleries
{
    public class DeleteEventoGallery
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
            public Guid EventoId { get; set; }
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
                var gallery = await _context.Galleries.FindAsync(request.Id);
                if (gallery == null)
                    return Result<Unit>.Failure("La galería especificada no es válida, por favor refresque la página y vuelva a intentarlo.");

                var galleryImages = await _context.GalleryImages.Where(x => x.GalleryId == gallery.Id).ToListAsync();

                var eventoGallery = await _context.GalleryEventos.FindAsync(request.Id, request.EventoId);


                var relationsEvento = _context.GalleryEventos.AnyAsync(x => x.GalleryId == gallery.Id && x.EventoId != request.EventoId).Result;
                if (relationsEvento)
                {

                    _context.Remove(eventoGallery);
                    var resultFirst = await _context.SaveChangesAsync() > 0;
                    if (!resultFirst) return Result<Unit>.Failure("Fallo al eliminar una galeria");
                    return Result<Unit>.Success(Unit.Value);
                }

                foreach (var item in galleryImages)
                {
                    var imageObject = await _context.Images.Where(x => x.Id == item.ImageId).FirstOrDefaultAsync();

                    var relatedimages = await _context.GalleryImages.AnyAsync(x => x.ImageId == imageObject.Id && x.GalleryId != gallery.Id);
                    if (relatedimages == false)
                    {
                        // Cloud image management: 
                        
                        if (imageObject.CloudId != imageObject.CloudThumbId)
                        await _imageAccessor.DeleteImage(imageObject.CloudThumbId);

                        await _imageAccessor.DeleteImage(imageObject.CloudId);
                        
                        /*
                            For local storage
                            var filename = "C:\\workspace\\AjedrezLanzarote\\client-app\\public\\assets\\galleryImages\\"+imageObject.Result.Filename;
                            var thumbfile = "C:\\workspace\\AjedrezLanzarote\\client-app\\public\\"+imageObject.Result.Thumbnail;
                            System.IO.File.Delete(filename);
                            System.IO.File.Delete(thumbfile);
                        */
                        _context.Remove(imageObject);
                    }
                    _context.Remove(item);

                }
                _context.Remove(eventoGallery);
                var order = 0;
                await _context.GalleryEventos.Where(x => x.EventoId == request.EventoId && x.GalleryId!=request.Id).OrderBy(x => x.Order).ForEachAsync(galleryEvento => {
                    galleryEvento.Order = order;
                    order++;
                });


                _context.Remove(gallery);

                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Fallo al eliminar una galeria");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}

