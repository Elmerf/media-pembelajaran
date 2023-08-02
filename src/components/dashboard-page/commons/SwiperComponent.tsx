import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./SwiperComponent.css";
import handleSource from "../../../helpers/source-handler";

type SwiperComponent = {
  dataToDisplay: any[];
};

const SwiperComponent: React.FC<SwiperComponent> = (props) => {
  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log("slide change")}
      style={{}}
    >
      {props.dataToDisplay.map((item, index) => {
        return (
          <SwiperSlide key={index}>
            <iframe
              src={handleSource(item.asset?.extension, item.asset?.url)}
              width={"100%"}
              height={600}
              style={{ padding: 16, border: 0 }}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
export default SwiperComponent;
