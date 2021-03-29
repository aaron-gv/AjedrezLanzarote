using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class changeColumnNameHiddenGalleryEvento : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Hidden",
                table: "GalleryEventos",
                newName: "Public");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Public",
                table: "GalleryEventos",
                newName: "Hidden");
        }
    }
}
