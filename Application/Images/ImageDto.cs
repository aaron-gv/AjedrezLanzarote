using System;
using System.Collections.Generic;
using Application.Galleries;
using Domain;

namespace Application.Images
{
    public class ImageDto
    {
        public Guid Id { get; set; }
        public string Filename { get; set; }
        public int W { get; set; }
        public int H { get; set; }
        public string Title { get; set; }
        public string Src { get; set; }
        public string Thumbnail { get; set; }
    }
}