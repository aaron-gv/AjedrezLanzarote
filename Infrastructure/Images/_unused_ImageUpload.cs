using System.Collections.Generic;
using System.Drawing;
using System.IO;
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
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using ImageMagick;

namespace Infrastructure.Pictures
{
    public class ImageUpload
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
            private readonly ILogger<ImageUpload> _logger;
            private List<Domain.Image> _imageEntities ;
            public Handler(DataContext context, IUserAccessor userAccessor, ILogger<ImageUpload> logger)
            {
                _logger = logger;
                _config = "d:/AppImages/";
                _userAccessor = userAccessor;
                _context = context;
                _imageEntities = new List<Domain.Image> {};
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
                        var fullFileName = fileName +"."+ extension;
                        var filePath = _config + fullFileName;
                        
                        var realPath = "C:\\workspace\\AjedrezLanzarote\\client-app\\public\\assets\\galleryImages\\"+fullFileName;
                        
                        var pubicPath = "/assets/galleryImages/"+fullFileName;
                        
                        Domain.Image newImgEntity = null;
                        System.Diagnostics.Process process = new System.Diagnostics.Process();
                        System.Diagnostics.ProcessStartInfo startInfo = new System.Diagnostics.ProcessStartInfo();

                        try
                        {
                            var imageFile = new MagickImage(formFile.OpenReadStream());
                            imageFile.FilterType = FilterType.Triangle;
                            
                            imageFile.Posterize(136);
                            imageFile.Quality = 75;
                            imageFile.ColorSpace = ColorSpace.sRGB;
                            imageFile.Interlace = Interlace.NoInterlace;
                            
                            if (extension == "png")
                            {
                                imageFile.Format = MagickFormat.Png;
                            }
                            if (extension == "jpg" || extension == "jpeg")
                            {
                                imageFile.Format = MagickFormat.Jpeg;
                                
                            }
                            if (imageFile.Width > 1600){
                                
                                imageFile.Resize(1600,0);
                            } 
                            else if (imageFile.Height > 1600) {
                                imageFile.Resize(0,1600);
                            } 
                            imageFile.Strip();
                            
                            imageFile.Write(filePath);
                            
                            startInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
                            startInfo.FileName = "C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\4.18.2102.4-0\\MpCmdRun.exe";
                            startInfo.Arguments = "-Scan -ScanType 3 -File " + filePath;
                            startInfo.WorkingDirectory = "d:\\AppImages\\";
                            process.StartInfo = startInfo;
                            process.Start();
                            
                            //process.WaitForExit();
                            while(!process.HasExited)
                            {
                                Thread.Sleep(500);
                            }
                            // ExitCode 0 = clean, 2 = infected
                            if (process.ExitCode != 0) {
                                Console.WriteLine("Algo ha ido mal en el análisis de seguridad del archivo.");
                                
                                System.IO.File.Delete(filePath);
                                break;
                            }
                            
                            var publicThumbPath ="";
                            var smallWidth = imageFile.Width;
                            var smallHeight = imageFile.Height;
                            var thumbnail = new MagickImage(imageFile);
                            var createThumb = false;
                            if (imageFile.Width > 250) {   
                                thumbnail.Resize(250, 0);
                                
                                createThumb = true;
                            }
                            if (imageFile.Width > 250) {
                                thumbnail.Resize(250, 0);
                                createThumb = true;
                            }
                            if (createThumb)
                            {
                                var thumbfilePath = _config + fileName+"_thumb."+extension;
                                var realThumbPath = "C:\\workspace\\AjedrezLanzarote\\client-app\\public\\assets\\galleryImages\\"+fileName+"_thumb."+extension;
                                publicThumbPath = "/assets/galleryImages/"+fileName+"_thumb."+extension;
                                thumbnail.Write(thumbfilePath);
                                smallWidth = thumbnail.Width;
                                smallHeight = thumbnail.Height;
                                using (var sourceStream = new FileStream(thumbfilePath, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.Asynchronous | FileOptions.SequentialScan))
                                using (var destinationStream = new FileStream(realThumbPath, FileMode.CreateNew, FileAccess.Write, FileShare.None, 4096, FileOptions.Asynchronous | FileOptions.SequentialScan))
                                await sourceStream.CopyToAsync(destinationStream);
                                
                                System.IO.File.Delete(thumbfilePath);
                            } else {
                                var thumbfilePath = filePath;
                                publicThumbPath = pubicPath;
                            }
                            
                            
                            using (var sourceStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.Asynchronous | FileOptions.SequentialScan))
                            using (var destinationStream = new FileStream(realPath, FileMode.CreateNew, FileAccess.Write, FileShare.None, 4096, FileOptions.Asynchronous | FileOptions.SequentialScan))
                            await sourceStream.CopyToAsync(destinationStream);
                            
                            System.IO.File.Delete(filePath);

                            newImgEntity = new Domain.Image{
                                Id = Guid.NewGuid(),
                                Title = "",
                                Filename = fullFileName,
                                Width = imageFile.Width,
                                Height = imageFile.Height,
                                smallWidth = smallWidth,
                                smallHeight = smallHeight,
                                Source = pubicPath,
                                Thumbnail = publicThumbPath,
                                AppUserId = _userAccessor.GetUserId()
                            };
                            _imageEntities.Add(newImgEntity);
                            imageFile.Dispose();
                            thumbnail.Dispose();
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