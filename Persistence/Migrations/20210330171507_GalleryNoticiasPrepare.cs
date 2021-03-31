using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class GalleryNoticiasPrepare : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GalleryNoticia_Galleries_GalleryId",
                table: "GalleryNoticia");

            migrationBuilder.DropForeignKey(
                name: "FK_GalleryNoticia_Noticias_NoticiaId",
                table: "GalleryNoticia");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GalleryNoticia",
                table: "GalleryNoticia");

            migrationBuilder.RenameTable(
                name: "GalleryNoticia",
                newName: "GalleryNoticias");

            migrationBuilder.RenameIndex(
                name: "IX_GalleryNoticia_NoticiaId",
                table: "GalleryNoticias",
                newName: "IX_GalleryNoticias_NoticiaId");

            migrationBuilder.AddColumn<Guid>(
                name: "ImageId",
                table: "Noticias",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "GalleryNoticias",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "Public",
                table: "GalleryNoticias",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "GalleryNoticias",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_GalleryNoticias",
                table: "GalleryNoticias",
                columns: new[] { "GalleryId", "NoticiaId" });

            migrationBuilder.CreateIndex(
                name: "IX_Noticias_ImageId",
                table: "Noticias",
                column: "ImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_GalleryNoticias_Galleries_GalleryId",
                table: "GalleryNoticias",
                column: "GalleryId",
                principalTable: "Galleries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GalleryNoticias_Noticias_NoticiaId",
                table: "GalleryNoticias",
                column: "NoticiaId",
                principalTable: "Noticias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Noticias_Images_ImageId",
                table: "Noticias",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GalleryNoticias_Galleries_GalleryId",
                table: "GalleryNoticias");

            migrationBuilder.DropForeignKey(
                name: "FK_GalleryNoticias_Noticias_NoticiaId",
                table: "GalleryNoticias");

            migrationBuilder.DropForeignKey(
                name: "FK_Noticias_Images_ImageId",
                table: "Noticias");

            migrationBuilder.DropIndex(
                name: "IX_Noticias_ImageId",
                table: "Noticias");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GalleryNoticias",
                table: "GalleryNoticias");

            migrationBuilder.DropColumn(
                name: "ImageId",
                table: "Noticias");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "GalleryNoticias");

            migrationBuilder.DropColumn(
                name: "Public",
                table: "GalleryNoticias");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "GalleryNoticias");

            migrationBuilder.RenameTable(
                name: "GalleryNoticias",
                newName: "GalleryNoticia");

            migrationBuilder.RenameIndex(
                name: "IX_GalleryNoticias_NoticiaId",
                table: "GalleryNoticia",
                newName: "IX_GalleryNoticia_NoticiaId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GalleryNoticia",
                table: "GalleryNoticia",
                columns: new[] { "GalleryId", "NoticiaId" });

            migrationBuilder.AddForeignKey(
                name: "FK_GalleryNoticia_Galleries_GalleryId",
                table: "GalleryNoticia",
                column: "GalleryId",
                principalTable: "Galleries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GalleryNoticia_Noticias_NoticiaId",
                table: "GalleryNoticia",
                column: "NoticiaId",
                principalTable: "Noticias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
