import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { PassportModule } from '@nestjs/passport';
import { ForbiddenException } from '@nestjs/common';

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
  user: '651bc9ba5e34ee0ea795b58b',
};

const mockUser = {
  _id: '651bc9ba5e34ee0ea795b58b',
  name: 'Marina',
  email: 'marina.robleno@invyo.io',
  role: 'user',
};

const mockRestaurantService = {
  findAll: jest.fn().mockResolvedValueOnce([mockRestaurant]),
  create: jest.fn(),
  findById: jest.fn().mockResolvedValueOnce(mockRestaurant),
  update: jest.fn(),
  delete: jest.fn().mockResolvedValueOnce({ deleted: true }),
};

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllRestaurants', () => {
    it('should get all restaurnts', async () => {
      const result = await controller.getAllRestaurants({
        keyword: 'restaurant',
      });

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockRestaurant]);
    });
  });

  describe('createRestaurant', () => {
    it('should create a new restaurant', async () => {
      const newRestaurant = {
        category: 'Fast Food',
        address: '200 Olympic Dr, Stafford, VS, 22554',
        phoneNo: 9788246116,
        email: 'ghulam@gamil.com',
        description: 'This is just a description',
        name: 'Retaurant 4',
      };

      mockRestaurantService.create = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      const result = await controller.createRestaurant(
        newRestaurant as any,
        mockUser as any,
      );

      expect(service.create).toHaveBeenCalled();
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('getRestaurant', () => {
    it('should get restaurant by ID', async () => {
      const result = await controller.getRestaurant(mockRestaurant._id);

      expect(service.findById).toHaveBeenCalled();
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('updateRestaurant', () => {
    const restaurant = { ...mockRestaurant, name: 'Updated name' };
    const updateRestaurant = { name: 'Updated name' };

    it('should update restaurant by ID', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      mockRestaurantService.update = jest
        .fn()
        .mockResolvedValueOnce(restaurant);

      const result = await controller.updateRestaurant(
        restaurant._id,
        updateRestaurant as any,
        mockUser as any,
      );

      expect(service.update).toHaveBeenCalled();
      expect(result).toEqual(restaurant);
      expect(result.name).toEqual(restaurant.name);
    });

    it('should throw forbidden error', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      const user = {
        ...mockUser,
        _id: '61c0ccf11d7bf83d153d7c07',
      };

      await expect(
        controller.updateRestaurant(
          restaurant._id,
          updateRestaurant as any,
          user as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteRestaurant', () => {
    it('should delete restaurant by ID', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      const result = await controller.deleteRestaurant(mockRestaurant._id);

      expect(service.delete).toHaveBeenCalled();
      expect(result).toEqual({ deleted: true });
    });
  });
});
