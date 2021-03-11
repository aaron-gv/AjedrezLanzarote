using Domain;
using FluentValidation;

namespace Application.Eventos
{
    public class EventoValidator : AbstractValidator<Evento>
    {
        public EventoValidator()
        {
            RuleFor(x => x.Title).NotEmpty().Length(3, 220).WithName("Titulo");
            
            RuleFor(x => x.Url).NotEmpty().Length(1, 90);
            RuleFor(x => x.Description).NotEmpty().WithName("Description");
            RuleFor(x => x.Category).NotEmpty().Length(3, 100).WithName("Categoria");
            RuleFor(x => x.StartDate).NotEmpty().LessThanOrEqualTo(x => x.EndDate).WithName("Fecha de comienzo");
            RuleFor(x => x.EndDate).GreaterThanOrEqualTo(x => x.StartDate).WithName("Fecha de final");
        }   
    }
}