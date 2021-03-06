using System.Linq;
using Application.Eventos;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Evento, Evento>();
            CreateMap<Noticia, Noticia>();
            CreateMap<Patrocinador, Patrocinador>();
            CreateMap<Evento, EventoDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Asistentes.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<EventoAsistente, Eventos.Profiles.Profile>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username , o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));
        }
    }
}