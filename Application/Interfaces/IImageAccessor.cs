using System.Threading.Tasks;
using Application.Images;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IImageAccessor
    {
        Task<ImageUploadResult> AddImage(IFormFile file, int Width, int Height);
        Task<ImageUploadResult> CreateThumbnail(IFormFile file);
        Task<string> DeleteImage(string publicId);
    }
}