using Domain;
using FluentValidation;

namespace Application.Noticias
{
    public class NoticiaValidator : AbstractValidator<Noticia>
    {
        public NoticiaValidator()
        {
            RuleFor(x => x.Title).NotEmpty().Length(3,220).WithName("Titulo");
            RuleFor(x => x.Url).NotEmpty().Length(1,90);
            RuleFor(x => x.Body).NotEmpty().WithName("Cuerpo");
            RuleFor(x => x.Date).NotEmpty().WithName("Fecha");
        }   
    }
}