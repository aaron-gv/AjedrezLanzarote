using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System;
using Infrastructure.Pictures;
using Application.Images;

namespace Infrastructure.Images
{
    public class ImageAccessor : IImageAccessor
    {
        private readonly Cloudinary _cloudinary;
        public ImageAccessor(IOptions<CloudinarySettings> config)
        {
            var account = new Account (
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(account);
        }

        public async Task<Application.Images.ImageUploadResult> AddImage(IFormFile file, int Width, int Height)
        {
            if (file.Length > 0)
            {
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream)
                    };
                if (Width > 1600)
                {
                    uploadParams.Transformation = new Transformation().Width(1600).Crop("scale");
                }
                if (Height > 1600) {
                    uploadParams.Transformation = new Transformation().Height(1600).Crop("scale");
                } 
                
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null) 
                {
                    throw new Exception(uploadResult.Error.Message);
                }

                return new Application.Images.ImageUploadResult
                {
                    PublicId = uploadResult.PublicId,
                    Url = uploadResult.SecureUrl.ToString(),
                    Width = uploadResult.Width,
                    Height = uploadResult.Height
                };

                
            }
            return null;
        }
        public async Task<Application.Images.ImageUploadResult> CreateThumbnail(IFormFile file)
        {
            if (file.Length > 0)
            {
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(250).Crop("scale")
                };
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null) 
                {
                    throw new Exception(uploadResult.Error.Message);
                }

                return new Application.Images.ImageUploadResult
                {
                    PublicId = uploadResult.PublicId,
                    Url = uploadResult.SecureUrl.ToString(),
                    Width = uploadResult.Width,
                    Height = uploadResult.Height

                };

                
            }
            return null;
        }

        public async Task<string> DeleteImage(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result == "ok" ? result.Result : null ;
        }
    }
}