using Domain;
using FluentValidation;

namespace Application.Noticias
{
    public class NoticiaValidator : AbstractValidator<Noticia>
    {
        public NoticiaValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Url).NotEmpty();
            RuleFor(x => x.Body).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
        }   
    }
}