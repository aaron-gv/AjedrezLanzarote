using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class EventoAsistente : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateTable(
                name: "EventoAsistentes",
                columns: table => new
                {
                    AppUserId = table.Column<string>(type: "TEXT", nullable: false),
                    EventoId = table.Column<Guid>(type: "TEXT", nullable: false),
                    IsHost = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventoAsistentes", x => new { x.AppUserId, x.EventoId });
                    table.ForeignKey(
                        name: "FK_EventoAsistentes_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventoAsistentes_Eventos_EventoId",
                        column: x => x.EventoId,
                        principalTable: "Eventos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventoAsistentes_EventoId",
                table: "EventoAsistentes",
                column: "EventoId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventoAsistentes");

            migrationBuilder.CreateTable(
                name: "EventoAttendees",
                columns: table => new
                {
                    AppUserId = table.Column<string>(type: "TEXT", nullable: false),
                    EventoId = table.Column<Guid>(type: "TEXT", nullable: false),
                    IsHost = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventoAttendees", x => new { x.AppUserId, x.EventoId });
                    table.ForeignKey(
                        name: "FK_EventoAttendees_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventoAttendees_Eventos_EventoId",
                        column: x => x.EventoId,
                        principalTable: "Eventos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventoAttendees_EventoId",
                table: "EventoAttendees",
                column: "EventoId");
        }
    }
}
