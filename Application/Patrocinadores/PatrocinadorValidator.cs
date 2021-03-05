using Domain;
using FluentValidation;

namespace Application.Patrocinadores
{
    public class PatrocinadorValidator : AbstractValidator<Patrocinador>
    {
        public PatrocinadorValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Url).NotEmpty();
            RuleFor(x => x.ExternalUrl).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
        }   
    }
}