using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<EventoAsistente> Eventos { get; set; }
        public IList<AppRole> Roles {get; set;} = new List<AppRole>();
        public ICollection<Gallery> Galleries { get; set; }
        public ICollection<Image> Images { get; set; }
        public ICollection<ProfileImage> ProfileImages { get; set; }
        public ICollection<Evento> EventosCreados { get; set; }
        public ICollection<Noticia> Noticias { get; set; }
    }
}
