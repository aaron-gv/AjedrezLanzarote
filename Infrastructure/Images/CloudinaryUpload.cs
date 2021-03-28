using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Persistence;
using System;
using ImageMagick;

namespace Infrastructure.Images
{
    public class CloudinaryUpload
    {

        public class Query : IRequest<Result<List<Domain.Image>>>
        {
            public IFormCollection Images { get; set; }

        }


        public class Handler : IRequestHandler<Query, Result<List<Domain.Image>>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly string _config;
            private readonly ILogger<CloudinaryUpload> _logger;
            private List<Domain.Image> _imageEntities;
            private readonly IImageAccessor _imageAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor, ILogger<CloudinaryUpload> logger, IImageAccessor imageAccessor)
            {
                _imageAccessor = imageAccessor;
                _logger = logger;
                _config = "d:/AppImages/";
                _userAccessor = userAccessor;
                _context = context;
                _imageEntities = new List<Domain.Image> { };
            }


            public async Task<Result<List<Domain.Image>>> Handle(Query request, CancellationToken cancellationToken)
            {
                foreach (var formFile in request.Images.Files)
                {
                    if (formFile.Length > 0 && formFile.Length < 15000000 && formFile.ContentType == "image/jpeg" || formFile.ContentType == "image/png" || formFile.ContentType == "image/jpg")
                    {
                        var filenameParts = formFile.FileName.Split('.');
                        var extension = filenameParts.Last();


                        filenameParts = null;
                        var fileName = DateTime.Now.Ticks.ToString();
                        var fullFileName = fileName + "." + extension;
                        var filePath = _config + fullFileName;

                        var realPath = "C:\\workspace\\AjedrezLanzarote\\client-app\\public\\assets\\galleryImages\\" + fullFileName;

                        var pubicPath = "/assets/galleryImages/" + fullFileName;

                        Domain.Image newImgEntity = null;
                        
                        try
                        {
                            var imageFile = new MagickImage(formFile.OpenReadStream());
                            
                            var cloudImage = await _imageAccessor.AddImage(formFile, imageFile.Width, imageFile.Height);
                            if (cloudImage == null)
                            {
                                break;
                            }
                            var thumbImage = cloudImage;

                            var createThumb = false;

                            var smallWidth = imageFile.Width;
                            var smallHeight = imageFile.Height;
                            
                            if (imageFile.Width > 100 || imageFile.Height > 100)
                                createThumb = true;
                            
                            if (createThumb)
                            {
                                thumbImage = await _imageAccessor.CreateThumbnail(formFile);
                            }
                            
                            newImgEntity = new Domain.Image
                            {
                                Id = Guid.NewGuid(),
                                Title = "",
                                Filename = fullFileName,
                                CloudId = cloudImage.PublicId,
                                CloudThumbId = thumbImage.PublicId,
                                Width = cloudImage.Width,
                                Height = cloudImage.Height,
                                smallWidth = thumbImage.Width,
                                smallHeight = thumbImage.Height,
                                Source = cloudImage.Url,
                                Thumbnail = thumbImage.Url,
                                AppUserId = _userAccessor.GetUserId()
                            };
                            _imageEntities.Add(newImgEntity);
                            imageFile.Dispose();
                        }
                        catch (System.Exception error)
                        {
                            _logger.LogError(error.Message);
                        }
                    }
                }
                _logger.LogInformation("Finally ++ images count" + _imageEntities.Count());
                // Process uploaded files
                // Don't rely on or trust the FileName property without validation.

                return Result<List<Domain.Image>>.Success(_imageEntities);
            }

            public static System.Drawing.Image ScaleImage(System.Drawing.Image image, int maxWidth, int maxHeight)
            {
                var ratioX = (double)maxWidth / image.Width;
                var ratioY = (double)maxHeight / image.Height;
                var ratio = Math.Min(ratioX, ratioY);

                var newWidth = (int)(image.Width * ratio);
                var newHeight = (int)(image.Height * ratio);

                var newImage = new Bitmap(newWidth, newHeight);

                using (var graphics = Graphics.FromImage(newImage))
                    graphics.DrawImage(image, 0, 0, newWidth, newHeight);

                return newImage;
            }
        }
    }
}