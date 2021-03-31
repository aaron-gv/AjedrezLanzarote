using System;
using System.Collections.Generic;
using Application.Galleries;
using Domain;

namespace Application.Noticias
{
    public class NoticiaDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public DateTime Date { get; set; }
        public string Body { get; set; }
        public ICollection<GalleryNoticiaDto> Galleries { get; set; } = new List<GalleryNoticiaDto>();
        public string AppUserId {get; set;}
        public string PortraitUrl {get; set;}
        public Image Portrait {get; set;}
    }
}