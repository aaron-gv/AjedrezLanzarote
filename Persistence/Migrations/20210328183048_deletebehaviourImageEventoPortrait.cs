using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class deletebehaviourImageEventoPortrait : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Eventos_Images_ImageId",
                table: "Eventos");

            migrationBuilder.AddForeignKey(
                name: "FK_Eventos_Images_ImageId",
                table: "Eventos",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Eventos_Images_ImageId",
                table: "Eventos");

            migrationBuilder.AddForeignKey(
                name: "FK_Eventos_Images_ImageId",
                table: "Eventos",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
