using System.Collections.Generic;
using Application.Core;
using Application.Interfaces;
using Application.Images;
using Infrastructure.Images;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policy => {

                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                });
            });
            services.AddMediatR(typeof(Application.Eventos.ListAll.Handler).Assembly);
            //services.AddMediatR(typeof(Infrastructure.Images.ImageUpload.Handler).Assembly);
            services.AddMediatR(typeof(Infrastructure.Images.CloudinaryUpload.Handler).Assembly);
            services.AddMediatR(typeof(Application.Noticias.ListPublic.Handler).Assembly);
            services.AddMediatR(typeof(Application.Noticias.ListAll.Handler).Assembly);
            services.AddMediatR(typeof(Application.Eventos.ListPublic.Handler).Assembly);
            services.AddMediatR(typeof(Application.Patrocinadores.List.Handler).Assembly);
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            //This will help to get the loged-in user's username from everywhere in our application
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IImageAccessor, ImageAccessor>();
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
            return services;
        }
    }
}