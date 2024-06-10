package com.example.movieapp.payment.config;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MomoConfig {
    // https://developers.momo.vn/v3/vi/docs/payment/api/collection-link
    String accessKey = "F8BBA842ECF85";
    String secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    String paymentCode = "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";

}
