using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Application.Images
{
    public interface IImageAccessor
    {
        Task<ImageUploadResult> AddImage(IFormFile file);
        Task<ImageUploadResult> CreateThumbnail(IFormFile file);
        Task<string> DeleteImage(string publicId);
    }
}