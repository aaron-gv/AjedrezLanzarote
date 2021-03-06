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

        public DbSet<EventoAttendee> EventoAttendees {get; set;}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<EventoAttendee>(x => x.HasKey(aa => new {aa.AppUserId, aa.EventoId}));

            builder.Entity<EventoAttendee>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.Eventos)
                .HasForeignKey(aa => aa.AppUserId);
            builder.Entity<EventoAttendee>()
                .HasOne(u => u.Evento)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.EventoId);
        }
    }
}