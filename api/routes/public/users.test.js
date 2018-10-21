const {doMock} = require('../../../tests/jest-utils');
const ObjectId = require('mongoose').Types.ObjectId;

doMock('validate.js')
doMock('api/config', () => ({
  jwtSecret: 'working',
}));

doMock('mongoose', () => {
  const User = {
    find: jest.fn(),
    findOne: jest.fn(),
    isPasswordValid: jest.fn(),
  };

  return {
    Types: {
      ObjectId,
    },
    model() {
      return User;
    },
  };
});

beforeEach(() => {
  jest.resetAllMocks();
});

const users = require('./users');

describe('users', () => {
  describe('authenticate()', () => {
    test('authentication passes', async () => {    
      const req = {
        body: {
          email: 'stephen@test.com',
          password: 'password',
        }
      }

      const res = {
        json: jest.fn()
      }

      require('validate.js')
      .mockReturnValue(null);

      require('mongoose')
      .model('User')
      .findOne.mockResolvedValue({
        email: 'stephen@test.com',
        // password would be hashed
        password: 'FDSGFSGGNRSHRSA',
        isPasswordValid: jest.fn().mockReturnValue(true)
      });

      await users.authenticate(req, res);
      expect(res.json).toHaveBeenCalledTimes(1);
    })

    test('authentication failes', async () => {    
      const req = {
        body: {
          email: 'stephen@test.com',
          password: 'incorrect password',
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('mongoose')
      .model('User')
      .findOne.mockResolvedValue({
        email: 'stephen@test.com',
        // password would be hashed
        password: 'FDSGFSGGNRSHRSA',
        isPasswordValid: jest.fn().mockReturnValue(false)
      });

      await users.authenticate(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })
  })
});

// describe('getQualifyingAchievements', () => {
//   test('returns only non claimed achievements that matches the achievements qualifying rule', async () => {
//     require('api/domain/rewards/bonusesCache').getPurchaseRelated.mockResolvedValue(rewardsBonusFindResult);
//     require('mongoose')
//       .model('Receipt')
//       .find.mockResolvedValue(receiptFindResult);

//     bonuses.getUserNumberPurchasedCovers = jest.fn().mockReturnValue(3);

//     const result = await bonuses.getQualifyingAchievements({
//       _id: '5740215f889a1cb01e84d329',
//       rewardsClaimedBonuses: ['progressive-pioneer', 'ardent-explorer'],
//       stats: {
//         purchases: 3,
//       },
//     });

//     expect(result).toMatchObject([rewardsBonusFindResult[2]]);
//   });
// });

// test('that it does not return already claimed achievements', async () => {
//   require('mongoose')
//     .model('RewardsBonus')
//     .find.mockResolvedValue(rewardsBonusFindResult);
//   require('mongoose')
//     .model('Receipt')
//     .find.mockResolvedValue(receiptFindResult);

//   const result = await bonuses.getQualifyingAchievements({
//     _id: '5740215f889a1cb01e84d329',
//     rewardsClaimedBonuses: ['progressive-pioneer', 'ardent-explorer', 'determined-discoverer'],
//     stats: {
//       purchases: 3,
//     },
//   });

//   expect(result).toMatchObject([]);
// });

// describe('validateBonus', () => {
//   const validateBonusUser = {
//     _id: '5740215f889a1cb01e84d329',
//   };

//   test('do unlock/save achievement in userClaimedRewards not already unlocked achievement', async () => {
//     validateBonusUser.rewardsClaimedBonuses = [];
//     validateBonusUser.save = jest.fn();

//     require('api/domain/rewards/bonusesCache').getById.mockResolvedValue(rewardsBonusFindOneResultValid);
//     const result = await bonuses.validateBonus(validateBonusUser, 'register-bonus');

//     await expect(validateBonusUser.save).toHaveBeenCalled();
//     await expect(result).toBe(undefined);
//   });

//   test('does not unlocked/save user as achievement is already unlocked', async () => {
//     validateBonusUser.rewardsClaimedBonuses = ['register-bonus'];
//     require('mongoose')
//       .model('RewardsBonus')
//       .findOne.mockResolvedValue(rewardsBonusFindOneResultValid);
//     const result = await bonuses.validateBonus(validateBonusUser, 'register-bonus');

//     await expect(validateBonusUser.save).toHaveBeenCalledTimes(0);
//     await expect(result).toBe(undefined);
//   });
// });