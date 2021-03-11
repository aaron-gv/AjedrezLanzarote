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

namespace Infrastructure.Files
{
    public class ImageUpload
    {
        
        public class Query : IRequest<Result<List<Domain.Image>>>
        {
            public List<IFormFile> Images { get; set; }
            
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
                
                foreach (var formFile in request.Images)
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
                        ImageCodecInfo codec = ImageCodecInfo.GetImageEncoders()[1];
                        EncoderParameters eParams = new EncoderParameters(1);
                        eParams.Param[0] = new EncoderParameter(Encoder.Quality, 90L);
                        try
                        {
                            var imageFile = System.Drawing.Image.FromStream(formFile.OpenReadStream());
                            if (imageFile.Width > 1600 || imageFile.Height > 1600) {
                                var imageResized = ScaleImage(imageFile, 1600, 1600);
                                imageResized.Save(filePath, codec, eParams);
                                
                                imageFile = imageResized;
                            } else {
                                imageFile.Save(filePath);
                            }
                            startInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
                            startInfo.FileName = "C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\4.18.2101.9-0\\MpCmdRun.exe";
                            startInfo.Arguments = "-Scan -ScanType 3 -File " + filePath;
                            startInfo.WorkingDirectory = "d:\\AppImages\\";
                            process.StartInfo = startInfo;
                            
                            var results = process.Start();
                            while(!process.HasExited){
                                Thread.Sleep(0);
                            }
                            // ExitCode 0 = clean, 2 = infected
                            if (process.ExitCode != 0) {
                                Console.WriteLine("Algo ha ido mal en el análisis de seguridad del archivo.");
                                System.IO.File.Delete(filePath);
                                break;
                            }
                            var publicThumbPath ="";
                            if (imageFile.Width > 300 || imageFile.Height > 300)
                            {
                                var thumbfilePath = _config + fileName+"_thumb."+extension;
                                var realThumbPath = "C:\\workspace\\AjedrezLanzarote\\client-app\\public\\assets\\galleryImages\\"+fileName+"_thumb."+extension;
                                publicThumbPath = "/assets/galleryImages/"+fileName+"_thumb."+extension;
                                var thumbResized = ScaleImage(imageFile, 250, 250);
                                thumbResized.Save(thumbfilePath);
                                thumbResized.Dispose();
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
                                Title = fullFileName,
                                Filename = fullFileName,
                                Width = imageFile.Width,
                                Height = imageFile.Height,
                                Source = pubicPath,
                                Thumbnail = publicThumbPath,
                                AppUserId = _userAccessor.GetUserId()
                            };
                            _imageEntities.Add(newImgEntity);
                            imageFile.Dispose();
                        }
                        catch (System.Exception error)
                        {
                            _logger.LogError(error.Message);
                        } finally {
                            eParams.Dispose();
                            
                        }
                        
                    }
                }
                _logger.LogInformation("Finally ++ images count" + _imageEntities.Count());
                // Process uploaded files
                // Don't rely on or trust the FileName property without validation.

                return Result<List<Domain.Image>>.Success(_imageEntities);
            }
            
        
            public string GetFixedSizeImage(string oldFile)
            {
                int sourceX = 0, sourceY = 0, destX = 0, destY = 0;
                float nPercent = 0, nPercentW = 0, nPercentH = 0;
                int height =1650, width=2350;
                
                string fixedImageFilePath =@"OutputImagePath....";
                
                try
                {
                    System.Drawing.Image sourceImage = System.Drawing.Image.FromFile(oldFile);
                    int sourceWidth = sourceImage.Width;
                    int sourceHeight = sourceImage.Height;
                    nPercentW = ((float)width / (float)sourceWidth);
                    nPercentH = ((float)height / (float)sourceHeight);
                
                    if (nPercentH < nPercentW)
                    {
                        nPercent = nPercentH;
                        destX = System.Convert.ToInt16((width - (sourceWidth * nPercent)) / 2);
                    }
                    else
                    {
                        nPercent = nPercentW;
                        destY = System.Convert.ToInt16((height - (sourceHeight * nPercent)) / 2);
                    }
                    int destWidth = (int)(sourceWidth * nPercent);
                    int destHeight = (int)(sourceHeight * nPercent);


                    using (Bitmap bmPhoto = new Bitmap(width, height))
                    {
                        bmPhoto.SetResolution(sourceImage.HorizontalResolution, sourceImage.VerticalResolution);


                        using (Graphics grPhoto = Graphics.FromImage(bmPhoto))
                        {
                            grPhoto.Clear(System.Drawing.Color.White);
                            grPhoto.CompositingQuality = CompositingQuality.HighQuality;
                            grPhoto.InterpolationMode = InterpolationMode.HighQualityBicubic;
                            grPhoto.SmoothingMode = SmoothingMode.HighQuality;
                            grPhoto.PixelOffsetMode = PixelOffsetMode.HighQuality;


                            grPhoto.DrawImage(sourceImage, new System.Drawing.Rectangle(destX, destY, destWidth, destHeight)
                                , new System.Drawing.Rectangle(sourceX, sourceY, sourceWidth, sourceHeight), GraphicsUnit.Pixel);
                        }


                        ImageCodecInfo codec = ImageCodecInfo.GetImageEncoders()[1];
                        EncoderParameters eParams = new EncoderParameters(1);
                        eParams.Param[0] = new EncoderParameter(Encoder.Quality, 80L);
                        bmPhoto.Save(fixedImageFilePath, codec, eParams);
                        eParams.Dispose();
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }


                return fixedImageFilePath;
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