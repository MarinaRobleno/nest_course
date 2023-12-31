const nodeGeocoder = require('node-geocoder');
import { JwtService } from '@nestjs/jwt';

export default class APIFeatures {
  static async getRestaurantLocation(address: string) {
    try {
      const options = {
        provider: process.env.GEOCODER_PROVIDER,
        httpAdapter: 'https',
        apiKey: process.env.GEOCODER_API_KEY,
        formatter: null,
      };
      const geocoder = nodeGeocoder(options);

      const loc = await geocoder.geocode(address);

      const location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
        countryCode: loc[0].countryCode,
        zipcode: loc[0].zipcode,
        country: loc[0].country,
      };

      return location;
    } catch (error) {
      console.log(error.message);
    }
  }

  static async assignJWTToken(
    userId: string,
    jwtService: JwtService,
  ): Promise<string> {
    const payload = { id: userId };
    const token = await jwtService.sign(payload);
    return token;
  }
}
