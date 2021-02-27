using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Noticia> Noticias { get; set; }
        public DbSet<Patrocinador> Patrocinadores { get; set; }
    }
}