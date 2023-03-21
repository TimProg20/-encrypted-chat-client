const crypto = require("crypto");

const keyModel = require("../models/keyModel.js");

const algorithm = 'aes-256-cbc';

function encrypt(event, request)  {

  let response = keyModel.selectFirst({ userId: request.userId, isActive: true });

  if (!response.success) {
    return response;
  }

  if (response.result === null) {
    return {
      success: false,
      result: 'Key wasn\'t found'
    }
  }

  const cipher = crypto.createCipher(algorithm, response.result.key);

  let encrypted = cipher.update(request.value, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    success: true,
    result: encrypted
  }
}

function decrypt(event, request) {

  let response = keyModel.selectFirst({ userId: request.userId, isActive: true });

  if (!response.success) {
    return response;
  }

  if (response.result === null) {
    return {
      success: false,
      result: 'Key wasn\'t found'
    }
  }

  const decipher = crypto.createDecipher(algorithm, response.result.key);

  let decrypted = decipher.update(request.value, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return {
    success: true,
    result: decrypted
  }
}


module.exports = {
  encrypt,
  decrypt
};