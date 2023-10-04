import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { getModelToken } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { Model } from 'mongoose';
import APIFeatures from '../utils/apiFeatures.utils';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockRestaurant = {
  _id: '651af65463f81548025df969',
  name: 'Bauch-Hilll',
  description: 'Prsn outsd 3-whl mv inj in clsn w statnry obj nontraf, sqla',
  email: 'gmarley7@fotki.com',
  phoneNo: 8884056976,
  address: '591 Bultman Point',
  category: 'Fast Food',
  images: [],
  location: {
    type: 'Point',
    coordinates: [-81.74524, 30.95949],
    formattedAddress: '591 Plantation Point Rd, Woodbine, GA 31569, US',
    city: 'Woodbine',
    countryCode: 'US',
    zipcode: '31569',
    country: null,
  },
  __v: 0,
};

const user = {
  _id: '651bc9ba5e34ee0ea795b58b',
  name: 'Marina',
  email: 'marina.robleno@invyo.io',
  role: 'user',
};

const mockRestaurantService = {
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let model: Model<Restaurant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getModelToken(Restaurant.name),
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    model = module.get<Model<Restaurant>>(getModelToken(Restaurant.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of restaurants', async () => {
      jest.spyOn(model, 'find').mockImplementationOnce(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockRestaurant]),
            }),
          }) as any,
      );

      const restaurants = await service.findAll({ keyword: 'restaurant' });
      expect(restaurants).toEqual([mockRestaurant]);
    });
  });

  describe('create', () => {
    const newRestaurant = {
      name: 'User Restaurant',
      description:
        'Prsn brd/alit pedl cyc injured in clsn w rail trn/veh, subs',
      email: 'gboatswain7@chronoengine.com',
      phoneNo: '6834927852',
      category: 'Cafe',
      address: '50877 Esker Alley',
    };

    it('should create a restaurant', async () => {
      jest
        .spyOn(APIFeatures, 'getRestaurantLocation')
        .mockImplementationOnce(() => Promise.resolve(mockRestaurant.location));

      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockRestaurant as any));

      const result = await service.create(newRestaurant as any, user as any);
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('findById', () => {
    it('should get restaurant by Id', async () => {
      jest
        .spyOn(model, 'findById')
        .mockResolvedValueOnce(mockRestaurant as any);

      const result = await service.findById(mockRestaurant._id);
      expect(result).toEqual(mockRestaurant);
    });

    it('should throw wrong moongose id error', async () => {
      await expect(service.findById('wrongid')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw restaruant not found error', async () => {
      const mockError = new NotFoundException('Restaurant not found.');
      jest.spyOn(model, 'findById').mockRejectedValue(mockError);

      await expect(service.findById(mockRestaurant._id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateById', () => {
    it('should update the restaurant', async () => {
      const restaurant = { ...mockRestaurant, name: 'Updated name' };
      const updateRestaurant = { name: 'Updated name' };

      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValueOnce(restaurant as any);

      const updatedRestaurant = await service.update(
        restaurant._id,
        updateRestaurant as any,
      );
      expect(updatedRestaurant.name).toEqual(updateRestaurant.name);
    });
  });

  describe('deleteById', () => {
    it('should delete the restaurant', async () => {
      jest
        .spyOn(model, 'findByIdAndDelete')
        .mockResolvedValueOnce(mockRestaurant as any);

      const result = await service.delete(mockRestaurant._id);
      expect(result).toEqual(mockRestaurant);
    });
  });
});
