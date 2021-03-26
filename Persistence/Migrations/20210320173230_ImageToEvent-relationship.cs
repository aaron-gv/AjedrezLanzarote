using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class ImageToEventrelationship : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ImageId",
                table: "Eventos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Eventos_ImageId",
                table: "Eventos",
                column: "ImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Eventos_Images_ImageId",
                table: "Eventos",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Eventos_Images_ImageId",
                table: "Eventos");

            migrationBuilder.DropIndex(
                name: "IX_Eventos_ImageId",
                table: "Eventos");

            migrationBuilder.DropColumn(
                name: "ImageId",
                table: "Eventos");
        }
    }
}
