using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Noticia> Noticias { get; set; }
        public DbSet<Patrocinador> Patrocinadores { get; set; }
        public DbSet<AppRole> Role { get; set; }
    }
}