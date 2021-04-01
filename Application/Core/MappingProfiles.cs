using System;
using System.Linq;
using Application.Eventos;
using Application.Galleries;
using Application.Images;
using Application.Interfaces;
using Application.Noticias;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Patrocinador, Patrocinador>();
            
            CreateMap<EventoDtoAdmin, EventoDto>();
            CreateMap<NoticiaDtoAdmin, NoticiaDto>();
            CreateMap<Gallery, AdminGalleryEventoDto>();
            CreateMap<Gallery, AdminGalleryNoticiaDto>();
            CreateMap<AdminGalleryEventoDto, GalleryEventoDto>();
            CreateMap<AdminGalleryNoticiaDto, GalleryNoticiaDto>();

            CreateMap<Evento, EventoDto>()
               .ForMember(ed => ed.Galleries, opt => opt.MapFrom(e => e.GalleryEventos.Where(ge => ge.Public == true)))
               .ForMember(d => d.PortraitUrl, o => o.MapFrom(s => s.Image.Source))
               .ForMember(d => d.Portrait, o => o.MapFrom(s => s.Image))
               .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Asistentes.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<Noticia, NoticiaDto>()
               .ForMember(ed => ed.Galleries, opt => opt.MapFrom(e => e.GalleryNoticias.Where(ge => ge.Public == true)))
               .ForMember(d => d.PortraitUrl, o => o.MapFrom(s => s.Image.Source))
               .ForMember(d => d.Portrait, o => o.MapFrom(s => s.Image));

               CreateMap<Noticia, NoticiaDtoAdmin>()
               .ForMember(ed => ed.Galleries, opt => opt.MapFrom(e => e.GalleryNoticias))
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

            CreateMap<Gallery, GalleryNoticiaDto>()
                .ForMember(ed => ed.Images, opt => opt.MapFrom(e => e.GalleryImages.Select(eg => eg.Image)));

            CreateMap<GalleryImage, ImageDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(x => x.Image.Id))
                .ForMember(d => d.Src , opt => opt.MapFrom(x => x.Image.Source))
                .ForMember(d => d.W, o => o.MapFrom(s => s.Image.Width))
                .ForMember(d => d.H, o => o.MapFrom(s => s.Image.Height))
                .ForMember(d => d.Thumbnail, o => o.MapFrom(s => s.Image.Thumbnail))
                .ForMember(d => d.smallHeight, o => o.MapFrom(s => s.Image.smallHeight))
                .ForMember(d => d.smallWidth, o => o.MapFrom(s => s.Image.smallWidth))
                .ForMember(d => d.Description, o => o.MapFrom(s => s.Image.Description))
                .ForMember(d => d.Filename, o => o.MapFrom(s => s.Image.Filename))
                .ForMember(d => d.Order , o => o.MapFrom(d => d.Order))
                .ForMember(d => d.Title , o => o.MapFrom(d => d.Title));


            CreateMap<GalleryEvento, GalleryEventoDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.GalleryId))
                .ForMember(d => d.Images, opt => opt.MapFrom(s => s.Gallery.GalleryImages.Where(x => x.GalleryId == s.GalleryId)))
                .ForMember(d => d.Public, opt => opt.MapFrom(s => s.Public));

            CreateMap<GalleryNoticia, GalleryNoticiaDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.GalleryId))
                .ForMember(d => d.Images, opt => opt.MapFrom(s => s.Gallery.GalleryImages.Where(x => x.GalleryId == s.GalleryId)))
                .ForMember(d => d.Public, opt => opt.MapFrom(s => s.Public));
            
            CreateMap<Evento, Evento>()
                .ForMember(dest => dest.AppUserId, src => src.Ignore());

            CreateMap<Noticia, Noticia>()
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
            CreateMap<GalleryNoticia, Gallery>()
            .ForMember(gi => gi.Id, g => g.MapFrom(o => o.GalleryId));
            CreateMap<GalleryEvento, Evento>()
            .ForMember(gi => gi.Id, g => g.MapFrom(o => o.EventoId));
            CreateMap<GalleryNoticia, Noticia>()
            .ForMember(gi => gi.Id, g => g.MapFrom(o => o.NoticiaId));

        }
    }
}