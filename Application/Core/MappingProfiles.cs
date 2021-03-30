using System;
using System.Linq;
using Application.Eventos;
using Application.Galleries;
using Application.Images;
using Application.Interfaces;
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
            CreateMap<EventoDtoAdmin, EventoDto>();
            CreateMap<Gallery, AdminGalleryEventoDto>();
            CreateMap<AdminGalleryEventoDto, GalleryEventoDto>();

            CreateMap<Evento, EventoDto>()
               .ForMember(ed => ed.Galleries, opt => opt.MapFrom(e => e.GalleryEventos.Where(ge => ge.Public == true).Select(eg => eg.Gallery)))
               .ForMember(d => d.PortraitUrl, o => o.MapFrom(s => s.Image.Source))
               .ForMember(d => d.Portrait, o => o.MapFrom(s => s.Image));
               
            CreateMap<Evento, EventoDtoAdmin>()
               .ForMember(ed => ed.Galleries, opt => opt.MapFrom(e => e.GalleryEventos))
               .ForMember(d => d.PortraitUrl, o => o.MapFrom(s => s.Image.Source))
               .ForMember(d => d.Portrait, o => o.MapFrom(s => s.Image));


            CreateMap<Gallery, GalleryDto>()
               .ForMember(ed => ed.Images, opt => opt.MapFrom(e => e.GalleryImages.Select(eg => eg.Image)));

            CreateMap<Gallery, GalleryEventoDto>()
                .ForMember(ed => ed.Images, opt => opt.MapFrom(e => e.GalleryImages.Select(eg => eg.Image)));

            CreateMap<GalleryEvento, GalleryEventoDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.GalleryId))
                .ForMember(d => d.Images, opt => opt.MapFrom(s => s.Gallery.Images))
                .ForMember(d => d.Public, opt => opt.MapFrom(s => s.Public));

            CreateMap<Evento, Evento>()
                .ForMember(dest => dest.AppUserId, src => src.Ignore());


            CreateMap<EventoAsistente, Eventos.Profiles.Profile>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));

            CreateMap<Image, ImageDto>()
                .ForMember(d => d.Src, o => o.MapFrom(s => s.Source))
                .ForMember(d => d.W, o => o.MapFrom(s => s.Width))
                .ForMember(d => d.H, o => o.MapFrom(s => s.Height))
                .ForMember(d => d.Order, o => o.MapFrom(s => s.GalleryImages.FirstOrDefault(x => x.ImageId == s.Id).Order))
                .ForMember(d => d.Title, o => o.MapFrom(s => s.GalleryImages.FirstOrDefault(x => x.ImageId == s.Id).Title));
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