import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import noPhoto from "@/assets/noPhoto.jpg";

const SliderComponent = ({ images }: { images: string[] | null }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  if (!images || images.length === 0) {
    return (
      <div className="mx-auto">
        <Image src={noPhoto} alt={"No photo"} width={500} height={500} />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="mx-auto">
        <Image
          src={images[0].image}
          alt={images[0].id}
          width={500}
          height={500}
        />
      </div>
    );
  }

  return (
    <Slider {...settings}>
      {images.map((image) => (
        <div key={image.id} className="mx-auto">
          <Image
            src={image.image}
            alt={`Image ${image.id}`}
            className="mx-auto"
            width={500}
            height={500}
          />
        </div>
      ))}
    </Slider>
  );
};

export default SliderComponent;
