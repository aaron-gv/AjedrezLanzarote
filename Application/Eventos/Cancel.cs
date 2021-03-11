using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Eventos
{
    public class Cancel
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Url { get; set; }

        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var evento = await _context.Eventos
                    .Include(a => a.Asistentes)
                    .ThenInclude(u => u.AppUser)
                    .SingleOrDefaultAsync(x => x.Url == request.Url);
                
                if (evento == null) return null;

                var user = await _context.Users
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                
                if (user == null) return null;

                var hostUsername = evento.Asistentes.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                var asistencia = evento.Asistentes.FirstOrDefault(x => x.AppUser.UserName == user.UserName);
                
                evento.IsCancelled = !evento.IsCancelled;

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Fallo al actualizar asistencia");
            }
        }
    }
}