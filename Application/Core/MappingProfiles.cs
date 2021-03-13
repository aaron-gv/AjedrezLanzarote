using System;
using System.Linq;
using Application.Eventos;
using Application.Galleries;
using Application.Images;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Evento, Evento>();
            
            CreateMap<Image, ImageDto>();
            CreateMap<Noticia, Noticia>();
            CreateMap<Patrocinador, Patrocinador>();
            CreateMap<Evento, EventoDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Asistentes.FirstOrDefault(x => x.IsHost).AppUser.UserName));
                
               
             CreateMap<Evento, EventoDto>().ForMember(ed => ed.Galleries, opt => opt.MapFrom(e => e.GalleryEventos.Select(eg => eg.Gallery)));
             CreateMap<Gallery, GalleryDto>().ForMember(ed => ed.Images, opt => opt.MapFrom(e => e.GalleryImages.Select(eg => eg.Image)));
             //CreateMap<Gallery, GalleryDto>().ForMember(ed => ed.ImageDtos, opt => opt.MapFrom(e => e.GalleryImages.SelectMany(eg => eg.Images)));
             /*
            CreateMap<Gallery, GalleryDto>()
            .ForMember(ed => ed.ImageDtos, opt => opt.MapFrom(e => e.GalleryImages.SelectMany(eg => eg.Images)))
            .ForMember(d => d.GalleryImages , opt => opt.MapFrom(s => s.GalleryImages));
            */
                CreateMap<Evento, Evento>()
                    .ForMember(dest => dest.AppUserId, src => src.Ignore());
            

            CreateMap<EventoAsistente, Eventos.Profiles.Profile>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username , o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));
            CreateMap<GalleryImage, GalleryImageDto>();
            CreateMap<Image, ImageDto>();
            CreateMap<GalleryImage, Gallery>()
                .ForMember(gi => gi.Id, g => g.MapFrom(o => o.GalleryId));
                CreateMap<GalleryImage, Image>()
                .ForMember(gi => gi.Id, g => g.MapFrom(o => o.ImageId));

                CreateMap<GalleryEvento, Gallery>()
                .ForMember(gi => gi.Id, g => g.MapFrom(o => o.GalleryId));
                CreateMap<GalleryEvento, Evento>()
                .ForMember(gi => gi.Id, g => g.MapFrom(o => o.EventoId));
                
        }
    }
}