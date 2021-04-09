using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            var roles = new List<AppRole>
                {
                    new AppRole{
                        Name = "Administrador",
                        Level = 5
                    },
                    new AppRole{
                        Name = "Usuario",
                        Level = 0
                    },
                    new AppRole{
                        Name = "Desarrollador",
                        Level = 6
                    }
                };
            if (!roleManager.Roles.Any())
            {
                
                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }
            }
            var users = new List<AppUser>
                {
                    new AppUser{
                        DisplayName = "aaron",
                        UserName = "aaron",
                        Email = "agvinbox@gmail.com"
                    },
                    new AppUser{
                        DisplayName = "miguel",
                        UserName = "miguel",
                        Email = "lztuba@gmail.com"
                    },
                    new AppUser{
                        DisplayName = "bob",
                        UserName = "bob",
                        Email = "bob@test.com"
                    }
                };
            if (!userManager.Users.Any())
            {
                

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd122");
                    if (user.UserName=="miguel"){
                        await userManager.AddToRoleAsync(user,"Administrador");
                    }                      
                    else if (user.UserName == "aaron") {
                        await userManager.AddToRoleAsync(user,"Desarrollador");
                    }
                    else
                    {
                        await userManager.AddToRoleAsync(user,"Usuario");
                    }
                }
            }
            
            var doWork = false;
            if (!context.Eventos.Any())
            {

                var eventos = new List<Evento>
            {
                new Evento
                {
                    Title = "Past Evento 1",
                    StartDate = DateTime.Now.AddMonths(-2),
                    EndDate = DateTime.Now.AddMonths(-2),
                    Url = "Past-1",
                    Description = "Evento 2 months ago",
                    Category = "online",
                    City = "London",
                    Venue = "Pub",
                    Asistentes = {
                        new EventoAsistente
                        {
                            AppUser = users[0],
                            IsHost = true
                        },
                        new EventoAsistente
                        {
                            AppUser = users[2],
                            IsHost = false
                        },
                    },
                    AppUserId = users[0].Id,
                    AppUser = users[0]
                },
                new Evento
                {
                    Title = "Past Evento 2",
                    StartDate = DateTime.Now.AddMonths(-1),
                    EndDate = DateTime.Now.AddMonths(-1),
                    Url = "Past-2",
                    Description = "Evento 1 month ago",
                    Category = "online",
                    City = "Paris",
                    Venue = "Louvre",
                    Asistentes = {
                        new EventoAsistente
                        {
                            AppUser = users[1],
                            IsHost = true
                        },
                        new EventoAsistente
                        {
                            AppUser = users[2],
                            IsHost = false
                        },
                    },
                    AppUserId = users[0].Id,
                    AppUser = users[0]
                    
                },
                new Evento
                {
                    Title = "Future Evento 1",
                    StartDate = DateTime.Now.AddMonths(1),
                    EndDate = DateTime.Now.AddMonths(1),
                    Url = "Future-1",
                    Description = "Evento 1 month in future",
                    Category = "online",
                    City = "London",
                    Venue = "Natural History Museum",
                    Asistentes = {
                        new EventoAsistente
                        {
                            AppUser = users[1],
                            IsHost = true
                        },
                        new EventoAsistente
                        {
                            AppUser = users[0],
                            IsHost = false
                        },
                    },
                    AppUserId = users[0].Id,
                    AppUser = users[0]
                },
                new Evento
                {
                    Title = "Future Evento 2",
                    StartDate = DateTime.Now.AddMonths(2),
                    EndDate = DateTime.Now.AddMonths(2),
                    Url = "Future-2",
                    Description = "Evento 2 months in future",
                    Category = "online",
                    City = "London",
                    Venue = "O2 Arena",
                    Asistentes = {
                        new EventoAsistente
                        {
                            AppUser = users[0],
                            IsHost = true
                        },
                        new EventoAsistente
                        {
                            AppUser = users[1],
                            IsHost = false
                        },
                    },
                    AppUserId = users[0].Id,
                    AppUser = users[0]
                },
                new Evento
                {
                    Title = "Future Evento 3",
                    StartDate = DateTime.Now.AddMonths(3),
                    EndDate = DateTime.Now.AddMonths(3),
                    Url = "Future-3",
                    Description = "Evento 3 months in future",
                    Category = "online",
                    City = "London",
                    Venue = "Another pub",
                    Asistentes = {
                        new EventoAsistente
                        {
                            AppUser = users[0],
                            IsHost = true
                        },
                        new EventoAsistente
                        {
                            AppUser = users[1],
                            IsHost = false
                        },
                        new EventoAsistente
                        {
                            AppUser = users[2],
                            IsHost = false
                        },
                    },
                    AppUserId = users[0].Id,
                    AppUser = users[0]
                },
                new Evento
                {
                    Title = "Future Evento 4",
                    StartDate = DateTime.Now.AddMonths(4),
                    EndDate = DateTime.Now.AddMonths(4),
                    Url = "Future-4",
                    Description = "Evento 4 months in future",
                    Category = "online",
                    City = "London",
                    Venue = "Yet another pub",
                    Asistentes = {
                        new EventoAsistente
                        {
                            AppUser = users[0],
                            IsHost = true
                        },
                        new EventoAsistente
                        {
                            AppUser = users[1],
                            IsHost = false
                        },
                    },
                    AppUserId = users[0].Id,
                    AppUser = users[0]
                },
                new Evento
                {
                    Title = "Future Evento 5",
                    StartDate = DateTime.Now.AddMonths(5),
                    EndDate = DateTime.Now.AddMonths(5),
                    Url = "Future-5",
                    Description = "Evento 5 months in future",
                    Category = "presencial",
                    City = "London",
                    Venue = "Just another pub",
                    Asistentes = {
                        new EventoAsistente
                        {
                            AppUser = users[0],
                            IsHost = true
                        },
                        new EventoAsistente
                        {
                            AppUser = users[1],
                            IsHost = false
                        },
                    },
                    AppUserId = users[0].Id,
                    AppUser = users[0]
                },
                new Evento
                {
                    Title = "Future Evento 6",
                    StartDate = DateTime.Now.AddMonths(6),
                    EndDate = DateTime.Now.AddMonths(6),
                    Url = "Future-6",
                    Description = "Evento 6 months in future",
                    Category = "presencial",
                    City = "London",
                    Venue = "Roundhouse Camden",
                    Asistentes = {
                        new EventoAsistente
                        {
                            AppUser = users[1],
                            IsHost = true
                        },
                        new EventoAsistente
                        {
                            AppUser = users[0],
                            IsHost = false
                        },
                    },
                    AppUserId = users[0].Id,
                    AppUser = users[0]
                },
                new Evento
                {
                    Title = "Future Evento 7",
                    StartDate = DateTime.Now.AddMonths(7),
                    EndDate = DateTime.Now.AddMonths(7),
                    Url = "Future-7",
                    Description = "Evento 2 months ago",
                    Category = "presencial",
                    City = "London",
                    Venue = "Somewhere on the Thames",
                    Asistentes = {
                        new EventoAsistente
                        {
                            AppUser = users[1],
                            IsHost = true
                        },
                        new EventoAsistente
                        {
                            AppUser = users[0],
                            IsHost = false
                        },
                    },
                    AppUserId = users[0].Id,
                    AppUser = users[0]
                },
                new Evento
                {
                    Title = "Future Evento 8",
                    StartDate = DateTime.Now.AddMonths(8),
                    EndDate = DateTime.Now.AddMonths(8),
                    Url = "Future-8",
                    Description = "Evento 8 months in future",
                    Category = "presencial",
                    City = "London",
                    Venue = "Cinema",
                    Asistentes = {
                        new EventoAsistente
                        {
                            AppUser = users[0],
                            IsHost = true
                        },
                        new EventoAsistente
                        {
                            AppUser = users[1],
                            IsHost = false
                        },
                    },
                    AppUserId = users[0].Id,
                    AppUser = users[0]
                }
            };
                await context.Eventos.AddRangeAsync(eventos);
                doWork = true;
            }

            if (!context.Noticias.Any())
            {

                var noticias = new List<Noticia>
            {
                new Noticia
                {
                    Title = "Present Noticia 1",
                    Date = DateTime.Now,
                    Url = "Present-1",
                    Body = "Noticia 2 months ago",
                    AppUserId = users[0].Id,
                    AppUser = users[0]
                },
                new Noticia
                {
                    Title = "Past Noticia 1",
                    Date = DateTime.Now.AddMonths(-1),
                    Url = "Past-1",
                    Body = "Noticia 1 months ago",
                    AppUserId = users[0].Id,
                    AppUser = users[0]
                },
                new Noticia
                {
                    Title = "Past Noticia 2",
                    Date = DateTime.Now.AddMonths(-2),
                    Url = "Past-2",
                    Body = "Noticia 2 months ago",
                    AppUserId = users[0].Id,
                    AppUser = users[0]
                },
                new Noticia
                {
                    Title = "Past Noticia 3",
                    Date = DateTime.Now.AddMonths(-3),
                    Url = "Past-3",
                    Body = "Noticia 3 months ago",
                    AppUserId = users[0].Id,
                    AppUser = users[0]
                },
            };
                await context.Noticias.AddRangeAsync(noticias);
                doWork = true;
            }

            if (!context.Patrocinadores.Any())
            {
                var patrocinadores = new List<Patrocinador>
            {
                new Patrocinador
                {
                    Title = "Gran Hotel Arrecife",
                    Url = "Gran-Hotel-Arrecife",
                    ExternalUrl = "https://www.aghotelspa.com/",
                    ImageUrl = "/assets/patrocinadores/GranHotel 5e10830651c15.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Ideas Deportivas Canarias",
                    Url = "Ideas-Deportivas-Canarias",
                    ExternalUrl = "https://mundochess.es/291-ideas-deportivas-canarias",
                    ImageUrl =  "/assets/patrocinadores/IdeasDepor5ede3aefc1938.png",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "KMADAChess",
                    Url = "KMADAChess",
                    ExternalUrl = "https://kmadachess.com/",
                    ImageUrl = "/assets/patrocinadores/KMADAChess5f07858c86a6f.png",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Lanzarote Deportes",
                    Url = "Lanzarote-Deportes",
                    ExternalUrl = "http://www.lanzarotedeportes.com/",
                    ImageUrl = "/assets/patrocinadores/lanzaroteDeportes.png",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Centros de Arte Cultura y Turismo",
                    Url = "CACT",
                    ExternalUrl = "http://www.centrosturisticos.com/",
                    ImageUrl = "/assets/patrocinadores/arteCulturaTurismo.png",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Cablido de Lanzarote",
                    Url = "Cabildo-Lanzarote",
                    ExternalUrl = "http://www.cabildodelanzarote.com/",
                    ImageUrl = "/assets/patrocinadores/cabildolanzarote.png",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Barber Shop Lanzarote",
                    Url = "Barber-Shop-Lanzarote",
                    ExternalUrl = "http://thebarbershoplanzarote.com",
                    ImageUrl = "/assets/patrocinadores/barberShop.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Viajes La Molina",
                    Url = "Viajes-LaMolina",
                    ExternalUrl = "http://www.viajeslamolina.com/",
                    ImageUrl = "/assets/patrocinadores/laMolina.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Radio Marca Lanzarote",
                    Url = "Radio-Marca-Lanzarote",
                    ExternalUrl = "http://www.radiomarcalanzarote.com/",
                    ImageUrl = "/assets/patrocinadores/radioMarca.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Lancelot Medios",
                    Url = "Lancelot-Medios",
                    ExternalUrl = "http://www.lancelotdigital.com/",
                    ImageUrl = "/assets/patrocinadores/lancelotMedios.png",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Centro de Formación Canario",
                    Url = "CFC",
                    ExternalUrl = "http://www.centrodeformacioncanario.com/",
                    ImageUrl = "/assets/patrocinadores/CFC.png",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Hotel Lancelot",
                    Url = "Hotel-Lancelot",
                    ExternalUrl = "https://hotellancelot.com/",
                    ImageUrl = "/assets/patrocinadores/hotelLancelot.png",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Ayuntamiento de Arrecife",
                    Url = "Ayuntamiento-Arrecife",
                    ExternalUrl = "http://www.arrecife.es/portal/",
                    ImageUrl = "/assets/patrocinadores/ayuntamientoArrecife.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Estudio Jurídico B&B Abogados y Gestoría",
                    Url = "B&B-Abogados-Gestoria",
                    ExternalUrl = "http://bybjuridico.com/",
                    ImageUrl = "/assets/patrocinadores/bybjuridico.png",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "CICAR Canary Islands Car",
                    Url = "CICAR-RENT",
                    ExternalUrl = "https://www.cicar.com/",
                    ImageUrl = "/assets/patrocinadores/cicar.png",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Rayco Cancio Lasso",
                    Url = "Rayco-Cancio",
                    ExternalUrl = "https://drive.google.com/file/d/1bIPaoPkiRxyyQXib9DAYGLgsc-EeR1r2/view?usp=sharing",
                    ImageUrl = "/assets/patrocinadores/RaycoCancioLasso.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Hotel Grand Teguise Playa",
                    Url = "Hotel-G-Teguise-Playa",
                    ExternalUrl = "https://www.teguiseplayahotel.com/",
                    ImageUrl = "/assets/patrocinadores/hotelGranTeguisePlaya.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Pampero Lanzarote",
                    Url = "Pampero-Lanzarote",
                    ExternalUrl = "https://es-la.facebook.com/pamperolanzarote1/",
                    ImageUrl = "/assets/patrocinadores/pamperolanzarote.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Queso Project",
                    Url = "Queso-Project",
                    ExternalUrl = "https://www.quesoproject.com/",
                    ImageUrl = "/assets/patrocinadores/quesoproject.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "x3 Creaciones",
                    Url = "x3-Creaciones",
                    ExternalUrl = "https://www.x3creaciones.com/",
                    ImageUrl = "/assets/patrocinadores/x3creaciones.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Retracan",
                    Url = "Retracan",
                    ExternalUrl = "https://drive.google.com/file/d/1AVK8kK_YfKrjCcotGiTIUEt_WY7wxlTZ/view",
                    ImageUrl = "/assets/patrocinadores/retracan.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Julián Bermúdez",
                    Url = "Julian-Bermudez",
                    ExternalUrl = "https://www.ajedrezlanzarote.com//",
                    ImageUrl = "/assets/patrocinadores/logo-julian-Bermudez.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Ayuntamiento de Haría",
                    Url = "Ayuntamiento-Haría",
                    ExternalUrl = "http://www.ayuntamientodeharia.com/",
                    ImageUrl = "/assets/patrocinadores/15565424325cc6f759a41dc.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Ayuntamiento de Tías",
                    Url = "Ayuntamiento-Tías",
                    ExternalUrl = "http://www.ayuntamientodetias.es/",
                    ImageUrl = "/assets/patrocinadores/15566302605cc84b2cc6327.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Ayuntamiento de Teguise",
                    Url = "Ayuntamiento-Teguise",
                    ExternalUrl = "https://teguise.es/",
                    ImageUrl = "/assets/patrocinadores/Ayuntamien5cc84d0400116.jpg",
                    Description = "",
                },
                new Patrocinador
                {
                    Title = "Tirma",
                    Url = "Tirma",
                    ExternalUrl = "http://www.tirma.com/",
                    ImageUrl = "/assets/patrocinadores/Tirma5cc84d3d05f6d.jpg",
                    Description = "",
                }
                };
                await context.Patrocinadores.AddRangeAsync(patrocinadores);
                doWork = true;
            }
            if (doWork)
                await context.SaveChangesAsync();

        }
    }
}