using Domain;
using FluentValidation;

namespace Application.Images
{
    public class ImageValidator : AbstractValidator<Image>
    {
        public ImageValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Width).NotEmpty();
            RuleFor(x => x.Height).NotEmpty();
        }   
    }
}