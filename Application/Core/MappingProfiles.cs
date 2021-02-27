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
        }
    }
}