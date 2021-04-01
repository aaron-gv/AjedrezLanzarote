using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Eventos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
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
                var evento = await _context.Eventos.FindAsync(request.Id);
                var galleries = await _context.GalleryEventos.Where(x => x.EventoId == request.Id).ToListAsync();

                //if (evento == null) return null;

                _context.Remove(evento);
                
                foreach (GalleryEvento Gallery in galleries)
                {
                    var images = await _context.GalleryImages.Where(x => x.GalleryId == Gallery.GalleryId).ToListAsync();
                    if (await _context.GalleryEventos.Where(x => x.GalleryId == Gallery.GalleryId && x.EventoId != request.Id).CountAsync() < 1 && await _context.GalleryNoticias.Where(x => x.GalleryId == Gallery.GalleryId).CountAsync() < 1)
                    {
                        Console.WriteLine("wipe Gallery...");
                        foreach (var galleryImage in images)
                        {
                            Console.WriteLine("this image..." + galleryImage.ImageId);
                            var imageObject = await _context.Images.Where(x => x.Id == galleryImage.ImageId).FirstOrDefaultAsync();

                            var relatedimages = await _context.GalleryImages.AnyAsync(x => x.ImageId == imageObject.Id && x.GalleryId != Gallery.GalleryId);
                            if (relatedimages == false)
                            {
                                Console.WriteLine(" image will be wipped");
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
                            else
                            {
                                Console.WriteLine("image wont be wipped...");
                            }
                            _context.Remove(galleryImage);
                            Console.WriteLine("relation galleryImage wiped...");
                        }
                        _context.Remove(Gallery);
                        Console.WriteLine("Gallery wipped...");
                    }
                    
                }
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Fallo al eliminar un evento");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}