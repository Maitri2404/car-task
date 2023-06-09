// const jwt = require('jsonwebtoken');
const Seller = require('../model/sellers')
const User = require('../model/users'); 

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.userId = decoded.id;

    try {
      const user = await User.findById(decoded.id);

      if (!user || (!user.isAdmin && !isAuthorized(user.role, req.path, req.method))) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      next();
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

function isAdmin(role, path, method) {
  if (role === 'admin' || path.startsWith('/admin')) {
    return true;
  }

  return false;
}

async function checkCity(req, res, next) {
  try {
    const { iSellerId, iUserId } = req.body;
    console.log(req.body)
    const seller = await Seller.findOne({ sSellerName: iSellerId });
    // console.log("seller: ",seller);
    const user = await User.findOne({ sUserName: iUserId });
    // console.log("user: ",user);
    if (seller.sSellerCity === user.sUserCity) {
      next();
    } else {
      return res.status(404).json({ error: 'Seller and user are not from the same city' });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = { checkCity, isAdmin };