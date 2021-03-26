using System.Collections.Generic;
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

        public DbSet<Image> Images {get; set;}
        public DbSet<Gallery> Galleries {get; set;}
        public DbSet<GalleryEvento> GalleryEventos {get; set;}
        public DbSet<GalleryImage> GalleryImages {get; set;}
        public DbSet<EventoAsistente> EventoAsistentes {get; set;}

        public DbSet<EntityEvent> EntityEvents {get; set;}
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Evento>()
                .HasIndex(u => u.Url)
                .IsUnique();
                builder.Entity<Noticia>()
                .HasIndex(u => u.Url)
                .IsUnique();
                builder.Entity<Patrocinador>()
                .HasIndex(u => u.Url)
                .IsUnique();
            builder.Entity<EventoAsistente>(x => x.HasKey(aa => new {aa.AppUserId, aa.EventoId}));

            builder.Entity<EventoAsistente>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.Eventos)
                .HasForeignKey(aa => aa.AppUserId);
            builder.Entity<EventoAsistente>()
                .HasOne(u => u.Evento)
                .WithMany(a => a.Asistentes)
                .HasForeignKey(aa => aa.EventoId);
            
            
            /*builder.Entity<GalleryImage>().HasKey(x => new {x.GalleryId, x.ImageId});
            builder.Entity<GalleryImage>().HasOne(x => x.Gallery).WithMany(y => y.GalleryImages).HasForeignKey(zz => zz.GalleryId);
            builder.Entity<GalleryImage>().HasOne(x => x.Image).WithMany(y => y.GalleryImages).HasForeignKey(zz => zz.ImageId);
            */
            /*
            builder.Entity<GalleryEvento>()
                .HasKey(x => new {x.GalleryId, x.EventoId});
            builder.Entity<GalleryEvento>().HasOne(x => x.Gallery).WithMany(y => y.GalleryEventos).HasForeignKey(zz => zz.GalleryId);
            builder.Entity<GalleryEvento>().HasOne(x => x.Evento).WithMany(y => y.GalleryEventos).HasForeignKey(zz => zz.EventoId);
            
            builder.Entity<GalleryNoticia>()
                .HasKey(x => new {x.GalleryId, x.NoticiaId});
            builder.Entity<GalleryNoticia>().HasOne(x => x.Gallery).WithMany(y => y.GalleryNoticias).HasForeignKey(zz => zz.GalleryId);
            builder.Entity<GalleryNoticia>().HasOne(x => x.Noticia).WithMany(y => y.GalleryNoticias).HasForeignKey(zz => zz.NoticiaId);
            */
            builder.Entity<ProfileImage>()
                .HasKey(x => new {x.AppUserId, x.ImageId});
            
            builder.Entity<Noticia>()
            .HasOne(p => p.AppUser)
            .WithMany(b => b.Noticias)
            .HasForeignKey(p => p.AppUserId).IsRequired();
            
            builder.Entity<Evento>()
            .HasOne(p => p.AppUser)
            .WithMany(b => b.EventosCreados)
            .HasForeignKey(p => p.AppUserId).IsRequired();

            builder.Entity<Gallery>()
            .HasOne(p => p.AppUser)
            .WithMany(b => b.Galleries)
            .HasForeignKey(p => p.AppUserId).IsRequired();

            builder.Entity<Image>()
            .HasOne(p => p.AppUser)
            .WithMany(b => b.Images)
            .HasForeignKey(p => p.AppUserId).IsRequired();


            /* builder.Entity<Gallery>()
            .HasMany(i => i.Images)
            .WithMany(i => i.Galleries)
            .UsingEntity<GalleryImage>(
                j => j.HasOne(gi => gi.Image).WithMany(g => g.GalleryImages).HasForeignKey(gi => gi.ImageId), 
                j => j.HasOne(gi => gi.Gallery).WithMany(i => i.GalleryImages).HasForeignKey(gi => gi.GalleryId),
                j => j.HasKey(g => new {g.ImageId, g.GalleryId})
            ); */



            builder.Entity<Gallery>()
            .HasMany(p => p.Noticias)
            .WithMany(p => p.Galleries)
            .UsingEntity<GalleryNoticia>(
                j => j
                    .HasOne(pt => pt.Noticia)
                    .WithMany(t => t.GalleryNoticias)
                    .HasForeignKey(pt => pt.NoticiaId)
                    .OnDelete(DeleteBehavior.Cascade),
                j => j
                    .HasOne(pt => pt.Gallery)
                    .WithMany(p => p.GalleryNoticias)
                    .HasForeignKey(pt => pt.GalleryId)
                    .OnDelete(DeleteBehavior.Cascade),
                j =>
                {
                    j.HasKey(t => new { t.GalleryId, t.NoticiaId });
                });

            builder.Entity<Gallery>()
            .HasMany(p => p.Eventos)
            .WithMany(p => p.Galleries)
            .UsingEntity<GalleryEvento>(
                j => j
                    .HasOne(pt => pt.Evento)
                    .WithMany(t => t.GalleryEventos)
                    .HasForeignKey(pt => pt.EventoId)
                    .OnDelete(DeleteBehavior.Cascade),
                j => j
                    .HasOne(pt => pt.Gallery)
                    .WithMany(p => p.GalleryEventos)
                    .HasForeignKey(pt => pt.GalleryId)
                    .OnDelete(DeleteBehavior.Cascade),
                j =>
                {
                    j.HasKey(t => new { t.GalleryId, t.EventoId });
                });

            builder.Entity<Gallery>()
            .HasMany(p => p.Images)
            .WithMany(p => p.Galleries)
            .UsingEntity<GalleryImage>(
                j => j
                    .HasOne(pt => pt.Image)
                    .WithMany(t => t.GalleryImages)
                    .HasForeignKey(pt => pt.ImageId)
                    .OnDelete(DeleteBehavior.Cascade),
                    
                j => j
                    .HasOne(pt => pt.Gallery)
                    .WithMany(p => p.GalleryImages)
                    .HasForeignKey(pt => pt.GalleryId)
                    .OnDelete(DeleteBehavior.Cascade),
                j =>
                {
                    j.HasKey(t => new { t.GalleryId, t.ImageId });
                });

            }

            
    }
}