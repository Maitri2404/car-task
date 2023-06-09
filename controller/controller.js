const Transaction = require('../model/transactions')
const Brand = require('../model/brands')
const Car = require('../model/cars')
const Seller = require('../model/sellers')
const User = require('../model/users')

async function brand(req, res) {
    try {
        const brand = new Brand(req.body)
        await brand.save()
        return res.status(201).json(brand)
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

async function car(req, res) {
    try {
        const { sCarName, iBrandId, nYear } = req.body
        const brand = await Brand.findOne({ sBrand: iBrandId })
        console.log(brand)
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' })
        }
        const car = new Car({
            iBrandId: brand,
            sCarName,
            nYear
        })
        await car.save()
        return res.status(201).json(car)
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ error: 'Internal  server error' })
    }
}

async function user(req, res) {
    try {
        const user = new User(req.body)
        await user.save()
        return res.status(201).json(user)
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ error: 'Internal  server error' })
    }
}

async function seller(req, res) {
    try {
        const { sSellerName, sSellerCity, aCar } = req.body
        const carArr = []

        for (let car of aCar) {
            const carId = await Car.findOne({ sCarName: car })
            console.log(carId)
            if (!carId) {
                return res.status(404).json({ error: 'Car not found' })
            }
            console.log(carId)

            carArr.push(carId)
        }
        console.log(carArr)

        const seller = new Seller({
            sSellerName,
            sSellerCity,
            iCarId: carArr
        })

        await seller.save()
        return res.status(201).json(seller)
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ error: 'Internal  server error' })
    }
}

async function transaction(req, res) {
    try {

        const { iCarId, iSellerId, iUserId } = req.body
        const sellerId = await Seller.findOne({ sSellerName: iSellerId })
        // console.log("sellerId:",sellerId)
        const userId = await User.findOne({ sUserName: iUserId })
        // console.log(userId)
        const carId = await Car.findOne({ sCarName: iCarId })
        // console.log(carId)
        if(!carId){
            return res.status(404).json({error:"Car not found"})
        }

        const transaction = new Transaction({
            iSellerId: sellerId,
            iUserId: userId,
            iCarId: carId
        })

        carId.isSold = true; 
        await transaction.save()
        return res.status(201).json(transaction)
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ error: 'Internal  server error' })
    }
}

async function getTotalSoldCar(req, res) {
    const findCars = await Transaction.find().count()
    console.log(findCars)
    return res.status(200).json({ "Total Sold Car": findCars })
}

async function getCarsSoldByCity(req, res) {
    try {
      const cityCount = await Transaction.aggregate([
        { $lookup: { from: 'sellers', localField: 'iSellerId', foreignField: '_id', as: 'seller' } },
        { $unwind: '$seller' },
        { $group: { _id: '$seller.sSellerCity', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 }
      ]);

      return res.status(200).json({ city: cityCount[0]._id, count: cityCount[0].count });
} catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getMostSoldCar(req, res) {
    try {
      const carCount = await Transaction.aggregate([
        { $lookup: { from: 'cars', localField: 'iCarId', foreignField: '_id', as: 'car' } },
        { $unwind: '$car' },
        { $group: { _id: '$car.sCarName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 }
      ]);
  
      return res.status(200).json({ car: carCount[0]._id, count: carCount[0].count });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function getMostSoldBrand(req, res) {
    try {
      const brandCount = await Transaction.aggregate([
        { $lookup: { from: 'cars', localField: 'iCarId', foreignField: '_id', as: 'car' } },
        { $unwind: '$car' },
        { $lookup: { from: 'brands', localField: 'car.iBrandId', foreignField: '_id', as: 'brand' } },
        { $unwind: '$brand' },
        { $group: { _id: '$brand.sBrand', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 }
      ]);
  
      return res.status(200).json({ brand: brandCount[0]._id, count: brandCount[0].count });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = {
    brand,
    car,
    user,
    seller,
    transaction,
    getTotalSoldCar
}